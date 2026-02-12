import React, { useState } from 'react';
import type { Todo } from '@/utils/validation';
import { CheckCircle2, Circle, Trash2, Edit2, Clock } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services/todoService';

interface TaskItemProps {
    todo: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ todo }) => {
    const queryClient = useQueryClient();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const toggleMutation = useMutation({
        mutationFn: () =>
            todoService.updateTodo(todo._id, {
                status: todo.status === 'completed' ? 'pending' : 'completed',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => todoService.deleteTodo(todo._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const isCompleted = todo.status === 'completed';

    return (
        <>
            <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${isCompleted
                ? 'bg-slate-800/30 border-slate-800 opacity-60 hover:opacity-80'
                : 'bg-slate-800/60 border-slate-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5'
                }`}>
                <button
                    onClick={() => {
                        if (!isCompleted) {
                            setIsConfirmOpen(true);
                        } else {
                            toggleMutation.mutate();
                        }
                    }}
                    className={`mt-1 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-500 hover:text-indigo-400'
                        }`}
                >
                    {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-base truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {todo.title}
                    </h4>
                    {todo.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{todo.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => deleteMutation.mutate()}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => toggleMutation.mutate()}
                title="Complete Task"
                message="Are you sure you want to mark this task as complete?"
                confirmLabel="Yes, Complete"
            />
        </>
    );
};

export default TaskItem;
