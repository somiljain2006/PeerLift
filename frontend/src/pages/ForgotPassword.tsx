import { useForm } from 'react-hook-form';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await authService.forgotPassword(data.email);
            toast.success('OTP sent to your email');
            navigate('/reset-password-verify', { state: { email: data.email } });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Request failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                <p className="text-sm text-gray-600 mb-4">Enter your email to receive a reset OTP.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        {...register('email')}
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;