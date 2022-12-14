import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { Todo, Todos } from "../../global/types";
import { mutateTodo, postTodo, todoKeys, useTodos } from "./queries";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Simple ToDo App</title>
        <meta name="description" content="Sample todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Simple <span className="text-purple-300">ToDo</span> App
        </h1>

        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-1 lg:w-2/3">
          <Todos />
        </div>
      </main>
    </>
  );
};

const Todos = ({}) => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, error, data } = useTodos();

  // Mutations
  const { mutate: addTodo } = useMutation(postTodo, {
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries(todoKeys.all);

      const previousTodos = queryClient.getQueryData<Todos>(todoKeys.all);

      if (previousTodos) {
        queryClient.setQueryData<Todos>(todoKeys.all, () => [
          ...previousTodos,
          newTodo,
        ]);
      }

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData<Todos>(todoKeys.all, context?.previousTodos);
      console.error(err, newTodo);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(todoKeys.all);
    },
  });

  const { mutate: updateTodo } = useMutation(mutateTodo, {
    onMutate: async (updTodo) => {
      await queryClient.cancelQueries(todoKeys.all);

      const previousTodos = queryClient.getQueryData<Todos>(todoKeys.all);

      if (previousTodos) {
        const updatedList = previousTodos.map((t) =>
          t.id === updTodo.id ? updTodo : t
        );
        queryClient.setQueryData<Todos>(todoKeys.all, () => [...updatedList]);
      }

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData<Todos>(todoKeys.all, context?.previousTodos);
      console.error(err, newTodo);
    },
    onSettled: () => {
      queryClient.invalidateQueries(todoKeys.all);
    },
  });

  const handleChangeTodo = async (change: any, id: number | undefined) => {
    updateTodo({ ...change, id: id });
  };

  if (isLoading)
    return (
      <section>
        <div>Loading...</div>
      </section>
    );
  if (error)
    return <section>${"An error has occurred: " + error.message}</section>;

  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      {data?.map((todo, idx) => {
        return (
          <div key={idx}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                handleChangeTodo({ completed: e.target.checked }, todo.id)
              }
            />{" "}
            <input
              type="text"
              value={todo.title}
              onChange={(e) =>
                handleChangeTodo({ title: e.target.value }, todo.id)
              }
            />
          </div>
        );
      })}

      <button
        className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-5 dark:bg-violet-600 dark:hover:bg-violet-700 focus:outline-none dark:focus:ring-violet-800"
        onClick={() => {
          addTodo({
            id: undefined,
            title: "",
            completed: false,
          });
        }}
      >
        Add Todo
      </button>

      <br />
      <br />
      <br />
      <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
};

export default Home;
