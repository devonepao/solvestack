import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { generateTaskBreakdown } from '../services/geminiService';
import { AIResponseItem } from '../types';

interface AICreatorProps {
  onAddTasks: (items: AIResponseItem[]) => void;
}

const AICreator: React.FC<AICreatorProps> = ({ onAddTasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateTaskBreakdown(prompt);
      if (result && result.length > 0) {
        onAddTasks(result);
        setPrompt('');
        setIsOpen(false);
      } else {
        setError('Could not generate tasks. Please try a different goal.');
      }
    } catch (err) {
      setError('Error connecting to AI. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors py-2"
      >
        <Sparkles size={16} />
        <span>Ask AI to build a stack</span>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-xl border border-primary-100 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-primary-900 flex items-center">
          <Sparkles size={16} className="mr-2 text-primary-500" />
          AI Stack Builder
        </h4>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 text-xs"
        >
          Cancel
        </button>
      </div>
      
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Learn the basics of Python in 2 hours..."
          className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none resize-none h-20 bg-white"
        />
        
        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Generate Stack</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICreator;
