import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to PeerLift!</h1>
            <p className="mt-2 text-gray-600">You are successfully authenticated.</p>

            <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;