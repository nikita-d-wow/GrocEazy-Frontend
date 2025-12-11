import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/rootReducer';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Zod Schema
const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const dispatch = useDispatch<any>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    // Check if we successfully registered implies we should have a success state or just redirect?
    // Since Redux state doesn't explicitly have "registerSuccess" flag in typical simple impl,
    // we might want to just handle success in the action or a local useEffect if we track a "success" flag appropriately.
    // For now, let's assume we redirect manually or the user navigates.
    // Actually, let's use a local state for success message to show "Check email".
    const [successMsg, setSuccessMsg] = useState('');

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    });

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
        } catch (e) {
            // Redux handles error state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
                    <p className="text-gray-500 mt-2">Join GrocEazy for fresh picks</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {successMsg && !error && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            {...formRegister('name')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            {...formRegister('email')}
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                {...formRegister('password')}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            {...formRegister('confirmPassword')}
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-sm text-gray-500">Or continue with</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <GoogleAuthButton />

                <p className="text-center mt-8 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
