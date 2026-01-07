import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword } from '../../redux/actions/authActions';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    try {
      await dispatch(forgotPassword(data.email));
      setEmailSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      // Error handled by reducer/thunk or toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <Link
            to="/login"
            className="text-muted-text hover:text-text flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Forgot Password?</h1>
          <p className="text-muted-text mt-2">
            Enter your email and we'll send you instructions to reset your
            password
          </p>
        </div>

        {emailSent ? (
          <div className="text-center p-6 bg-emerald-500/10 rounded-lg">
            <h3 className="text-emerald-500 font-semibold mb-2">
              Check your email
            </h3>
            <p className="text-emerald-500 text-sm">
              We have sent a password reset link to your email address.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="mt-4 text-emerald-600 font-medium hover:underline text-sm"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-text/50"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
