import { useContext, useState } from "react";
import styles from "./LogInModal.module.css";
import { Link } from "react-router-dom";
import { getHeaderWithProjectIDAndBody } from "../../utils/config";
import axios from "axios";
import { CheckLogInStat, ModalCtx } from "../../App";

const LogInPage = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [errMessage, setErrMessage] = useState("");
  const [hasError, sethasError] = useState(false);

  const { setIsNotLoggedIn } = useContext(CheckLogInStat);
  const { setShowModal } = useContext(ModalCtx);

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const fetchLogInData = async (userInfo) => {
    userInfo.appType = "reddit";

    try {
      const headerconfigs = getHeaderWithProjectIDAndBody();
      const res = await axios.post(
        "https://academics.newtonschool.co/api/v1/user/login",
        userInfo,
        headerconfigs
      );
      console.log(res);
      if (res.data.token) {
        sethasError(false);
        setIsNotLoggedIn(false);
        setShowModal(false);
        sessionStorage.setItem("logInStatus", true);
        sessionStorage.setItem("authToken", res.data.token);
        // sessionStorage.setItem("userInfo", JSON.stringify(res.data.data.user));
      }
    } catch (err) {
      sethasError(true);
      setErrMessage(err.response.data.message);
      console.error(err.response.data.message);
    }
  };

  const handleLogInSubmit = (event) => {
    event.preventDefault();
    fetchLogInData(userInfo);
  };
  return (
    <form className={styles.logInForm} onSubmit={handleLogInSubmit}>
      <input
        className={styles.emailInp}
        type="text"
        placeholder="Username"
        name="email"
        value={userInfo.email}
        onChange={handleUserInput}
      />
      <br />
      <input
        className={styles.passInp}
        type="password"
        placeholder="Password"
        name="password"
        value={userInfo.password}
        onChange={handleUserInput}
      />
      <p className={styles.reset}>
        Forgot your <Link to="/">username</Link> or <Link to="/">password</Link>
        ?
      </p>
      {hasError && <p className={styles.errorMsg}>{errMessage}!</p>}
      <button className={styles.loginBtn}>Log In</button>
    </form>
  );
};
export default LogInPage;
