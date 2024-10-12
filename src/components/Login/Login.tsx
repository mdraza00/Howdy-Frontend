import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BaseURLContext from "../../contexts/BaseURLContext";
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
  const [showWarning, setShowWarning] = useState("");
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
          const warning = err.response
            ? "Incorrect email or password"
            : "Something went wrong";
          setIsLoading(false);
          setShowWarning(warning);
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
      className={""}
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsFormSubmitted(true);
        setShowWarning("");
      }}
    >
      <h2 className={"text-center py-1 mt-2 mb-4 text-[1.4rem]"}>Login</h2>
      <div className="w-full flex justify-center items-center flex-col gap-3">
        <div className={"w-full"}>
          <Input
            className={"text-[1rem]"}
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
        <div className={"relative w-full"}>
          <Input
            className={"text-[1rem]"}
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
              className="absolute right-2 top-1/2 translate-y-[-50%] size-6"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaEye
              className="absolute right-2 top-1/2 translate-y-[-50%] size-6"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        <div className={"flex justify-center mt-5 w-full"}>
          <Button
            id="login-form-submit-button"
            color="blue"
            className={"flex items-center justify-center w-full py-[1px]"}
            type="submit"
            // variant="outlined"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isLoading ? (
              <img className="h-9" src={rollingIcon} />
            ) : (
              <span className="h-9 flex items-center">Login</span>
            )}
          </Button>
        </div>
      </div>
      {showWarning && <p className={""}>{showWarning}</p>}
    </form>
  );
}
export default Login;
