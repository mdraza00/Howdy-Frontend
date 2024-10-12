import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import BaseURLContext from "../../contexts/BaseURLContext";
import rollingIcon from "/icons/RollingIcon.svg";
import { Button } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa6";
import {
  createOrGetChatRoomRes,
  getUsersRes,
  IShowMessagesContainer,
  User,
} from "../../Interface/Interface";

type propsType = {
  userId: string | null;
  profilePhoto: string;
  newChatModel: boolean;
  setNewChatModel: (a: boolean) => void;
  setUpdateChatRoomsData: (a: boolean) => void;
  updateChatRoomsData: boolean;
  setLoadMessages: (a: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
  setActiveChatRoomId: (a: string) => void;
};

function NewChatModel(props: PropsWithChildren<propsType>) {
  const [usernameInput, setUsernameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeUser, setIsActiveUser] = useState({
    id: "",
    active: false,
    username: "",
    profilePhotoAddress: "",
  });
  const [usersData, setUsersData] = useState<User[]>([]);
  const baseURL = useContext(BaseURLContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (usernameInput.length > 0) {
      const url = `${baseURL.baseUrl}/user/getUsers`;
      axios
        .post<getUsersRes>(
          url,
          {
            userNametoFind: usernameInput,
            senderId: props.userId,
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setUsersData(res.data.message);
          console.log(res.data.message);
        })
        .catch((err) => {
          console.log("error is fetching users => ", err);
        });
    } else {
      console.log(props.userId);
      const url = `${baseURL.baseUrl}/user/getUsers/${props.userId}`;
      axios
        .get<getUsersRes>(url, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsersData(res.data.message);
        })
        .catch((err) => {
          console.log("error in fetching users. error = ", err);
        });
    }
    return () => {
      setUsersData([]);
    };
  }, [baseURL.baseUrl, props.userId, token, usernameInput]);

  return (
    <>
      {props.newChatModel && (
        <div
          className="fixed top-0 left-0 hidden sm:block h-full w-full bg-black opacity-15 z-[100]"
          onClick={() => {
            props.setNewChatModel(false);
          }}
        ></div>
      )}
      <div
        className={`fixed top-0 ${
          props.newChatModel
            ? "left-0 sm:left-[50%] sm:translate-x-[-50%]"
            : "left-[150vw]"
        } transition-all ease-in-out duration-500 h-full w-full sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:[20%] sm:h-[70%] sm:top-[50%] sm:translate-y-[-50%] sm:px-5 sm:py-6 flex flex-col items-center justify-center gap-1 py-2 shadow-2xl bg-white z-[150] text-[0.9rem]`}
      >
        <div className="w-[97%] h-fit flex items-center justify-center gap-1 mb-2">
          <FaArrowLeft
            className="rounded-full p-1 active:bg-black/15 "
            size={33}
            onClick={() => {
              props.setNewChatModel(false);
              setIsLoading(false);
            }}
          />
          <input
            type="text"
            className="bg-gray-200 focus:outline-none px-5 py-1 w-[100%] rounded-full"
            placeholder="search username"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            value={usernameInput}
          />
        </div>
        <div
          id="users-container"
          className={`w-[97%] h-[85vh] overflow-auto scroll-bar flex flex-col`}
        >
          {usersData.map((userData) => (
            <div
              id={userData._id}
              key={userData._id}
              className={`flex h-fit w-full items-center gap-2 border-b-2 p-2 ${
                activeUser.active &&
                activeUser.id == userData._id &&
                "bg-black/[.12]"
              }`}
              onClick={() => {
                setIsActiveUser({
                  active: true,
                  id: userData._id,
                  username: userData.username,
                  profilePhotoAddress: userData.profilePhotoAddress,
                });
              }}
            >
              <img
                src={`${baseURL.baseUrl}/${userData.profilePhotoAddress}`}
                className="w-12 h-12 object-cover rounded-full"
              />
              <p>{userData.username}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 h-fit w-full flex items-center justify-evenly">
          <Button
            onClick={() => {
              props.setNewChatModel(false);
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
              const recipientId = activeUser.id;
              const senderId = props.userId;
              const url = `${baseURL.baseUrl}/chatroom/createRoom`;
              axios
                .post<createOrGetChatRoomRes>(
                  url,
                  {
                    senderId,
                    recipientId,
                  },
                  { headers: { authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                  // update chatrooms
                  props.setUpdateChatRoomsData(
                    props.updateChatRoomsData ? false : true
                  );
                  console.log(res.data);
                  props.setActiveChatRoomId(res.data.message);
                  props.setShowMessagesContainer({
                    isShow: true,
                    data: {
                      profilePhoto: activeUser.profilePhotoAddress,
                      chatRoomId: res.data.message,
                      userName: activeUser.username,
                      senderId: senderId ? senderId : "",
                      recipientId: recipientId,
                    },
                  });

                  props.setLoadMessages(true);
                  props.setNewChatModel(false);
                  setIsLoading(false);
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.log(
                    "an error has occured in creating chatroom. error = ",
                    err
                  );
                });
            }}
            className="w-[48%] flex items-center justify-center h-10 bg-blue-600 disabled:bg-gray-600"
            disabled={!activeUser.active}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {isLoading ? <img src={rollingIcon} className="w-10" /> : "Chat"}
          </Button>
        </div>
      </div>
    </>
  );
}
export default NewChatModel;
