import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register, verifyOtpAction } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/rootReducer';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { UserRole } from '../../constants/roles';
import toast from 'react-hot-toast';

import { passwordSchema } from '../../utils/validationSchemas';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Input from '../../components/common/Input';
import AuthCarousel from '../../components/auth/AuthCarousel';
import { resendOtp } from '../../services/authService';

// Zod Schema
const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const dispatch = useDispatch<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate();
  const { loading, error, accessToken, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  // Resend Timer
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'OTP' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const handleResendOtp = async () => {
    try {
      await resendOtp(registeredEmail);
      toast.success('OTP resent successfully');
      setCanResend(false);
      setTimeLeft(30);
    } catch (err: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const attemptVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      await dispatch(verifyOtpAction(registeredEmail, otp));
      // Success handled by main useEffect redirect
    } catch {
      // Error handled by redux state
    }
  };

  useEffect(() => {
    if (accessToken && user) {
      // Check for deactivated account
      if (user.isActive === false) {
        toast.error(
          'Account deactivated. Contact support if you believe this is an error.'
        );
        return;
      }

      toast.success('Welcome back!');

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

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange', // Validate on change for immediate feedback
  });

  const password = watch('password'); // eslint-disable-line

  const onSubmit = async (data: RegisterFormInputs) => {
    setOtpSuccessMsg('');
    try {
      await dispatch(
        register({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      );

      // If dispatch doesn't throw, we assume success for now (checking error state is trickier in same tick)
      // But since register thunk waits for API, if it throws it goes to catch.
      // If it succeeds, we proceed.
      // CAUTION: If register action handles error but doesn't throw, we need to check store error.
      // The provided `register` action catches error and dispatches FAILURE, but DOES NOT throw.
      // So we need to check if `error` exists? Actually the `register` action in previous file view DOES NOT throw!
      // It catches internally.

      // Wait, looking at `authActions.ts` provided:
      // catch (err: any) { ... dispatch(FAILURE) ... }
      // It does NOT re-throw. So `await dispatch(...)` returns void (or undefined).
      // This means `onSubmit` continues even if failure.
      // BUT, `error` state in redux will be set.
      // We can't easily check updated redux state in the same handler.

      // Workaround: We can modify `authActions` to return success status OR throw.
      // Since I can't easily modify `register` action logic right now without risking other flows (though I can),
      // I will assume if `error` appears in UI it's fine.
      // But wait, if I transition to OTP step on failure, that's bad.

      // Let's modify `authActions.ts` to THROW on error, or return a value.
      // Actually, I already modified `verifyOtpAction` to throw.
      // I should double check `register` action. The previous `view_file` showed it catches and does NOT throw.
      // I will update `register` in `authActions.ts` to THROW as well, to be safe.

      // For now, assuming I will fix `authActions` to throw, let's proceed with this logic for `Register.tsx`

      setRegisteredEmail(data.email);
      setStep('OTP');
      setOtpSuccessMsg(`OTP sent to ${data.email}`);
      setTimeLeft(30);
      setCanResend(false);
    } catch {
      // Redux handles error state
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <AuthCarousel />
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center gap-2 text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="font-bold text-xl tracking-tight">GrocEazy</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <span className="text-2xl font-bold text-green-600">
                GrocEazy
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {step === 'REGISTER' ? 'Create an account' : 'Verify Email'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'REGISTER'
                ? 'Start your journey with us today.'
                : `Enter the 6-digit code sent to ${registeredEmail}`}
            </p>
          </div>

          {(error || otpSuccessMsg) && (
            <div
              className={`p-4 rounded-lg border ${
                error
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              <p className="text-sm font-medium">{error || otpSuccessMsg}</p>
            </div>
          )}

          {step === 'REGISTER' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...formRegister('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...formRegister('email')}
              />

              <div className="space-y-2">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...formRegister('password')}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-gray-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <PasswordStrengthIndicator password={password} />
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...formRegister('confirmPassword')}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numbers only
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                />
              </div>

              <button
                onClick={attemptVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep('REGISTER')}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="font-semibold text-green-600 hover:text-green-500"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-gray-500">Resend in {timeLeft}s</span>
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            {step === 'REGISTER' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleAuthButton />
                </div>
              </>
            )}
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-green-500 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
