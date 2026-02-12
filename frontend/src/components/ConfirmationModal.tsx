import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    isDestructive = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{title}</h3>
                                <p className="text-slate-400 text-sm mt-1">{message}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-lg transition-colors ${isDestructive
                                        ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                                    }`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
