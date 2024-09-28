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
  }, [baseURL.baseUrl, props.isUserDataUpdated, props.userId, token]);

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
      .then((res) => {
        props.setIsUserDataUpdated(props.isUserDataUpdated ? false : true);
        console.log("response agya. res =>", res.data);
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
    // console.log("cropped file agyi", croppedImage);
  }
  return (
    <>
      <div
        className="absolute w-screen h-screen z-[1001] bg-black/30"
        onClick={() => {
          props.setShowUserProfileModel(false);
        }}
      ></div>
      <div className="absolute w-fit h-fit left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex items-center justify-center z-[1003]">
        <div className="w-fit px-20 py-10 h-fit bg-blue-400 flex flex-col items-center gap-4 relative z-[1003] rounded-md pt-10">
          <button
            className="absolute right-4 top-3 bg-white p-1"
            onClick={() => {
              props.setShowUserProfileModel(false);
            }}
          >
            <img src={closeBtnIcon} className="w-6" />
          </button>

          <div className="w-[40%] flex justify-between items-center flex-col gap-10">
            <div className="flex flex-col gap-4">
              <img
                src={`${
                  typeof profilePhotoInput == "string" &&
                  profilePhotoInput.includes("uploads")
                    ? `${baseURL.baseUrl}/${profilePhotoInput}`
                    : `${
                        typeof profilePhotoInput === "object" &&
                        URL.createObjectURL(profilePhotoInput)
                      }`
                }`}
                // src={`${baseURL.baseUrl}/${profilePhotoInput}`}
                className="w-56 h-56 rounded-full object-cover"
              />

              {/* setIsImagePreview(true) */}
              <Button
                onClick={() => document.getElementById("hidden-input")?.click()}
                className="bg-lightblueBG w-60  h-10"
                placeholder={undefined}
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
            <div className="flex flex-col gap-4 mt-4">
              <div className="w-60  h-10">
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
              <div className="w-60  h-10">
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
              <div className="w-60  h-10">
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
              <div className="w-60  h-10">
                <Input
                  variant="outlined"
                  type="password"
                  label="password"
                  color="white"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
              <Button
                onClick={handleChangeAllBtn}
                className="bg-lightGreen w-60 h-10 flex items-center justify-center"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {isLoading ? (
                  <img src={rollingIcon} className="w-10" />
                ) : (
                  "update"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isImagePreview && (
        <div className="">
          <ImagePreview
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
