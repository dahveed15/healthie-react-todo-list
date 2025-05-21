import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types';

type Props = {
    task: Task;
    index: number;
};

export default function TaskCard({ task, index }: Props) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {task.content}
                </div>
            )}
        </Draggable>
    );
}
