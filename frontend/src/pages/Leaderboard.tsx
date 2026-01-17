import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '../services/api';
import { User } from '../types';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await leaderboardService.getLeaderboard();
                setUsers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        void fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">🏆 Top Contributors</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded
                        hover:bg-gray-100"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading rankings...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Rank</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tasks Completed</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Credits Earned</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                        {index > 2 && `#${index + 1}`}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {user.username}
                                        {user.rating > 0 && (
                                            <span className="ml-2 text-xs text-yellow-600
                                            bg-yellow-100 px-2 py-0.5 rounded-full">
                                ★ {user.rating.toFixed(1)}
                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.tasksCompleted}</td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600">
                                        {user.credits}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;