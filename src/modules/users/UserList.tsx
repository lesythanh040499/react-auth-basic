import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>User List</div>
      <button onClick={() => navigate("/users/edit")}>Edit</button>
      <button>Sign Out</button>
    </>
  );
};

export default UserList;
