import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo/Howdy_Logo.png";
import styles from "./Header.module.css";
import BaseURLContext from "../../contexts/BaseURLContext";
import commonStyles from "../Common/Common.module.css";
import { Button } from "@material-tailwind/react";
type propsType = {
  name: string;
  profilePhoto: string;
  setShowUserProfileModel: (a: boolean) => void;
};
function Header(props: propsType) {
  const [popUpMenu, setPopUpMenu] = useState(false);
  const baseURL = useContext(BaseURLContext);
  const navigate = useNavigate();
  return (
    <>
      <header
        className={`${styles["header"]} ${commonStyles["flex-center"]} h-1/6 bg-blue-600 relative z-[90]`}
      >
        <div
          className={`${styles["logo-container"]} ${commonStyles["flex-center"]}`}
        >
          <img src={logo} className={`${styles["logo-img"]}`} />
          <h1
            className={`${styles["website-name-h1"]} ${styles["website-name"]} text-white`}
          >
            Howdy
          </h1>
        </div>
        <div
          className={`${styles["user-info-container"]} ${commonStyles["flex-center"]} cursor-pointer active:bg-white/[.2] px-2 rounded-lg transition-all ease-in-out`}
          onClick={() => setPopUpMenu(popUpMenu ? false : true)}
          // props.setShowUserProfileModel(true)
        >
          <img
            src={`${baseURL.baseUrl}/${props.profilePhoto}`}
            className={`object-cover ${styles["user-header-profile-photo"]}`}
          />
          <h2
            className={`${styles["user-header-username-greetings-h2"]} text-white`}
          >
            {props.name}
          </h2>
        </div>
      </header>

      {popUpMenu && (
        <div
          className=" absolute w-screen h-[93.9vh] z-10"
          onClick={() => {
            setPopUpMenu(false);
          }}
        ></div>
      )}
      <div
        className={`absolute z-[80] right-0 bg-white rounded-md px-2 py-4 flex gap-3 flex-col transition-all ease-in-out duration-300 ${
          popUpMenu ? "top-11" : "-top-56"
        }`}
      >
        <Button
          className="bg-blue-600"
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
