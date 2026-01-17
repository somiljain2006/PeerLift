import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [step, setStep] = useState<'OTP' | 'PASSWORD'>('OTP');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleVerifyOtp = async () => {
        try {
            const response = await authService.validateForgotOtp({ email: state.email, otp });

            const token = response.data.data?.token || response.data.data?.Token || response.data.data;

            if(token) {
                setResetToken(token);
                setStep('PASSWORD');
                toast.success('OTP Verified. Set new password.');
            } else {
                toast.error('System Error: Reset token missing');
            }
        } catch (error) {
            toast.error('Invalid OTP');
        }
    };

    const handleResetPassword = async () => {
        try {
            await authService.resetPassword({ newPassword, Token: resetToken });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    const handleResendOtp = async () => {
        try {
            //
            await authService.resendForgotOtp({ email: state.email });
            toast.success('OTP has been resent to your email');
        } catch (error) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>

                {step === 'OTP' ? (
                    <>
                        <p className="text-sm text-gray-600 mb-4">Enter OTP sent to {state?.email}</p>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full border p-2 rounded mb-4"
                        />
                        <button onClick={handleVerifyOtp} className="w-full bg-blue-600 text-white p-2 rounded mb-3">
                            Verify OTP
                        </button>

                        {/* ✅ NEW: Resend Button */}
                        <div className="text-center">
                            <button
                                onClick={handleResendOtp}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">Enter your new password</p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full border p-2 rounded mb-4"
                        />
                        <button onClick={handleResetPassword} className="w-full bg-green-600 text-white p-2 rounded">
                            Change Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;