import axios from "axios";
import { useState, useEffect, useContext } from "react";
import BaseURLContext from "../../contexts/BaseURLContext";
import styles from "./Signup.module.css";
import commonStyles from "../Common/Common.module.css";
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
          setIsLoading(false);
          if (axios.isAxiosError(err)) {
            if (err.response.data.message.includes("duplicate key error")) {
              setShowWarning("This user already exists");
            }
          } else {
            setShowWarning("an error has occured");
          }
          console.log("err = ", err);
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
      className={commonStyles["login-signup-form"]}
      onSubmit={(e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsFormSubmitted(true);
        setShowWarning("");
      }}
    >
      <h2 className={"text-center py-1 my-2 text-lg"}>Signup</h2>
      <div className={commonStyles["input-container"]}>
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
      <div className={commonStyles["input-container"]}>
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

      <div className={`${commonStyles["input-container"]} relative`}>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          label="password"
          required
          minLength={8}
          className={`${styles["signup-form--password-input"]} ${commonStyles["input"]}`}
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
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
          className={`flex items-center justify-center h-10 `}
          color="blue"
          type="submit"
          onClick={() => setIsLoading(true)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {isLoading ? <img className="w-10" src={rollingIcon} /> : "Signup"}
        </Button>
      </div>
      {!!showWarning && (
        <p className={commonStyles["wrong-password-p"]}>{showWarning}</p>
      )}
    </form>
  );
}
export default Signup;
