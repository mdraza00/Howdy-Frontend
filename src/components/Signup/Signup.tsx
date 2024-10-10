import axios from "axios";
import { useState, useEffect, useContext } from "react";
import BaseURLContext from "../../contexts/BaseURLContext";
import { useNavigate } from "react-router-dom";
import rollingIcon from "/icons/RollingIcon.svg";
import { Button, Input } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface response {
  status: boolean;
  data: {
    message: string;
    jwt_token: string;
  };
}

function Signup() {
  const [showWarning, setShowWarning] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();
  const baseURL = useContext(BaseURLContext);
  useEffect(() => {
    if (isFormSubmitted) {
      console.log("api will be called.");
      const url = `${baseURL.baseUrl}/register`;
      axios
        .post<response>(url, {
          username: nameInput,
          email: emailInput,
          password: passwordInput,
        })
        .then((res) => {
          if (res.data.status) {
            console.log(res.data.data);
            const jwtToken = res.data.data.jwt_token;
            localStorage.clear();
            localStorage.setItem("token", jwtToken);
            navigate("/");
          }
        })
        .catch((err) => {
          const errorMessage = !err.response
            ? "something went wrong"
            : err.response.data.message.includes("duplicate key error")
            ? "user already exists"
            : "error kya hai pata nahi console check karo";
          console.log(err.response);
          setIsLoading(false);
          setShowWarning(errorMessage);
        });
    }

    return () => {
      setIsFormSubmitted(false);
    };
  }, [
    baseURL.baseUrl,
    emailInput,
    isFormSubmitted,
    nameInput,
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
      <h2 className={"text-center py-1 mt-2 mb-4 text-[1.4rem]"}>Signup</h2>
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        <div className={"w-full xl:w-5/12"}>
          <Input
            type="text"
            name="username"
            value={nameInput}
            label="name"
            required
            className={``}
            onChange={(e) => setNameInput(e.target.value)}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
        <div className={"w-full xl:w-5/12"}>
          <Input
            type="email"
            name="email"
            label="email"
            required
            className={``}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>

        <div className={"relative w-full xl:w-5/12"}>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            label="password"
            required
            minLength={8}
            className={``}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
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
        <div className={"flex items-center justify-center w-full xl:w-5/12"}>
          <Button
            className={"flex items-center justify-center w-full py-[1px]"}
            color="blue"
            type="submit"
            onClick={() => setIsLoading(true)}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isLoading ? (
              <img className="w-9" src={rollingIcon} />
            ) : (
              <span className="h-9 flex items-center">Signup</span>
            )}
          </Button>
        </div>
      </div>
      {showWarning && <p className={""}>{showWarning}</p>}
    </form>
  );
}
export default Signup;
