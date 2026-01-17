import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const OtpVerify = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');

    const handleVerify = async () => {
        try {
            await authService.validateRegistration({
                email: state.email,
                otp: otp,
                type: 'REGISTRATION',
                Token: ''
            });

            toast.success('Account Verified!');

            try {
                const loginResponse = await authService.login({
                    username: state.username,
                    password: state.password
                });

                const { accessToken, refreshToken } = loginResponse.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                navigate('/dashboard');

            } catch (loginError) {
                console.error("Auto-login failed", loginError);
                navigate('/login');
            }

        } catch (error: any) {
            toast.error('Invalid OTP');
        }
    };

    const handleResend = async () => {
        await authService.resendOtp({ email: state.email, token: '' });
        toast.success('OTP Resent');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                <p className="mb-4 text-sm text-gray-600">Sent to {state?.email}</p>

                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full border p-2 rounded mb-4 text-center letter-spacing-2"
                />

                <button onClick={handleVerify} className="w-full bg-green-600 text-white p-2 rounded mb-2">
                    Verify
                </button>
                <button onClick={handleResend} className="text-blue-600 text-sm hover:underline">
                    Resend OTP
                </button>
            </div>
        </div>
    );
};

export default OtpVerify;