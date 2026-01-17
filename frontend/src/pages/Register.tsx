import { useState } from 'react'; // <--- Added useState
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
    email: yup.string()
        .required('Email is missing')
        .matches(/^\s*[^@\s]+@[^@\s]+\.[^@\s]+\s*$/, 'Invalid email format'),

    username: yup.string()
        .required('Username is missing')
        .min(3, 'Username must be at least 3 chars')
        .max(20, 'Username must be max 20 chars')
        .matches(/^(?![_.])(?!.*[_.]{2})[A-Za-z0-9._]+(?<![_.])$/,
            'Invalid username format (no spaces, special start/end)'),

    password: yup.string()
        .required('Password is missing')
        .max(16, 'Password must not exceed 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])(?!.*\s).+$/,
            'Password must have 1 Upper, 1 Lower, 1 Digit, 1 Special char'),
});

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await authService.register(data);
            if (response.data.status === 'OK' || response.status === 200) {
                toast.success('OTP sent to email!');
                navigate('/verify-otp', {
                    state: {
                        email: data.email,
                        username: data.username,
                        password: data.password
                    }
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-gray-500 hover:text-blue-600 mb-4 flex items-center transition-colors"
                >
                    &larr; Back to Home
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input {...register('email')} className="w-full border p-2 rounded mt-1" />
                        <p className="text-red-500 text-xs">{errors.email?.message}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input {...register('username')} className="w-full border p-2 rounded mt-1" />
                        <p className="text-red-500 text-xs">{errors.username?.message}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                className="w-full border p-2 rounded pr-10"
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
                                              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5
                                              12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112
                                              4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228
                                              6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21
                                              21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88
                                              9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638
                                              0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12
                                               19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0
                                         016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-red-500 text-xs">{errors.password?.message}</p>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;