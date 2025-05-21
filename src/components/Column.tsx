import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Column as ColumnType, Task } from '../types';

type Props = {
    column: ColumnType;
    tasks: Task[];
};

export default function Column({ column, tasks }: Props) {
    return (
        <div className={`column column-${column.id}`}>
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div
                        className="task-list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
