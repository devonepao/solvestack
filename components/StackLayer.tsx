import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { Trash2, GripVertical, Play, Pause, Pencil } from 'lucide-react';

interface StackLayerProps {
  task: Task;
  index: number;
  isActive: boolean;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onUpdateDuration: (id: string, newDurationMinutes: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const StackLayer: React.FC<StackLayerProps> = ({ 
  task, 
  index, 
  isActive, 
  onDelete, 
  onActivate, 
  onUpdateTitle,
  onUpdateDuration,
  onDragStart,
  onDragEnter,
  onDragEnd
}) => {
  // Title Editing State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Duration Editing State
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [durationValue, setDurationValue] = useState(Math.ceil(task.remainingDuration / 60).toString());
  const durationInputRef = useRef<HTMLInputElement>(null);

  // --- Title Logic ---
  const handleTitleSave = () => {
    if (titleValue.trim()) {
      onUpdateTitle(task.id, titleValue);
    } else {
      setTitleValue(task.title); // Revert if empty
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // --- Duration Logic ---
  useEffect(() => {
    if (!isEditingDuration) {
       setDurationValue(Math.ceil(task.remainingDuration / 60).toString());
    }
  }, [task.remainingDuration, isEditingDuration]);

  useEffect(() => {
    if (isEditingDuration && durationInputRef.current) {
      durationInputRef.current.focus();
      durationInputRef.current.select();
    }
  }, [isEditingDuration]);

  const handleDurationSave = () => {
    const mins = parseInt(durationValue, 10);
    if (!isNaN(mins) && mins > 0) {
      onUpdateDuration(task.id, mins);
    } else {
      setDurationValue(Math.ceil(task.remainingDuration / 60).toString());
    }
    setIsEditingDuration(false);
  };

  const handleDurationKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleDurationSave();
      if (e.key === 'Escape') {
          setIsEditingDuration(false);
          setDurationValue(Math.ceil(task.remainingDuration / 60).toString());
      }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`
        group relative w-full mb-3 rounded-xl border transition-all duration-200 ease-out
        ${isActive 
          ? 'bg-primary-50 border-primary-200 shadow-md scale-[1.01]' 
          : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-sm'
        }
      `}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
          <GripVertical size={20} />
        </div>

        {/* Play/Active State Indicator */}
        <button 
          onClick={() => !isActive && onActivate(task.id)}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center transition-colors
            ${isActive 
              ? 'bg-primary-500 text-white shadow-sm cursor-default' 
              : 'bg-slate-100 text-slate-400 hover:bg-primary-100 hover:text-primary-600'
            }
          `}
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Title Edit */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="w-full bg-white border border-primary-300 rounded px-2 py-1 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-primary-200"
            />
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="group/title flex items-center gap-2 cursor-text"
            >
              <h3 className={`font-semibold text-base truncate ${isActive ? 'text-primary-900' : 'text-slate-700'} ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h3>
              <Pencil size={12} className="opacity-0 group-hover/title:opacity-100 text-slate-400 transition-opacity" />
            </div>
          )}
          
          {/* Duration Edit */}
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
             {isEditingDuration ? (
                <div className="flex items-center bg-white rounded border border-primary-300 focus-within:ring-2 focus-within:ring-primary-200" onClick={(e) => e.stopPropagation()}>
                    <input
                        ref={durationInputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={durationValue}
                        onChange={(e) => setDurationValue(e.target.value)}
                        onBlur={handleDurationSave}
                        onKeyDown={handleDurationKeyDown}
                        className="w-8 px-1 py-0.5 text-xs bg-transparent outline-none text-center font-semibold text-slate-700"
                    />
                    <span className="pr-1 text-slate-400 select-none">m</span>
                </div>
             ) : (
                <button 
                   onClick={(e) => { e.stopPropagation(); setIsEditingDuration(true); }}
                   className={`px-2 py-0.5 rounded-full cursor-text hover:ring-1 hover:ring-slate-300 transition-all border border-transparent hover:border-slate-200 hover:bg-white ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100'}`}
                   title="Click to edit duration"
                >
                  {Math.ceil(task.remainingDuration / 60)}m
                </button>
             )}
             {isActive && <span className="text-primary-600 animate-pulse">Running</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StackLayer;