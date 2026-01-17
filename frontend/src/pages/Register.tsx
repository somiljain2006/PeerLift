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
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await authService.register(data);
            if (response.data.status === 'OK' || response.status === 200) {
                toast.success('OTP sent to email!');

                // --- CHANGE IS HERE ---
                // We pass username and password to the next page so we can auto-login later
                navigate('/verify-otp', {
                    state: {
                        email: data.email,
                        username: data.username,
                        password: data.password
                    }
                });
                // ----------------------
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
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
                        <input type="password" {...register('password')} className="w-full border p-2 rounded mt-1" />
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