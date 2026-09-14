import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "./useTodos";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Todo>("/todos");

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  // parameter ตัวที่ 3 คือตัวที่ส่งเข้าไป mutate กรณีนี้ใช้ Todo
  return useMutation<Todo, Error, Todo, AddTodoContext>({
    // mutationFn: (todo: Todo) =>
    //   axios.post<Todo>("https://jsonplaceholder.typicode.com/todos", todo).then((res) => res.data),
    mutationFn: apiClient.post,
    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos = []) => [newTodo, ...todos]);

      onAdd();

      return { previousTodos };
    },
    // any fallback
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodo : todo)),
      );
    },

    onError: (error, newTodo, context) => {
      if (!context) return;

      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos);
    },
  });
};

export default useAddTodo;
