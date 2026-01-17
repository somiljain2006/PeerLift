import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        try {

            const response = await authService.login(data);
            handleSuccess(response.data.data);
        } catch (error: any) {
            toast.error('Invalid credentials');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {

            const response = await authService.googleLogin(credentialResponse.credential);
            handleSuccess(response.data.data);
        } catch (error) {
            toast.error('Google login failed');
        }
    };

    const handleSuccess = (tokens: any) => {

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        toast.success('Logged in successfully');
        navigate('/dashboard');
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium">Username</label>
                            <input {...register('username')} className="w-full border p-2 rounded mt-1" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input type="password" {...register('password')} className="w-full border p-2 rounded mt-1" required />
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                            Login
                        </button>
                    </form>

                    <div className="flex items-center justify-between my-4">
                        <hr className="w-full" /> <span className="px-2 text-gray-500">OR</span> <hr className="w-full" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Login Failed')} />
                    </div>

                    <div className="mt-4 text-center text-sm">
                        <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;