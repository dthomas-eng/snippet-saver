import { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/user/userContext";

const useReturnHomeIfNotLoggedIn = () => {
  const userContext = useContext(UserContext);
  const { loggedIn } = userContext;

  const history = useHistory();

  const returnHome = () => {
    return history.push("/");
  };

  !loggedIn && returnHome();
};

export default useReturnHomeIfNotLoggedIn;
