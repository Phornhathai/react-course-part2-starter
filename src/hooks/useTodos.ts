import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import todoService, { Todo } from "../services/todoService";

const useTodos = () => {
  // const fetchTodos = () => axios.get<Todo[]>("/todos").then((res) => res.data);

  return useQuery<Todo[], Error>({
    queryKey: CACHE_KEY_TODOS,
    // queryFn: fetchTodos,
    queryFn: todoService.getAll,
    staleTime: 1000, // 1000 ms = 10s
    // staleTime: 0, // no skip refetch
    // refetchInterval: 1000, // 10s
  });
};

export default useTodos;
