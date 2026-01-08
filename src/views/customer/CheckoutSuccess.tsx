import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        if (!orderId) {
            setStatus('failed');
            return;
        }

        const verifyPayment = async () => {
            try {
                const { data } = await api.get(`/api/payment/verify/${orderId}`);
                if (data.status === 'SUCCESS') {
                    setStatus('success');
                    toast.success('Payment successful!');
                } else {
                    setStatus('failed');
                    toast.error('Payment verification failed.');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Payment verification error');
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [orderId]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center space-y-6">
                {status === 'loading' && (
                    <>
                        <Loader className="w-16 h-16 text-primary animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
                        <p className="text-gray-500">Please wait while we confirm your transaction.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h2>
                        <p className="text-gray-500">Your order has been confirmed and is being processed.</p>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20"
                        >
                            View My Orders
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                            <XCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
                        <p className="text-gray-500">Something went wrong with your payment. Please try again.</p>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutSuccess;
