export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}


type Todos = Array<Todo>