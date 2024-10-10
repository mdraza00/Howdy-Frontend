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
    <div
      className={
        "flex items-center px-5 justify-center sm:justify-between md:justify-between lg:justify-between xl:justify-between"
      }
    >
      <div className="hidden sm:block md:block lg:block xl:block w-1/2 min-h-full bg-homePageBg relative">
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-70%] w-full flex flex-col items-center h-fit">
          <img
            className="h-[23.5rem] object-cover border-2 border-black"
            src={howdyImage}
          />
          <h1 className="text-3xl mb-2 text-center w-full">
            Welcome to Howdy!
          </h1>
        </div>

        <div className="absolute h-fit left-1/2 bottom-5 translate-x-[-50%] text-sm text-blue-gray-700">
          <span className="flex items-center gap-1 w-[24rem]">
            <img className="w-[0.9rem]" src={lockIcon} /> Your personal messages
            are end-to-end encrypted
          </span>
        </div>
      </div>
      <div className="h-[87%] flex flex-col gap-8 w-full px-2 xl:gap-3 xl:h-fit xl:w-1/2">
        <div className={"flex flex-col items-center gap-1 h-fit "}>
          <img src={logo} className="w-[7.1rem]" />
          <h1
            className={
              " Mobile-S:text-[1.58rem] Mobile-M:text-[1.9rem] mb-7 xl:mb-0"
            }
          >
            Welcome To Howdy!!
          </h1>
        </div>
        <div className={"h-fit w-full"}>
          <div className={" flex items-center justify-center gap-3 h-fit"}>
            <Button
              onClick={() => {
                setActive("login");
              }}
              variant="outlined"
              className={"w-[48%] Mobile-S:py-[0.7rem] Mobile-M:py-[0.8rem]"}
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
              className={"w-[48%] py-[0.7rem] Mobile-M:py-[0.8rem]"}
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
