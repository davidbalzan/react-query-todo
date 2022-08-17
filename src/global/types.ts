export interface Todo {
  id: number | undefined;
  title: string;
  completed: boolean;
}


export type Todos = Array<Todo>