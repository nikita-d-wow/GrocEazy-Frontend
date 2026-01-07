import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '../../redux/actions/authActions';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { passwordSchema } from '../../utils/validationSchemas';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Input from '../../components/common/Input';

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token: paramToken } = useParams();

  // Support both query param (?token=...) and path param (/token)
  const token = searchParams.get('token') || paramToken;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Debugging
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('ResetPassword Debug:', {
      url: window.location.href,
      queryToken: searchParams.get('token'),
      paramToken,
      resolvedToken: token,
    });
  }, [searchParams, paramToken, token]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  useEffect(() => {
    if (!token) {
      // Small delay to allow debugging before redirect (optional, currently instant)
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordInputs) => {
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(resetPassword(token, data.password));
      toast.success('Password updated successfully');
      navigate('/login');
    } catch {
      // Error handled by reducer/toast
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Reset Password</h1>
          <p className="text-muted-text mt-2">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              error={errors.password?.message}
              {...register('password')}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
