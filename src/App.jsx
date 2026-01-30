import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import StackBoard from './components/StackBoard';
import Footer from './components/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import { Layers } from 'lucide-react';

const App = () => {
  const [stacks, setStacks] = useLocalStorage('solvestack-stacks', []);
  const [tasks, setTasks] = useLocalStorage('solvestack-tasks', []);

  const addStack = () => {
    const newStack = {
      id: uuidv4(),
      title: 'New Stack',
      elapsed: 0,
      isRunning: false,
    };
    setStacks([...stacks, newStack]);
  };

  const deleteStack = (id) => {
    // Also delete tasks in this stack
    setStacks(stacks.filter((s) => s.id !== id));
    setTasks(tasks.filter((t) => t.stackId !== id));
  };

  const updateStack = (id, updatedStack) => {
    setStacks(stacks.map((stack) => (stack.id === id ? updatedStack : stack)));
  };

  const addTask = (stackId) => {
    const newTask = {
      id: uuidv4(),
      stackId,
      title: 'New Task',
      elapsed: 0,
      isRunning: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return; // Dropped item wasn't a task?

    // Find over Stack
    let overStackId = null;
    const overTask = tasks.find(t => t.id === overId);

    if (overTask) {
      overStackId = overTask.stackId;
    } else {
      // Did we drop directly on a stack column?
      const overStack = stacks.find(s => s.id === overId);
      if (overStack) {
        overStackId = overStack.id;
      }
    }

    if (overStackId) {
      // Moved to a different stack or reordered in same stack
      if (activeTask.stackId !== overStackId) {
        setTasks((tasks) => {
          return tasks.map(t => {
            if (t.id === activeId) return { ...t, stackId: overStackId };
            return t;
          });
        });
      } else if (activeId !== overId) {
        // Reordering in same stack logic is a bit complex with flat list
        // For now, simple re-sort if we implement SortableContext correctly
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);
        setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
      }
    }
  };


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <header className="h-[70px] flex items-center px-8 justify-between glass-header">
        <div className="flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Layers size={24} />
          </div>
          SolveStack
        </div>
        <div className="text-sm text-gray-500 font-medium">Desktop Edition</div>
      </header>

      {/* Main Board */}
      <main className="flex-1 overflow-hidden relative w-full">
        <StackBoard
          stacks={stacks}
          tasks={tasks}
          addStack={addStack}
          deleteStack={deleteStack}
          updateStack={updateStack}
          addTask={addTask}
          deleteTask={deleteTask}
          updateTask={updateTask}
          onDragEnd={onDragEnd}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
