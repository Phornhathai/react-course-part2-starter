import "./App.css";
import PostList from "./react-query/PostList";
import PostListPagination from "./react-query/PostListPagination";
import PostListLoadmore from "./react-query/PostListLoadmore";
import TodoList from "./react-query/TodoList";
import TodoForm from "./react-query/TodoForm";
import TaskList from "./state-management/TaskList";
import LoginStatus from "./state-management/LoginStatus";

function App() {
  return (
    <>
      {/* <TodoForm />
      <TodoList /> */}

      <LoginStatus />
    </>
  );
}

export default App;
