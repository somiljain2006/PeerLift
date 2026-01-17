import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
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
                            <input {...register('username')}
                                   className="w-full border p-2 rounded mt-1" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className="w-full border p-2 rounded pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500
                                    hover:text-gray-700"
                                >
                                    {/* SVG Eye Icon */}
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12
                                                  19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112
                                                  4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293
                                                  5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21
                                                  21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88
                                                  9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12
                                                  4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49
                                                  16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded
                        hover:bg-blue-700">
                            Login
                        </button>
                    </form>

                    <div className="flex items-center justify-between my-4">
                        <hr className="w-full" /> <span className="px-2 text-gray-500">OR</span>
                        <hr className="w-full" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() =>
                            toast.error('Login Failed')} />
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