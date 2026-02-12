import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { todoService } from '@/services/todoService';
import type { Todo } from '@/utils/validation';
import { LogOut, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskItem from '@/components/TaskItem';
import CreateTaskModal from '@/components/CreateTaskModal';

const DashboardPage: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: todos, isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: todoService.getTodos,
    });

    const activeTasks = todos ? todos.filter((t: Todo) => t.status !== 'completed').length : 0;
    const completedTasks = todos ? todos.filter((t: Todo) => t.status === 'completed').length : 0;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]" />
            </div>

            <header className="max-w-5xl mx-auto flex justify-between items-center mb-12 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Task Desk</h1>
                    <p className="text-slate-400 mt-1">Manage your productivity.</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-700"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </header>

            <main className="max-w-5xl mx-auto relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 shadow-xl"
                    >
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Tasks</p>
                        <p className="text-4xl font-bold text-white">{todos?.length || 0}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 shadow-xl"
                    >
                        <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
                        <p className="text-4xl font-bold text-emerald-400">{completedTasks}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800/50 shadow-xl"
                    >
                        <p className="text-slate-500 text-sm font-medium mb-1">In Progress</p>
                        <p className="text-4xl font-bold text-indigo-400">{activeTasks}</p>
                    </motion.div>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-200">Your Tasks</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-3 pb-20">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-indigo-500" size={32} />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                            <p>Failed to load tasks.</p>
                        </div>
                    ) : todos?.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                            <p>No tasks found. Create one to get started!</p>
                        </div>
                    ) : (
                        todos?.map((todo: Todo) => (
                            <motion.div
                                key={todo._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <TaskItem todo={todo} />
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Modals */}
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;
