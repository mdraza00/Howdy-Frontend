import { useState } from "react";
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import logo from "/logo/Howdy_Logo.png";
import howdyImage from "/images/Howdy_Image.png";
import lockIcon from "/icons/lock.png";
import { Button } from "@material-tailwind/react";

function LoginContainer() {
  const [active, setActive] = useState("login");
  return (
    <div className={`w-full h-screen flex items-center justify-center`}>
      <div className="hidden md:flex w-1/2 min-h-full bg-homePageBg relative">
        <div className="absolute left-1/2 w-full translate-x-[-50%] top-1/2 translate-y-[-50%] flex flex-col justify-center items-center">
          <img className="w-[25rem] object-cover" src={howdyImage} />
          <h1 className="2xl:text-4xl xl:text-4xl lg:text-3xl md:text-2xl sm:text-2xl mb-2">
            Welcome to Howdy!
          </h1>
        </div>

        <div className="absolute left-1/2 translate-x-[-50%] w-full flex justify-center bottom-8 text-sm text-blue-gray-700">
          <span className="flex items-center gap-1">
            <img className="w-[0.9rem]" src={lockIcon} /> Your personal messages
            are end-to-end encrypted
          </span>
        </div>
      </div>
      <div>
        <div className={"flex flex-col items-center"}>
          <img src={logo} className="w-24" />
          <h1 className={"text-2xl mb-5"}>Welcome To Howdy</h1>
        </div>
        <div className={""}>
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
          <div className={""}>
            {active === "signup" && <Signup />}
            {active === "login" && <Login />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginContainer;
