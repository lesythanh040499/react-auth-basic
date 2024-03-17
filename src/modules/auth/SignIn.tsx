import { signIn } from "../../contexts/auth/reducers";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

const SignIn = () => {
  const { dispatch } = useAuth();

  const handleSignIn = async () => {
    try {
      const { accessToken, user } = await authService.signIn();
      localStorage.setItem("ACCESS_TOKEN", accessToken);
      dispatch(signIn({ user }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Sign In Page</h1>
      <button onClick={handleSignIn}>SignIn</button>
    </>
  );
};

export default SignIn;
