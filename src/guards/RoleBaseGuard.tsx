import { FC, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export interface RoleBaseGuardProps {
  accessibleRoles: Array<string>;
  children: ReactNode;
}

const RoleBaseGuard: FC<RoleBaseGuardProps> = ({
  children,
  accessibleRoles,
}) => {
  const { user } = useAuth();

  if (!accessibleRoles.includes(user!.role)) {
    return <div>Permission denied</div>;
  }

  return <>{children}</>;
};

export default RoleBaseGuard;
