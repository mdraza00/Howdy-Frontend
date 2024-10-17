import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { FaRegImage } from "react-icons/fa6";
import { Button } from "@material-tailwind/react";
import { Crop } from "react-image-crop";
import ImagePreview from "../ImagePreview/ImagePreview";
import rollingIcon from "/icons/RollingIcon.svg";
import { ICreateGroup } from "../../Interface/Interface";
import Context from "../../contexts/BaseURLContext";

type propType = {
  userId: string;
  createGroup: ICreateGroup;
  setCreateGroup: (data: ICreateGroup) => void;
  updateChatRoomsData: boolean;
  setUpdateChatRoomsData: (bool: boolean) => void;
};

export default function CreateGroup(props: PropsWithChildren<propType>) {
  const baseUrl = useContext(Context);
  const token = localStorage.getItem("token");

  const groupImageRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState("");
  const [createGroup, setCreateGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImageSrc, setGroupImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState("");
  const [isImagePreview, setIsImagePreview] = useState(false);
  const [profilePhotoInput, setProfilePhotoInput] = useState<File>();

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

  useEffect(() => {
    if (profilePhotoInput) {
      setGroupImageSrc(URL.createObjectURL(profilePhotoInput));
    } else {
      (async () => {
        if (props.createGroup.roomMembersId) {
          const res = await fetch(
            "http://192.168.182.164:5173/default-group-image.png"
          );
          const blob = await res.blob();
          setProfilePhotoInput(new File([blob], `default-group-image.png`));
        }
      })();
    }
    if (createGroup) {
      if (profilePhotoInput) {
        const formData = new FormData();

        const members = props.createGroup.roomMembersId
          ? props.createGroup.roomMembersId
          : [];

        members.push(props.userId);
        formData.append("members", members.join("__"));
        formData.append("chatroomName", groupName);
        formData.append("groupDescription", groupDescription);
        formData.append("group-profile-picture", profilePhotoInput);

        axios
          .post(`${baseUrl.baseUrl}/chatroom/create-group-chat`, formData, {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res.data);
            props.setUpdateChatRoomsData(
              props.updateChatRoomsData ? false : true
            );
            setIsLoading(false);
            setGroupName("");
            setGroupDescription("");
            props.setCreateGroup({ isCreate: false, roomMembersId: null });
            setCreateGroup(false);
            setProfilePhotoInput(undefined);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [
    baseUrl.baseUrl,
    createGroup,
    groupDescription,
    groupName,
    profilePhotoInput,
    props,
    token,
  ]);

  return (
    <>
      {props.createGroup.isCreate && (
        <div
          className="fixed top-0 left-0 hidden sm:block h-full w-full bg-black/15 z-[100]"
          onClick={() => {
            props.setCreateGroup({ isCreate: false, roomMembersId: null });
            setGroupName("");
            setGroupDescription("");
            setGroupImageSrc("");
            setCrop(undefined);
            setImgSrc("");
            setIsImagePreview(false);
            setProfilePhotoInput(undefined);
            setIsLoading(false);
          }}
        ></div>
      )}
      <div
        className={`fixed top-0 ${
          props.createGroup.isCreate
            ? "left-0 sm:left-[50%] sm:translate-x-[-50%]"
            : "left-[150vw]"
        } transition-all ease-in-out duration-500 h-full w-full sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[25%] 2xl:[20%] sm:h-[60%] xl:h-[50%] sm:top-[50%] sm:translate-y-[-50%] sm:px-5 sm:py-8 flex flex-col items-center justify-center gap-5 py-2 shadow-2xl bg-white z-[150] text-[0.9rem]`}
      >
        {/* group image */}

        <div className="h-[8rem] w-[8rem] bg-blue-gray-500 rounded-full relative border-2 border-black">
          <img src={groupImageSrc} className="h-full w-full rounded-full" />

          <button
            className="absolute bottom-0 right-0 bg-blue-600 rounded-full"
            onClick={() => {
              if (groupImageRef.current) groupImageRef.current.click();
            }}
          >
            <FaRegImage className="size-4" color="white" />{" "}
            <input
              className="hidden"
              type="file"
              accept="image/*"
              ref={groupImageRef}
              onChange={onSelectFile}
            />
          </button>
        </div>
        {/* group name */}
        <div className="h-fit w-[15rem] flex flex-col gap-5 mt-5">
          <div className="h-fit w-full">
            <input
              type="text"
              placeholder="Group name"
              className="bg-gray-200 outline-none p-2 px-2 w-full rounded-md"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          {/* group description */}
          <div className="h-fit w-full">
            <input
              type="text"
              placeholder="Group description"
              className="bg-gray-200 outline-none p-2 px-2 w-full rounded-md"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
          </div>
          <div className="h-fit w-full flex items-center justify-between">
            <Button
              onClick={() => {
                props.setCreateGroup({ isCreate: false, roomMembersId: null });
                setGroupName("");
                setGroupDescription("");
                setGroupImageSrc("");
                setCrop(undefined);
                setImgSrc("");
                setIsImagePreview(false);
                setProfilePhotoInput(undefined);
                setIsLoading(false);
              }}
              variant="outlined"
              className="w-[48%] h-10"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              cancel
            </Button>
            <Button
              onClick={() => {
                setIsLoading(true);
                setCreateGroup(true);
              }}
              variant="outlined"
              className="w-[48%] flex items-center justify-center h-10 bg-blue-600 disabled:bg-gray-600 text-white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {isLoading ? (
                <img src={rollingIcon} className="w-10" />
              ) : (
                "Create"
              )}
            </Button>
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
