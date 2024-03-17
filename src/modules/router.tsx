import { Navigate, useRoutes } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";
import RoleBaseGuard from "../guards/RoleBaseGuard";
import SignIn from "./auth/SignIn";
import EditUser from "./users/EditUser";
import UserList from "./users/UserList";

const Router = () => {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "sign-in",
          element: (
            <GuestGuard>
              <SignIn />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "users",
      children: [
        {
          index: true,
          element: <Navigate to="/users/list" replace />,
        },
        {
          path: "list",
          element: (
            <AuthGuard>
              <UserList />
            </AuthGuard>
          ),
        },
        {
          path: "edit",
          element: (
            <AuthGuard>
              <RoleBaseGuard accessibleRoles={["ADMIN"]}>
                <EditUser />
              </RoleBaseGuard>
            </AuthGuard>
          ),
        },
      ],
    },
  ]);
};

export default Router;
