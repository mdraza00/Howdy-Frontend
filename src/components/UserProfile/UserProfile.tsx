import { PropsWithChildren, useEffect, useContext, useState } from "react";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
import BaseURLContext from "../../contexts/BaseURLContext";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import ImagePreview from "../ImagePreview/ImagePreview";
import { Crop } from "react-image-crop";
import rollingIcon from "/icons/RollingIcon.svg";
type propsType = {
  userId: string;
  showUserProfileModel: boolean;
  setShowUserProfileModel: (a: boolean) => void;
  isUserDataUpdated: boolean;
  setIsUserDataUpdated: (a: boolean) => void;
};
interface userDateRes {
  status: boolean;
  data: {
    email: string;
    name: string;
    profilePhoto: string;
    about: string;
  };
}
function UserProfile(props: PropsWithChildren<propsType>) {
  const [userNameInput, setUserNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhotoInput, setProfilePhotoInput] = useState<File | string>("");
  const baseURL = useContext(BaseURLContext);

  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState("");

  const [isImagePreview, setIsImagePreview] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (props.showUserProfileModel) {
      const url = `${baseURL.baseUrl}/user/getUser`;
      axios
        .post<userDateRes>(
          url,
          { userId: props.userId },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setUserNameInput(res.data.data.name);
          setEmailInput(res.data.data.email);
          setProfilePhotoInput(res.data.data.profilePhoto);
          setAboutInput(res.data.data.about);
        })
        .catch((err) => {
          console.log(`error from userProfile => `, err);
        });
    }
  }, [
    baseURL.baseUrl,
    props.isUserDataUpdated,
    props.showUserProfileModel,
    props.userId,
    token,
  ]);

  const handleChangeAllBtn = () => {
    const formData = new FormData();
    const userId = props.userId;
    setIsLoading(true);
    formData.append("userId", userId ? userId : "");
    formData.append("userProfile", profilePhotoInput);
    formData.append("username", userNameInput);
    formData.append("password", passwordInput);
    formData.append("email", emailInput);
    formData.append("about", aboutInput);
    axios
      .post(`${baseURL.baseUrl}/user/update`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          authorization: "Bearer " + token,
        },
      })
      .then(() => {
        props.setIsUserDataUpdated(props.isUserDataUpdated ? false : true);
        props.setShowUserProfileModel(false);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("mubarak ho, error agyi. error => ", err);
      });
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsImagePreview(true);
    }
  };

  function croppedImage(croppedImage: File) {
    setProfilePhotoInput(croppedImage);
  }
  return (
    <>
      <div
        className={`hidden fixed sm:block ${
          props.showUserProfileModel ? "right-[0] top-[0]" : "right-[-110vw]"
        } w-full h-full bg-black/15 z-[100]`}
        onClick={() => {
          props.setShowUserProfileModel(false);
        }}
      ></div>
      {/* className=" 
      flex items-center justify-center z-[100]" */}
      <div
        className={`fixed top-[0] sm:top-[50%] sm:translate-y-[-50%] ${
          props.showUserProfileModel
            ? "left-[0] sm:left-[50%] sm:translate-x-[-50%]"
            : "left-[110vw]"
        } w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] h-full sm:h-[90%] py-10 sm:py-5 bg-blue-400 flex flex-col items-center gap-4 z-[100] sm:rounded-xl shadow-2xl transition-all ease-in-out duration-500`}
      >
        <button
          className="absolute right-4 top-3 bg-white p-1"
          onClick={() => {
            props.setShowUserProfileModel(false);
          }}
        >
          <img src={closeBtnIcon} className="w-6" />
        </button>

        <div className="w-[90%] flex items-center justify-evenly flex-col">
          <div className="flex flex-col items-center gap-3 w-[80%] h-fit max-w-[20rem]">
            <img
              src={`${
                typeof profilePhotoInput == "string" &&
                profilePhotoInput.includes("uploads")
                  ? `${baseURL.imageUrl}/${profilePhotoInput}`
                  : `${
                      typeof profilePhotoInput === "object" &&
                      URL.createObjectURL(profilePhotoInput)
                    }`
              }`}
              // src={`${baseURL.baseUrl}/${profilePhotoInput}`}
              className="w-[80%] max-w-[13rem] object-cover aspect-square rounded-full"
            />

            {/* setIsImagePreview(true) */}
            <Button
              onClick={() => document.getElementById("hidden-input")?.click()}
              className="p-0 h-9 w-[80%]"
              placeholder={undefined}
              color="blue-gray"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Change User Profile
              <input
                onChange={onSelectFile}
                type="file"
                accept="image/*"
                id="hidden-input"
                className="hidden"
              />
            </Button>
          </div>
          <div className="flex flex-col h-fit gap-4 mt-4 w-[80%] max-w-[18rem]">
            <div className="w-full">
              <Input
                variant="outlined"
                type="text"
                label="name"
                color="white"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
            <div className="w-full">
              <Input
                variant="outlined"
                type="text"
                label="about"
                color="white"
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
            <div className="w-full">
              <Input
                readOnly
                variant="outlined"
                type="email"
                label="email"
                color="white"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
            <div className="h-fit">
              <Button
                onClick={handleChangeAllBtn}
                className="w-full p-0 flex items-center justify-center"
                color="teal"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {isLoading ? (
                  <img src={rollingIcon} className="h-9" />
                ) : (
                  <span className="h-9 flex items-center">update</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isImagePreview && (
        <div className="h-fit w-full">
          <ImagePreview
            setImageSrc={setImgSrc}
            setIsImagePreview={setIsImagePreview}
            croppedImage={croppedImage}
            crop={crop}
            setCrop={setCrop}
            imgSrc={imgSrc}
          />
        </div>
      )}
    </>
  );
}
export default UserProfile;
