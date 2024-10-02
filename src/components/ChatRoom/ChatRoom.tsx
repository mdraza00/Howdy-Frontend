import { PropsWithChildren, useContext, useEffect, useState } from "react";
import baseURLContext from "../../contexts/BaseURLContext";
import styles from "./ChatRoom.module.css";
import axios from "axios";

type propsType = {
  userId: string;
  id: string;
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
  setShowMessagesContainer: (
    chatRoomId: string,
    userName: string,
    profilePhoto: string,
    senderId: string,
    recipientId: string
  ) => void;
  activeChatRoomId: string;
  setActiveChatRoomId: (a: string) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};
type userDataType = {
  name: string;
  profilePhoto: string;
  lastMessage: string;
  _id: string;
};
interface getUserRes {
  status: boolean;
  data: {
    name: string;
    profilePhoto: string;
    email: string;
  };
}

function ChatRoom(props: PropsWithChildren<propsType>) {
  const [userData, setUserData] = useState<userDataType>();
  const baseURL = useContext(baseURLContext);
  const lastMessageDate = new Date(props.lastMessageDate);

  const userId = props.userId;
  const recipientId =
    props.members[0] === userId ? props.members[1] : props.members[0];

  let dateToDisplay = "";

  if (lastMessageDate.toString() === "Invalid Date") {
    dateToDisplay = "";
  } else if (
    lastMessageDate.toLocaleDateString() === new Date().toLocaleDateString()
  ) {
    dateToDisplay = lastMessageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (lastMessageDate.getDate() == new Date().getDate() - 1) {
    dateToDisplay = "yesterday";
  } else {
    dateToDisplay = lastMessageDate.toLocaleDateString();
  }
  useEffect(() => {
    const token = localStorage.getItem("token");

    const url = `${baseURL.baseUrl}/user/getUser`;
    axios
      .post<getUserRes>(
        url,
        { userId: recipientId },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUserData({
          _id: recipientId,
          name: res.data.data.name,
          profilePhoto: res.data.data.profilePhoto,
          lastMessage: props.lastMessage,
        });
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log("an error has occured. error = ", err);
      });
  }, [
    baseURL.baseUrl,
    props.lastMessage,
    props.members,
    props.userId,
    recipientId,
  ]);

  return (
    <div
      className={`w-full flex items-center justify-center p-2 gap-2 ${
        styles["chatroom-contanier"]
      } border-b-2 ${
        props.id === props.activeChatRoomId && `${styles["active-chat"]}`
      } cursor-pointer`}
      onClick={() => {
        props.setActiveChatRoomId(props.id);
        props.setShowMessagesContainer(
          props.id,
          userData?.name || "",
          userData?.profilePhoto || "",
          userId,
          recipientId
        );
        props.setChatRoomUserProfile(props.userId, props.id, false);
      }}
    >
      <div className="w-12 h-10 overflow-hidden rounded-full flex items-center justify-center">
        <img
          className="object-scale-down scale-150"
          src={`${baseURL.baseUrl}/${userData?.profilePhoto}`}
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="w-full flex justify-between">
          {userData?.name}
          <span className="text-sm"> {dateToDisplay}</span>
        </p>
        <p className="w-60 truncate">
          {props.lastMessageVisibleTo.includes(props.userId)
            ? userData?.lastMessage
            : ""}
        </p>
      </div>
    </div>
  );
}
export default ChatRoom;
