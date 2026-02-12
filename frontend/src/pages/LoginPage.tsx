import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { LogIn, Loader2, CheckCircle, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const registered = searchParams.get('registered');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            navigate('/');
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-800/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-indigo-500/10 hover:border-slate-700/50">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                            <LogIn size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 mt-2 text-sm">Sign in to continue your progress.</p>
                    </div>

                    {registered && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                            <CheckCircle size={20} />
                            <span className="text-sm font-medium">Account created! Please sign in.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700/50 focus:ring-indigo-500/20'} rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-medium text-slate-300">Password</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${errors.password ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700/50 focus:ring-indigo-500/20'} rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {mutation.isError && (
                            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm text-center">
                                Invalid credentials. Please try again.
                            </div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
