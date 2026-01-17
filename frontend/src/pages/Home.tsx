import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to PeerLift</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                The ultimate platform for peer-to-peer growth. Join us today to start your journey.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="px-6 py-3 bg-white text-blue-600 font-medium border border-blue-600 rounded-lg shadow-sm hover:bg-gray-50 transition"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;