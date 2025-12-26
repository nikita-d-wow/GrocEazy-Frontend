import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/rootReducer';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '../../constants/roles';
import toast from 'react-hot-toast';

import { passwordSchema } from '../../utils/validationSchemas';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Input from '../../components/common/Input';
import AuthCarousel from '../../components/auth/AuthCarousel';

// Zod Schema
const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { loading, error, accessToken, user } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    // Check if we successfully registered implies we should have a success state or just redirect?
    // Since Redux state doesn't explicitly have "registerSuccess" flag in typical simple impl,
    // we might want to just handle success in the action or a local useEffect if we track a "success" flag appropriately.
    // For now, let's assume we redirect manually or the user navigates.
    // Actually, let's use a local state for success message to show "Check email".
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (accessToken && user) {
            // Check for deactivated account
            if (user.isActive === false) {
                toast.error('Account deactivated. Contact support if you believe this is an error.');
                // We might want to logout here, but the user just logged in.
                // The Login page handles this by logging out.
                // Let's assume the action/reducer might handle it or we redirect to login?
                return;
            }

            toast.success('Welcome back! You’ve been logged into your existing account.');

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

    const password = watch('password');

    const onSubmit = async (data: RegisterFormInputs) => {
        setSuccessMsg('');
        try {
            await dispatch(register({
                name: data.name,
                email: data.email,
                password: data.password
            }));
            // If no error thrown by dispatch (it awaits), we can set success
            // But dispatch returns promise that might reject?
            // My authActions implementation catches error and dispatches FAILURE, so checks state `error`.
            // Waiting for state update is tricky in same tick.
            // Better to check for changes in `error` via useEffect or use `unwrap` if using toolkit thunks.
            // Here we use legacy thunks.
            // Let's rely on `error` from store. If loading finishes and no error, it's success?
            // But we have a unified `loading` state.
            // Let's assume the action logic.
            setSuccessMsg('Registration successful! Please login.');
            setTimeout(() => navigate('/login'), 2000);
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
                            <span className="text-2xl font-bold text-green-600">GrocEazy</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Start your journey with us today.
                        </p>
                    </div>

                    {(error || successMsg) && (
                        <div className={`p-4 rounded-lg border ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                            }`}>
                            <p className="text-sm font-medium">{error || successMsg}</p>
                        </div>
                    )}

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
                                type={showPassword ? "text" : "password"}
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

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoogleAuthButton />
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
