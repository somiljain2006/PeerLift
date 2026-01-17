import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { submissionService } from '../services/api';
import { Submission, Task } from '../types';
import toast from 'react-hot-toast';

const SubmissionPage = () => {
    const { taskId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const task = location.state?.task as Task;
    const isMyPosted = location.state?.isMyPosted as boolean;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);

    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                if (!taskId) return;
                const response = await submissionService.getSubmission(Number(taskId));
                setSubmission(response.data.data);
            } catch (error) {
                console.log("No submission found yet");
            } finally {
                setLoading(false);
            }
        };
        void fetchSubmission();
    }, [taskId]);

    const onUpload = async (data: any) => {
        try {
            if (!data.images || data.images.length === 0) {
                toast.error("Please select files");
                return;
            }

            const files = Array.from(data.images) as File[];
            await submissionService.submitSolution(Number(taskId), files);

            toast.success('Solution Submitted!');
            window.location.reload();
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const onRate = async () => {
        try {
            if (rating < 1 || rating > 5) {
                toast.error("Please select a rating");
                return;
            }
            await submissionService.rateSubmission(Number(taskId), rating);
            toast.success('Rating submitted!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to rate submission');
        }
    };

    if (!task && loading) return <div className="p-8">Loading...</div>;

    if (!task) return (
        <div className="p-8 text-center">
            <h2 className="text-xl text-red-500">Context Lost</h2>
            <p>Please go back to Dashboard and click the task again.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4
            text-blue-600 underline">Back to Dashboard</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">

                <div className="border-b pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                        <span className="text-sm text-gray-500">{task.subject} &bull;
                            {task.rewardCredits} Credits</span>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="text-sm
                    text-blue-600 hover:underline">
                        &larr; Back to Dashboard
                    </button>
                </div>

                {submission ? (
                    <div>
                        <div className="bg-green-50 border border-green-200 p-4 rounded mb-6">
                            <h3 className="font-bold text-green-800 mb-2">
                                Solution Submitted by {submission.submittedBy}
                            </h3>
                            {submission.rating ? (
                                <div className="text-yellow-600 font-bold">
                                    Rated: {submission.rating} / 5 Stars
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">Not rated yet</div>
                            )}
                        </div>

                        <h4 className="font-semibold mb-3">Attached Proof/Solution:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {submission.imageUrls.map((url, idx) => (
                                <a key={idx} href={url} target="_blank" rel="noreferrer"
                                   className="block border rounded hover:opacity-90">
                                    <img src={url} alt={`Proof ${idx}`} className="w-full h-48 object-cover rounded" />
                                </a>
                            ))}
                        </div>

                        {isMyPosted && !submission.rating && (
                            <div className="bg-gray-100 p-6 rounded text-center">
                                <h3 className="text-lg font-bold mb-4">Rate this Work</h3>
                                <div className="flex justify-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-3xl ${rating >= star ? 'text-yellow-400' : 
                                                'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={onRate}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Submit Rating & Release Credits
                                </button>
                            </div>
                        )}
                    </div>

                ) : (
                    <div>
                        {isMyPosted ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-xl">Waiting for submission...</p>
                                <p className="text-sm">The user has not uploaded any proof yet.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onUpload)} className="text-center py-10">
                                <div className="mb-6">
                                    <div className="mb-4 text-gray-600">
                                        Upload screenshots or images of your completed work.
                                    </div>
                                    <input
                                        {...register('images')}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="block w-full text-sm
                                        text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                        file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold
                                    hover:bg-green-700 transition"
                                >
                                    Submit Solution
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionPage;