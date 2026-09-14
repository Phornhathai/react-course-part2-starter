import { useState } from "react";
import usePostsPagination from "../hooks/usePostsPagination";

const PostListPagination = () => {
  // parameterized queries
  // const [userId, setUserId] = useState<number>();

  // paginated queries
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const { data: post, error, isLoading } = usePostsPagination({ page, pageSize });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {/* <select
        name=""
        id=""
        className="form-select mb-3"
        onChange={(event) => setUserId(Number.parseInt(event.target.value))}
        value={userId}
      >
        <option value=""></option>
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
      </select> */}
      <ul className="list-group">
        {post?.map((post) => (
          <li key={post.id} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
      <button
        disabled={page === 1}
        className="btn btn-primary my-3"
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <button className="btn btn-primary my-3 ms-3" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </>
  );
};

export default PostListPagination;
