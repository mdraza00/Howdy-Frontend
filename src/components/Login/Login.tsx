import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BaseURLContext from "../../contexts/BaseURLContext";
import commonStyles from "../Common/Common.module.css";
import rollingIcon from "/icons/RollingIcon.svg";
import { Button, Input } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface Response {
  status: boolean;
  data: {
    message: string;
    jwt_token: string;
  };
}

function Login() {
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const baseURL = useContext(BaseURLContext);
  useEffect(() => {
    if (isUserAuthorized) {
      navigate("/");
    }
    if (isFormSubmitted) {
      const url = `${baseURL.baseUrl}/login`;

      axios
        .post<Response>(url, {
          email: emailInput,
          password: passwordInput,
        })
        .then((res) => {
          if (res.data.status) {
            const jwtToken = res.data.data.jwt_token;
            localStorage.setItem("token", jwtToken);
            setIsUserAuthorized(true);
          }
        })
        .catch((err) => {
          if (err) {
            setIsLoading(false);
            setShowWarning(true);
          }
        });
    }

    return () => setIsFormSubmitted(false);
  }, [
    baseURL.baseUrl,
    emailInput,
    isFormSubmitted,
    isUserAuthorized,
    navigate,
    passwordInput,
  ]);
  return (
    <form
      className={commonStyles["login-signup-form"]}
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsFormSubmitted(true);
        setShowWarning(false);
      }}
    >
      <h2 className={"text-center py-1 my-2 text-lg"}>Login</h2>
      <div className={commonStyles["input-container"]}>
        <Input
          className={``}
          type="email"
          name="email"
          label="email"
          id="input-email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      </div>
      <div className={`${commonStyles["input-container"]} relative`}>
        <Input
          className={``}
          type={showPassword ? "text" : "password"}
          name="password"
          label="Password"
          id="input-password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
        {showPassword ? (
          <FaEyeSlash
            className="absolute right-2 top-1/2 translate-y-[-50%]"
            size={22}
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <FaEye
            className="absolute right-2 top-1/2 translate-y-[-50%]"
            size={22}
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
      <div className={commonStyles["input-container"]}>
        <Button
          id="login-form-submit-button"
          color="blue"
          className={`flex items-center justify-center h-11`}
          type="submit"
          // variant="outlined"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {isLoading ? <img className="w-10" src={rollingIcon} /> : "Login"}
        </Button>
      </div>
      {showWarning && (
        <p className={commonStyles["wrong-password-p"]}>
          Incorrect Email or Password
        </p>
      )}
    </form>
  );
}
export default Login;
