import React, { useState, useEffect, useRef } from 'react';
import { Plus, Layers, CheckSquare, Clock } from 'lucide-react';
import { Task, TaskStatus, AIResponseItem } from './types';
import { loadTasks, saveTasks } from './services/storage';
import Footer from './components/Footer';
import TimerDisplay from './components/TimerDisplay';
import StackLayer from './components/StackLayer';
import AICreator from './components/AICreator';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(25); // minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Drag and Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize data
  useEffect(() => {
    const loaded = loadTasks();
    const activeStack = loaded.filter(t => t.status !== TaskStatus.COMPLETED);
    setTasks(activeStack);
  }, []);

  // Persist data
  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Timer Ticking Logic
  useEffect(() => {
    let interval: any;

    if (isTimerActive && tasks.length > 0) {
      interval = setInterval(() => {
        setTasks(prevTasks => {
          const newTasks = [...prevTasks];
          const activeTask = newTasks[0]; // Top of stack

          if (activeTask && activeTask.remainingDuration > 0) {
            activeTask.remainingDuration -= 1;
            
            if (activeTask.remainingDuration === 0) {
              setIsTimerActive(false);
              if (audioRef.current) audioRef.current.play().catch(e => console.log('Audio play failed', e));
            }
          }
          return newTasks;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, tasks.length]);

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      totalDuration: newTaskDuration * 60,
      remainingDuration: newTaskDuration * 60,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
    };

    // Add to END of stack for typical todo list behavior
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const handleAIAddTasks = (items: AIResponseItem[]) => {
    const newTasks: Task[] = items.map(item => ({
      id: generateId(),
      title: item.task,
      totalDuration: item.estimatedMinutes * 60,
      remainingDuration: item.estimatedMinutes * 60,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
    }));
    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (tasks.length === 1 && tasks[0].id === id) {
      setIsTimerActive(false);
    }
  };

  const handleCompleteTask = () => {
    if (tasks.length === 0) return;
    const [completed, ...rest] = tasks;
    setTasks(rest);
    setIsTimerActive(false);
  };

  const handleToggleTimer = () => {
    if (tasks.length === 0) return;
    setIsTimerActive(!isTimerActive);
  };

  const handleResetTimer = () => {
    if (tasks.length === 0) return;
    setTasks(prev => {
      const copy = [...prev];
      copy[0].remainingDuration = copy[0].totalDuration;
      return copy;
    });
    setIsTimerActive(false);
  };

  const handleActivateLayer = (id: string) => {
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index <= 0) return prev; 
      
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.unshift(moved);
      return copy;
    });
    setIsTimerActive(false); // Pause when switching context to be safe
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const handleUpdateDuration = (id: string, newDurationMinutes: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newSeconds = newDurationMinutes * 60;
        return { ...t, totalDuration: newSeconds, remainingDuration: newSeconds };
      }
      return t;
    }));
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    // Set effect allowed
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
    e.preventDefault();
  };

  const onDragEnd = (e: React.DragEvent) => {
    const sourceIndex = dragItem.current;
    const destIndex = dragOverItem.current;

    if (sourceIndex !== null && destIndex !== null && sourceIndex !== destIndex) {
      const copy = [...tasks];
      const [removed] = copy.splice(sourceIndex, 1);
      copy.splice(destIndex, 0, removed);
      setTasks(copy);
      
      // If we moved the active item (index 0), we might want to pause timer if it's no longer index 0
      if (sourceIndex === 0 && isTimerActive) {
         setIsTimerActive(false);
      }
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const activeTask = tasks[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT PANEL: Focus Zone */}
      <section className="w-full md:w-5/12 lg:w-4/12 flex flex-col h-[50vh] md:h-screen bg-white border-r border-slate-200 z-10 shadow-xl md:shadow-none">
        <header className="px-8 py-6 flex items-center space-x-3 border-b border-slate-100">
           <div className="bg-primary-600 p-2 rounded-lg shadow-md">
             <Layers className="text-white" size={20} />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-slate-800">SolveStack</h1>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
           {/* Background decorative elements */}
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 to-white opacity-50 z-0 pointer-events-none" />
           
           <div className="relative z-10 w-full max-w-sm">
             {activeTask ? (
               <div className="text-center animate-in fade-in zoom-in duration-300">
                 <div className="inline-flex items-center justify-center mb-6 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium border border-primary-100">
                   <Clock size={14} className="mr-2" />
                   Current Focus
                 </div>
                 
                 <TimerDisplay 
                    totalSeconds={activeTask.totalDuration}
                    remainingSeconds={activeTask.remainingDuration}
                    isActive={isTimerActive}
                    onToggle={handleToggleTimer}
                    onReset={handleResetTimer}
                    onComplete={handleCompleteTask}
                 />

                 <div className="mt-8 space-y-2">
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                     {activeTask.title}
                   </h2>
                   <p className="text-slate-400 font-medium">
                     Step 1 of {tasks.length}
                   </p>
                 </div>
               </div>
             ) : (
               <div className="text-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl">
                 <Layers size={48} className="mx-auto mb-4 opacity-30" />
                 <h3 className="text-lg font-medium text-slate-500">Stack is empty</h3>
                 <p className="text-sm mt-2">Add tasks on the right to start.</p>
               </div>
             )}
           </div>
        </div>

        {/* Mobile footer area within left panel if needed, but we use main footer */}
        <div className="md:hidden px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
           <span className="text-xs text-slate-400">Scroll down for stack</span>
        </div>
      </section>

      {/* RIGHT PANEL: The Stack (List) */}
      <section className="flex-1 flex flex-col h-[50vh] md:h-screen bg-slate-50/50 md:bg-slate-50 relative">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
          <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
            
            {/* Input Area */}
            <div className="mb-8">
               <AICreator onAddTasks={handleAIAddTasks} />

               <form onSubmit={handleAddTask} className="flex gap-3 items-stretch shadow-sm rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white p-1">
                 <input
                    type="text"
                    placeholder="Add a new layer..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                 />
                 <div className="w-px bg-slate-100 my-2" />
                 <input
                    type="number"
                    min="1"
                    max="180"
                    placeholder="Min"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(parseInt(e.target.value) || 25)}
                    className="w-20 px-3 py-3 bg-transparent outline-none text-center font-mono text-slate-500 text-sm"
                    title="Duration in minutes"
                 />
                 <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-5 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <Plus size={20} />
                 </button>
               </form>
            </div>

            {/* List Header */}
            {tasks.length > 0 && (
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Your Stack ({tasks.length})
                </h3>
                <span className="text-xs text-slate-400">Drag to reorder • Click text to edit</span>
              </div>
            )}

            {/* The List */}
            <div className="flex-1 space-y-1 pb-10">
               {tasks.length === 0 && (
                 <div className="h-40 flex items-center justify-center text-slate-300 flex-col">
                   <CheckSquare size={32} className="mb-2 opacity-50" />
                   <p>No tasks yet</p>
                 </div>
               )}

               {tasks.map((task, index) => (
                 <StackLayer
                   key={task.id}
                   index={index}
                   task={task}
                   isActive={index === 0}
                   onActivate={handleActivateLayer}
                   onDelete={handleDeleteTask}
                   onUpdateTitle={handleUpdateTitle}
                   onUpdateDuration={handleUpdateDuration}
                   onDragStart={onDragStart}
                   onDragEnter={onDragEnter}
                   onDragEnd={onDragEnd}
                 />
               ))}
            </div>
            
            <Footer />
          </div>
        </div>
      </section>

      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" preload="auto" />
    </div>
  );
};

export default App;