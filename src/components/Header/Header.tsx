import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo/Howdy_Logo.png";
import BaseURLContext from "../../contexts/BaseURLContext";
import { Button } from "@material-tailwind/react";
// import Confetti from "react-confetti";
import ConfettiExplosion from "react-confetti-explosion";

type propsType = {
  name: string;
  profilePhoto: string;
  isShowMessagesContainer: boolean;
  setShowUserProfileModel: (a: boolean) => void;
};
function Header(props: propsType) {
  const [popUpMenu, setPopUpMenu] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const baseURL = useContext(BaseURLContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [showConfetti]);

  return (
    <>
      {showConfetti && <ConfettiExplosion />}
      <header
        className={`h-[6.5vh] flex ${
          props.isShowMessagesContainer && "hidden sm:flex"
        } items-center justify-between px-[0.2rem] py-[0.4rem] bg-blue-600 relative z-[7]`}
      >
        <div
          className={"cursor-pointer flex items-center gap-[0.3rem]"}
          onClick={() => {
            setShowConfetti(true);
          }}
        >
          <img src={logo} className={"h-[2.3rem]"} />
          <h1 className={"text-white text-[1.1rem]"}>Howdy</h1>
        </div>
        <div
          className={
            "cursor-pointer flex items-center gap-[0.3rem] active:bg-white/[.2] px-2 rounded-lg transition-all ease-in-out"
          }
          onClick={() => setPopUpMenu(popUpMenu ? false : true)}
          // props.setShowUserProfileModel(true)
        >
          <img
            src={`${baseURL.imageUrl}/${props.profilePhoto}`}
            className={`h-[2.3rem] w-[2.3rem] rounded-full`}
          />
          <h2 className={"text-white text-[1.1rem] "}>
            {props.name.split(" ")[0]}
          </h2>
        </div>
      </header>

      {popUpMenu && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-transparent z-[6]"
          onClick={() => {
            setPopUpMenu(false);
          }}
        ></div>
      )}
      <div
        className={`absolute h-fit z-[6] right-0 bg-white rounded-md px-2 py-4 flex gap-3 flex-col transition-all ease-in-out duration-300 ${
          popUpMenu ? "top-11" : "-top-56"
        }`}
      >
        <Button
          className="bg-blue-600 text-[0.75rem] px-[0.9rem] py-[0.55rem] rounded-md"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => {
            setPopUpMenu(false);
            props.setShowUserProfileModel(true);
          }}
        >
          User Profile
        </Button>
        <Button
          className="text-[0.75rem] px-[0.9rem] py-[0.55rem] rounded-md"
          variant="outlined"
          color="red"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onClick={() => {
            localStorage.clear();
            navigate("/login-signup");
          }}
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}
export default Header;
