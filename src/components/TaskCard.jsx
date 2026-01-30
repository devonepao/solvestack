import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Play, Pause, X, GripVertical } from 'lucide-react';

const TaskCard = ({ task, deleteTask, updateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [isRunning, setIsRunning] = useState(task.isRunning || false);
    const [elapsed, setElapsed] = useState(task.elapsed || 0);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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

    // Sync timer state back to parent/storage on toggle or unmount potentially
    useEffect(() => {
        updateTask(task.id, { ...task, elapsed, isRunning });
    }, [elapsed, isRunning]);


    const toggleTimer = () => {
        const nextState = !isRunning;
        setIsRunning(nextState);
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        if (title.trim() !== task.title) {
            updateTask(task.id, { ...task, title });
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-white/60 backdrop-blur-md p-3 rounded-xl shadow-sm border border-white/50 mb-3 flex items-center justify-between group hover:shadow-md transition-all task-item ${isRunning ? 'ring-2 ring-blue-300' : ''}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 mr-2 hover:text-gray-600">
                <GripVertical size={16} />
            </div>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        autoFocus
                        className="w-full bg-transparent border-b border-blue-400 outline-none text-gray-800"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleBlur();
                        }}
                    />
                ) : (
                    <div
                        className="text-gray-800 font-medium cursor-text truncate"
                        onClick={() => setIsEditing(true)}
                    >
                        {task.title}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 ml-3">
                <div className="text-xs font-mono text-gray-600 bg-gray-100/50 px-2 py-1 rounded-md min-w-[50px] text-center">
                    {formatTime(elapsed)}
                </div>
                <button
                    onClick={toggleTimer}
                    className={`p-1.5 rounded-full transition-colors ${isRunning ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600'}`}
                >
                    {isRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
