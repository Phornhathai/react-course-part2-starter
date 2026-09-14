import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Todo>("/todos");

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const useTodos = () => {
  // const fetchTodos = () => axios.get<Todo[]>("/todos").then((res) => res.data);

  return useQuery<Todo[], Error>({
    queryKey: CACHE_KEY_TODOS,
    // queryFn: fetchTodos,
    queryFn: apiClient.getAll,
    staleTime: 1000, // 1000 ms = 10s
    // staleTime: 0, // no skip refetch
    // refetchInterval: 1000, // 10s
  });
};

export default useTodos;
