import React, { useState } from 'react';
import {
    DndContext,
    closestCorners,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import StackColumn from './StackColumn';
import TaskCard from './TaskCard';
import { createPortal } from 'react-dom';

const StackBoard = ({ stacks, tasks, addStack, deleteStack, updateStack, addTask, deleteTask, updateTask, onDragEnd }) => {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        })
    );

    const [activeId, setActiveId] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [activeStack, setActiveStack] = useState(null);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        if (active.data.current?.type === 'Task') {
            setActiveTask(active.data.current.task);
        }
    };

    const handleDragEndInternal = (event) => {
        setActiveId(null);
        setActiveTask(null);
        setActiveStack(null);
        onDragEnd(event);
    };

    return (
        <div className="flex-1 flex overflow-x-auto overflow-y-hidden p-6 gap-2 w-full h-full align-top items-start">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEndInternal}
            >
                <div className="flex h-full gap-4">
                    {stacks.map((stack) => (
                        <StackColumn
                            key={stack.id}
                            stack={stack}
                            tasks={tasks.filter((t) => t.stackId === stack.id)}
                            addTask={addTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            updateStack={updateStack}
                            deleteStack={deleteStack}
                        />
                    ))}

                    <button
                        onClick={addStack}
                        className="h-[60px] min-w-[300px] flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
                    >
                        + Add New Stack
                    </button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                deleteTask={() => { }}
                                updateTask={() => { }}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default StackBoard;
