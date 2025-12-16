import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userType, setUserType] = useState('user');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        let url = '';
        if (userType === 'user') url = 'https://bookapp-production-3e11.up.railway.app/user/reset-password';
        if (userType === 'vendor') url = 'https://bookapp-production-3e11.up.railway.app/vendors/reset-password';
        if (userType === 'delivery') url = 'https://bookapp-production-3e11.up.railway.app/delivery/reset-password';

        try {
            await axios.post(url, { token, newPassword });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || err.response?.data || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Enter your token and new password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['user', 'vendor', 'delivery'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setUserType(type)}
                                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${userType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
                        <input
                            type="text"
                            required
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Paste token here"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Min 6 characters"
                        />
                    </div>

                    {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
                    {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Resetting...' : <><Lock size={18} /> Reset Password</>}
                    </button>
                </form>
            </div>
        </div>
    );
}


