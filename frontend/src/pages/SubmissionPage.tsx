import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { submissionService, taskService } from '../services/api';
import { Submission, SubmissionStatus, Task } from '../types';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080';

const SubmissionPage = () => {
    const { taskId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const task = location.state?.task as Task;
    const isMyPosted = location.state?.isMyPosted as boolean;

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);

    const [reviewStatus, setReviewStatus] = useState<SubmissionStatus>(SubmissionStatus.APPROVED);
    const [feedback, setFeedback] = useState('');
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

    const getFullImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };

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

    const onReview = async () => {
        try {
            if(!feedback.trim()) {
                toast.error("Please provide feedback");
                return;
            }
            await taskService.reviewSubmission(Number(taskId), reviewStatus, feedback);
            toast.success('Review submitted!');
            window.location.reload();
        } catch (error) {
            toast.error('Review failed');
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

                {/* Task Header Details */}
                <div className="border-b pb-4 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                            <span className="text-sm text-gray-500">{task.subject} &bull; {task.rewardCredits}
                                Credits</span>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="text-sm
                        text-blue-600 hover:underline">
                            &larr; Back to Dashboard
                        </button>
                    </div>
                    <p className="text-gray-700 mb-4">{task.description}</p>

                    {task.imageUrls && task.imageUrls.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Task Attachments:</h4>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {task.imageUrls.map((url, idx) => (
                                    <a key={idx} href={getFullImageUrl(url)} target="_blank" rel="noreferrer">
                                        <img
                                            src={getFullImageUrl(url)}
                                            alt="Task attachment"
                                            className="h-24 w-24 object-cover rounded border hover:opacity-80"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {submission ? (
                    <div>
                        <div className={`border p-4 rounded mb-6 flex justify-between items-center ${
                            submission.status === SubmissionStatus.APPROVED ? 'bg-green-50 border-green-200' :
                                submission.status === SubmissionStatus.REJECTED ? 'bg-red-50 border-red-200' :
                                    'bg-yellow-50 border-yellow-200'
                        }`}>
                            <div>
                                <h3 className={`font-bold ${
                                    submission.status === SubmissionStatus.APPROVED ? 'text-green-800' :
                                        submission.status === SubmissionStatus.REJECTED ? 'text-red-800' :
                                            'text-yellow-800'
                                }`}>
                                    Status: {submission.status}
                                </h3>
                                <p className="text-sm text-gray-600">Submitted by {submission.submittedBy}</p>
                                {submission.feedback && (
                                    <p className="mt-2 text-sm italic">" {submission.feedback} "</p>
                                )}
                            </div>
                            {submission.rating && (
                                <div className="text-yellow-600 font-bold text-lg">
                                    {submission.rating} / 5 ★
                                </div>
                            )}
                        </div>

                        {/* Submission Images */}
                        <h4 className="font-semibold mb-3">Solution Proof:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {submission.imageUrls.map((url, idx) => (
                                <a key={idx} href={getFullImageUrl(url)} target="_blank" rel="noreferrer"
                                   className="block border rounded hover:opacity-90">
                                    <img
                                        src={getFullImageUrl(url)}
                                        alt={`Proof ${idx}`}
                                        className="w-full h-48 object-cover rounded"
                                    />
                                </a>
                            ))}
                        </div>

                        {isMyPosted && (
                            <div className="space-y-6">
                                {submission.status === SubmissionStatus.PENDING && (
                                    <div className="bg-gray-100 p-6 rounded">
                                        <h3 className="text-lg font-bold mb-4">Review Submission</h3>
                                        <div className="flex gap-4 mb-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked={reviewStatus === SubmissionStatus.APPROVED}
                                                    onChange={() => setReviewStatus(SubmissionStatus.APPROVED)}
                                                /> Approve
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked={reviewStatus === SubmissionStatus.REJECTED}
                                                    onChange={() => setReviewStatus(SubmissionStatus.REJECTED)}
                                                /> Reject
                                            </label>
                                        </div>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) =>
                                                setFeedback(e.target.value)}
                                            placeholder="Write your feedback here..."
                                            className="w-full border p-2 rounded mb-4 h-24"
                                        />
                                        <button
                                            onClick={onReview}
                                            className="bg-blue-600 text-white px-6 py-2 rounded
                                            hover:bg-blue-700"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                )}

                                {submission.status === SubmissionStatus.APPROVED && !submission.rating && (
                                    <div className="bg-blue-50 border border-blue-200 p-6 rounded text-center">
                                        <h3 className="text-lg font-bold mb-4">Rate & Release Credits</h3>
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
                                            className="bg-green-600 text-white px-6 py-2 rounded
                                            hover:bg-green-700"
                                        >
                                            Finalize & Pay
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                ) : (
                    <div>
                        {isMyPosted ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-xl">Waiting for submission...</p>
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
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0 file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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