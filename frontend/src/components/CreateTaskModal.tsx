import React from 'react';
import { useForm } from 'react-hook-form';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose,
                                                             onSuccess }) => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const images = data.images && data.images.length > 0 ? Array.from(data.images) as File[] :
                undefined;

            const taskRequest = {
                title: data.title,
                description: data.description,
                subject: data.subject,
                rewardCredits: data.rewardCredits
            };

            await taskService.createTask(taskRequest, images);

            toast.success('Task Created Successfully!');
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Post a New Task</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input {...register('title')} placeholder="Title"
                           required className="w-full border p-2 rounded" />
                    <input {...register('subject')} placeholder="Subject (e.g. Math, Java)"
                           required className="w-full border p-2 rounded" />
                    <textarea {...register('description')} placeholder="Description"
                              required className="w-full border p-2 rounded h-24" />
                    <input {...register('rewardCredits')} type="number" placeholder="Reward Credits"
                           required className="w-full border p-2 rounded" />

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Attachments (Optional)</label>
                        <input
                            {...register('images')}
                            type="file"
                            multiple
                            accept="image/*"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded
                            file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600
                        hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded
                        hover:bg-blue-700">Post Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;