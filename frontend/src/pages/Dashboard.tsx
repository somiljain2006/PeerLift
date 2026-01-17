import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'OPEN' | 'MY_POSTED' | 'MY_ACCEPTED'>('OPEN');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchTasks = async () => {
        try {
            let response;
            if (activeTab === 'OPEN') response = await taskService.getOpenTasks();
            else if (activeTab === 'MY_POSTED') response = await taskService.getMyPostedTasks();
            else if (activeTab === 'MY_ACCEPTED') response = await taskService.getMyAcceptedTasks();

            setTasks(response?.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load tasks');
        }
    };

    useEffect(() => {
        void fetchTasks();
    }, [activeTab]);

    const handleAcceptTask = async (taskId: number) => {
        try {
            await taskService.acceptTask(taskId);
            toast.success('Task Accepted!');
            await fetchTasks();
        } catch (error) {
            toast.error('Could not accept task');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">PeerLift</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        + New Task
                    </button>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto mt-8 px-4">

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab('OPEN')}
                        className={`px-6 py-3 font-medium ${activeTab === 'OPEN' ? 'border-b-2 border-blue-600 ' +
                            'text-blue-600' : 'text-gray-500'}`}
                    >
                        Marketplace
                    </button>
                    <button
                        onClick={() => setActiveTab('MY_ACCEPTED')}
                        className={`px-6 py-3 font-medium ${activeTab === 'MY_ACCEPTED' ? 'border-b-2 ' +
                            'border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                        My Assignments
                    </button>
                    <button
                        onClick={() => setActiveTab('MY_POSTED')}
                        className={`px-6 py-3 font-medium ${activeTab === 'MY_POSTED' ? 'border-b-2 ' +
                            'border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                        My Requests
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isMyPosted={activeTab === 'MY_POSTED'}
                                onAccept={handleAcceptTask}
                                // --- UPDATE THIS LINE ---
                                onViewSubmission={(id) => navigate(`/submission/${id}`, {
                                    state: {
                                        task: task,
                                        isMyPosted: activeTab === 'MY_POSTED'
                                    }
                                })}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-10 text-gray-500">
                            No tasks found in this category.
                        </div>
                    )}
                </div>
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => void fetchTasks()}
            />
        </div>
    );
};

export default Dashboard;