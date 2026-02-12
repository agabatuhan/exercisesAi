import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { sanitizeInput } from '@/utils/security';
import { UserPlus, Loader2, Smartphone, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const mutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            // Show success message or redirect to login
            navigate('/login?registered=true');
        },
        onError: (error: any) => {
            console.error('Registration failed:', error);
            // Here we would ideally show a toast notification
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        // Sanitize inputs before sending
        const safeData = {
            username: sanitizeInput(data.username),
            email: sanitizeInput(data.email),
            password: data.password, // Passwords don't need sanitization, just hashing (backend)
        };
        mutation.mutate(safeData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 ring-1 ring-indigo-500/20">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                        <p className="text-slate-400 mt-2 text-sm">Join thousands managing tasks efficiently.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Globe size={18} />
                                </div>
                                <input
                                    type="text"
                                    {...register('username')}
                                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border ${errors.username ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700/50 focus:ring-indigo-500/20'} rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    placeholder="johndoe"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1.5 text-xs text-red-400 ml-1">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Smartphone size={18} />
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
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {mutation.isError && (
                            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm text-center">
                                Registration failed. Please try again.
                            </div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Footer / Credit */}
            <div className="absolute bottom-6 text-slate-600 text-xs text-center w-full z-0 font-mono opacity-50">
                SECURE • ENCRYPTED • PRIVATE
            </div>
        </div>
    );
};

export default RegisterPage;
