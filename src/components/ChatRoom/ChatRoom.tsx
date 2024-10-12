import { PropsWithChildren, useContext, useEffect, useState } from "react";
import baseURLContext from "../../contexts/BaseURLContext";
import axios from "axios";
import { IShowMessagesContainer } from "../../Interface/Interface";

type propsType = {
  userId: string;
  id: string;
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
  setLoadMessages: (a: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
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
      className={`w-full h-fit flex items-center justify-center p-2 gap-2 border-b-2 cursor-pointer hover:bg-black/15 active:bg-white`}
      onClick={() => {
        props.setActiveChatRoomId(props.id);
        props.setShowMessagesContainer({
          isShow: true,
          data: {
            profilePhoto: userData?.profilePhoto || "",
            chatRoomId: props.id,
            userName: userData?.name || "",
            senderId: userId,
            recipientId: recipientId,
          },
        });

        props.setLoadMessages(true);
        props.setChatRoomUserProfile(props.userId, props.id, false);
      }}
    >
      <img
        className="object-contain min-w-[2.7rem] w-[13%] max-w-[3.3rem] rounded-full"
        src={`${baseURL.baseUrl}/${userData?.profilePhoto}`}
      />

      <div className="flex flex-col w-[80%] sm:w-[75%] md:w-[80%] lg:w-[85%] h-fit">
        <p className="w-[100%] flex justify-between">
          <span className="w-fit truncate ">{userData?.name}</span>
          <span className="text-sm w-fit sm:text-[0.75rem]">
            {" "}
            {dateToDisplay}
          </span>
        </p>
        <p className="w-fit max-w-[100%] truncate">
          {props.lastMessageVisibleTo.includes(props.userId)
            ? userData?.lastMessage
            : ""}
        </p>
      </div>
    </div>
  );
}
export default ChatRoom;
