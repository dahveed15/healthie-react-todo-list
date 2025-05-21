export type Task = {
    id: string;
    content: string;
};

export type ColumnType = 'todo' | 'doing' | 'done';

export type Column = {
    id: ColumnType;
    title: string;
    taskIds: string[];
};

export type TaskMap = {
    [key: string]: Task;
};

export type ColumnMap = {
    [key in ColumnType]: Column;
};
