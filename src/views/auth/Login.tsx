import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, logout } from '../../redux/actions/authActions';
import toast from 'react-hot-toast';
import type { RootState } from '../../redux/rootReducer';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '../../constants/roles';
import ThemeToggle from '../../components/common/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { loading, error, accessToken, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (accessToken && user) {
      // Check for deactivated account
      if (user.isActive === false) {
        toast.error(
          'Account deactivated. Contact support if you believe this is an error.'
        );
        dispatch(logout()); // Immediately clear state
        return;
      }

      if (user.hasPassword === false) {
        navigate('/set-password');
      } else if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (user.role === UserRole.MANAGER) {
        navigate('/manager');
      } else {
        navigate('/');
      }
    }
  }, [accessToken, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex justify-between items-center w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] pointer-events-none">
        <Link to="/" className="flex items-center gap-2 pointer-events-auto">
          <span className="text-xl font-bold text-primary">GrocEazy</span>
        </Link>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">Welcome Back</h1>
          <p className="text-muted-text mt-2">
            Sign in to continue to GrocEazy
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 text-rose-500 text-sm rounded-lg">
            {error}
          </div>
        )}

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

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-border rounded-lg bg-card text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-text/50"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-sm text-muted-text">Or continue with</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <GoogleAuthButton />

        <p className="text-center mt-8 text-sm text-muted-text">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
