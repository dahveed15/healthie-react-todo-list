import { useEffect, useState } from 'react';
import './styles.css';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './components/Column';
import { ColumnMap, TaskMap, Task } from './types';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';

const initialTasks: TaskMap = {
  'task-1': { id: 'task-1', content: 'Learn TypeScript' },
  'task-2': { id: 'task-2', content: 'Build Todo App' },
};

const initialColumns: ColumnMap = {
  todo: {
    id: 'todo',
    title: 'Todo',
    taskIds: ['task-1'],
  },
  doing: {
    id: 'doing',
    title: 'Doing',
    taskIds: ['task-2'],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: [],
  },
};

export default function App() {
  const [taskContent, setTaskContent] = useState('');

  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [tasks, setTasks] = useState<TaskMap>(() =>
    loadState<TaskMap>('tasks', initialTasks)
  );
  const [columns, setColumns] = useState<ColumnMap>(() =>
    loadState<ColumnMap>('columns', initialColumns)
  );

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [tasks, columns]);


  const triggerConfetti = () => {
    return confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskContent.trim()) return;

    const newTaskId = uuidv4();
    const newTask: Task = {
      id: newTaskId,
      content: taskContent.trim(),
    };

    setTasks((prev) => ({
      ...prev,
      [newTaskId]: newTask,
    }));

    // Add to "todo" column by default
    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [newTaskId, ...prev.todo.taskIds],
      },
    }));

    setTaskContent('');
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = columns[source.droppableId as keyof ColumnMap];
    const finish = columns[destination.droppableId as keyof ColumnMap];

    // Moving within the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving between columns
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    if (destination.droppableId === 'done') {
      triggerConfetti();
    }
  };

  return (
    <div className="app-container">
      <h1>React Todo List</h1>
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="task-button" disabled={!taskContent.trim()}>Add Task</button>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.values(columns).map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={column.taskIds.map((taskId) => tasks[taskId])}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
