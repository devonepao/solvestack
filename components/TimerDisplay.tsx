import React from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

interface TimerDisplayProps {
  totalSeconds: number;
  remainingSeconds: number;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onComplete: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  totalSeconds,
  remainingSeconds,
  isActive,
  onToggle,
  onReset,
  onComplete,
}) => {
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Prevent division by zero if totalSeconds is 0
  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <circle
            stroke={isActive ? "#0ea5e9" : "#94a3b8"}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
           <span className={`text-5xl font-mono font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">
            {isActive ? 'Focusing' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onToggle}
          className={`p-4 rounded-full shadow-lg transition-all active:scale-95 ${
            isActive 
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
        </button>
        
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shadow-sm"
          title="Reset Timer"
        >
          <RotateCcw size={20} />
        </button>

         <button
          onClick={onComplete}
          className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all shadow-sm"
          title="Complete Task"
        >
          <CheckCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;
