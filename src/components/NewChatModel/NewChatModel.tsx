import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import BaseURLContext from "../../contexts/BaseURLContext";
import styles from "./NewChatModel.module.css";
import rollingIcon from "/icons/RollingIcon.svg";
import { Button } from "@material-tailwind/react";

type propsType = {
  userId: string | null;
  profilePhoto: string;
  setNewChatModel: (a: boolean) => void;
  setUpdateChatRoomsData: (a: boolean) => void;
  updateChatRoomsData: boolean;
  setShowMessagesContainer: (
    chatRoomId: string,
    userName: string,
    profilePhoto: string,
    senderId: string,
    recipientId: string
  ) => void;
  setActiveChatRoomId: (a: string) => void;
};

interface getUsersRes {
  status: boolean;
  message: {
    _id: string;
    email: string;
    username: string;
    profilePhotoAddress: string;
  }[];
}
interface User {
  _id: string;
  email: string;
  username: string;
  profilePhotoAddress: string;
}
interface createChatRoomRes {
  status: boolean;
  message: string;
}
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
      <div
        className="absolute h-screen w-screen bg-black opacity-15 z-40"
        onClick={() => {
          props.setNewChatModel(false);
        }}
      ></div>
      <div className="absolute top-[19%] left-[36.5%]">
        <div className="h-fit shadow-2xl border-2 border-black w-fit p-10 bg-white rounded-md absolute z-50">
          <input
            type="text"
            className="bg-gray-200 focus:outline-none px-3 py-1 w-80 rounded-md"
            placeholder="search username"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
          />
          <div
            id="users-container"
            className={`h-96 w-80 overflow-auto scroll-bar mt-4 pr-1 flex flex-col`}
          >
            {usersData.map((userData) => (
              <div
                id={userData._id}
                key={userData._id}
                className={`flex items-center gap-2 border-b-2 p-2 ${
                  styles["newChatUser"]
                } ${
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
                  className="border-2 border-black w-12 h-12 object-cover rounded-full"
                />
                <p>{userData.username}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-evenly">
            <Button
              onClick={() => {
                props.setNewChatModel(false);
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
                  .post<createChatRoomRes>(
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
                    props.setShowMessagesContainer(
                      res.data.message,
                      activeUser.username,
                      activeUser.profilePhotoAddress,
                      senderId ? senderId : "",
                      recipientId
                    );
                    props.setNewChatModel(false);
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
      </div>
    </>
  );
}
export default NewChatModel;
