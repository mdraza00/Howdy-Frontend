import { useState } from "react";
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import logo from "/logo/Howdy_Logo.png";
import styles from "../LoginSignupContainer/LoginSignupContianer.module.css";
import howdyImage from "/images/Howdy_Image.png";
import lockIcon from "/icons/lock.png";
import { Button } from "@material-tailwind/react";

function LoginContainer() {
  const [active, setActive] = useState("login");
  return (
    <div className={styles["login-signup--container"]}>
      <div className="w-1/2 h-screen bg-homePageBg relative">
        <div className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%] flex flex-col justify-center items-center">
          <img className="w-[340px] h-[300px] object-cover" src={howdyImage} />
          <h1 className="text-4xl mb-2">Welcome to Howdy!</h1>
        </div>

        <div className="absolute left-1/2 translate-x-[-50%] bottom-8 text-sm text-blue-gray-700">
          <span className="flex items-center gap-1">
            <img className="w-[13px]" src={lockIcon} /> Your personal messages
            are end-to-end encrypted
          </span>
        </div>
      </div>
      <div className={styles["login-signup-container"]}>
        <div className={"flex flex-col items-center"}>
          <img src={logo} className="w-40" />
          <h1 className={"text-4xl mb-5"}>Welcome To Howdy</h1>
        </div>
        <div className={styles["login-signup-inner-container"]}>
          <div className={"flex gap-2 h-12"}>
            <Button
              onClick={() => {
                setActive("login");
              }}
              variant="outlined"
              className={`w-32`}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setActive("signup");
              }}
              variant="outlined"
              className={`w-32`}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Signup
            </Button>
          </div>
          <div className={styles["Login-signup-form-container"]}>
            {active === "signup" && <Signup />}
            {active === "login" && <Login />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginContainer;
