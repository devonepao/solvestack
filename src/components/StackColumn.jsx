import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreVertical, Play, Pause, Plus, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';

const StackColumn = ({ stack, tasks, addTask, deleteTask, updateTask, updateStack, deleteStack }) => {
    const { setNodeRef } = useDroppable({
        id: stack.id,
        data: { type: 'Stack', stack },
    });

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(stack.title);
    const [isRunning, setIsRunning] = useState(stack.isRunning || false);
    const [elapsed, setElapsed] = useState(stack.elapsed || 0);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsed((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        updateStack(stack.id, { ...stack, elapsed, isRunning });
    }, [elapsed, isRunning]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        if (title.trim() !== stack.title) {
            updateStack(stack.id, { ...stack, title });
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full w-[350px] min-w-[350px] glass-column rounded-2xl mx-2 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/40 bg-white/20">
                <div className="flex-1">
                    {isEditingTitle ? (
                        <input
                            autoFocus
                            className="w-full bg-transparent border-b border-blue-400 outline-none text-lg font-semibold text-gray-800"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleTitleBlur();
                            }}
                        />
                    ) : (
                        <h2
                            className="text-lg font-semibold text-gray-800 cursor-text truncate"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {stack.title}
                        </h2>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm font-mono text-gray-600 bg-white/50 px-2 py-1 rounded">
                        {formatTime(elapsed)}
                    </div>
                    <button
                        onClick={toggleTimer}
                        className={`p-1.5 rounded-full transition-colors ${isRunning ? 'bg-amber-100 text-amber-600' : 'bg-white/50 text-gray-500 hover:bg-green-100 hover:text-green-600'}`}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                        onClick={() => deleteStack(stack.id)}
                        className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Tasks Container */}
            <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        Drop tasks here or add one
                    </div>
                )}
            </div>

            {/* Add Task Button */}
            <div className="p-3 border-t border-white/40 bg-white/10">
                <button
                    onClick={() => addTask(stack.id)}
                    className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/60 transition-all border border-transparent hover:border-white/50"
                >
                    <Plus size={18} /> Add Task
                </button>
            </div>
        </div>
    );
};

export default StackColumn;
