import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todoService';
import { createTodoSchema, type CreateTodoFormData } from '@/utils/validation';
import { sanitizeInput } from '@/utils/security';
import { X, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTodoFormData>({
        resolver: zodResolver(createTodoSchema),
    });

    const mutation = useMutation({
        mutationFn: todoService.createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            reset();
            onClose();
        },
        onError: (error) => {
            console.error('Failed to create task:', error);
            // Optional: Add a toast here
        },
    });

    const onSubmit = (data: CreateTodoFormData) => {
        console.log('Submitting task:', data); // Debug log
        const safeData = {
            title: sanitizeInput(data.title),
            description: data.description ? sanitizeInput(data.description) : undefined,
        };
        mutation.mutate(safeData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-50 w-[90%] md:w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h3 className="text-xl font-semibold text-white">Create New Task</h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Task Title</label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    placeholder="What needs to be done?"
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 outline-none transition-all"
                                    autoFocus
                                />
                                {errors.title && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (Optional)</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Add details..."
                                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 outline-none transition-all resize-none"
                                />
                                {errors.description && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Create Task
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;
