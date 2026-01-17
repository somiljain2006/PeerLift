import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
    task: Task;
    isMyPosted?: boolean;
    onAccept?: (id: number) => void;
    onViewSubmission?: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isMyPosted, onAccept,
                                               onViewSubmission }) => {

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.OPEN:
                return (
                    <span className="bg-green-100 text-green-800 text-xs mt-1 px-2 py-1 rounded">
                        OPEN
                    </span>
                );
            case TaskStatus.ACCEPTED:
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs mt-1 px-2 py-1 rounded">
                        IN PROGRESS
                    </span>
                );
            case TaskStatus.COMPLETED:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs mt-1 px-2 py-1 rounded">
                        COMPLETED
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
                <div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {task.subject}
                    </span>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">{task.title}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-green-600 font-bold text-lg">{task.rewardCredits} Credits</span>
                    {getStatusBadge(task.status)}
                </div>
            </div>

            <p className="text-gray-600 mt-3 text-sm line-clamp-2">{task.description}</p>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">
                    Posted by: {task.postedBy?.username || 'Unknown'}
                </span>

                {task.status === TaskStatus.OPEN && !isMyPosted && onAccept && (
                    <button
                        onClick={() => onAccept(task.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                        Accept Task
                    </button>
                )}

                {(task.status === TaskStatus.ACCEPTED || task.status === TaskStatus.COMPLETED) && onViewSubmission && (
                    <button
                        onClick={() => onViewSubmission(task.id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
                    >
                        {task.status === TaskStatus.COMPLETED ? "View Results" : (isMyPosted ? "View Status" :
                            "Submit Work")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;