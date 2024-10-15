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
    <div className={"flex items-center px-5 sm:px-0 justify-center"}>
      <div className="hidden sm:flex w-1/2 min-h-full bg-homePageBg relative">
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-69.5%] w-full flex flex-col items-center h-fit">
          <img
            className="h-[50%] max-h-[24rem] object-cover"
            src={howdyImage}
          />
          <h1 className="text-3xl mb-2 text-center w-full">
            Welcome to Howdy!
          </h1>
        </div>

        <div className="absolute h-fit w-full left-1/2 bottom-5 translate-x-[-50%] text-sm text-blue-gray-700">
          <span className="flex items-center justify-center gap-1 w-full text-xs">
            <img className="w-[0.9rem]" src={lockIcon} /> Your personal messages
            are end-to-end encrypted
          </span>
        </div>
      </div>
      <div className="h-fit w-full sm:w-1/2 mt-10 flex flex-col items-center justify-center gap-8  px-2">
        <div className={"flex flex-col items-center gap-1 h-fit "}>
          <img src={logo} className="w-[40%] max-w-[9rem]" />
          <h1 className={"mb-7 text-xl sm:text-2xl md:text-3xl lg:text-4xl"}>
            Welcome To Howdy!!
          </h1>
        </div>
        <div className={"h-fit w-full max-w-[25rem]"}>
          <div className={" flex items-center justify-center gap-3 h-fit"}>
            <Button
              onClick={() => {
                setActive("login");
              }}
              variant="outlined"
              className={"w-[48%]"}
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
              className={"w-[48%]"}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Signup
            </Button>
          </div>
          <div className={"h-[20rem]"}>
            {active === "signup" && <Signup />}
            {active === "login" && <Login />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginContainer;
