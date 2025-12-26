import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchUserProfile } from '../../redux/actions/profileActions';
import { logout } from '../../redux/actions/authActions';
import { UPDATE_PROFILE_SUCCESS } from '../../redux/types/authTypes';

import { passwordSchema } from '../../utils/validationSchemas';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Input from '../../components/common/Input';

const passwordSchemaForm = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormInputs = z.infer<typeof passwordSchemaForm>;

export default function SetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchemaForm),
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = async (data: PasswordFormInputs) => {
    setLoading(true);
    try {
      await api.post('/api/auth/set-password', { password: data.password });

      // Manually update local state to ensure hasPassword is true immediately
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: { hasPassword: true },
      });

      // Update local profile to reflect that password is set
      await dispatch(fetchUserProfile());

      toast.success('Password set successfully!');
      navigate('/');
    } catch {
      toast.error('Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Set Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please set a password for your account to continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Set Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
