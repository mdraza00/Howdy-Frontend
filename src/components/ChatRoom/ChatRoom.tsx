import { PropsWithChildren, useContext, useEffect, useState } from "react";
import baseURLContext from "../../contexts/BaseURLContext";
import axios from "axios";
import { IGetUserRes, IShowMessagesContainer } from "../../Interface/Interface";
import { CHATROOM_TYPE } from "../../enums/chatroomType";

type propsType = {
  userId: string;
  id: string;
  chatroomType: CHATROOM_TYPE;
  chatroomProfilePhoto: string;
  groupDescription: string;
  chatroomName: string;
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
interface chatroomData {
  roomId: string;
  chatroomName: string;
  members: string[];
  profilePhoto: string;
  lastMessage: string;
  chatroomType: CHATROOM_TYPE;
}

function ChatRoom(props: PropsWithChildren<propsType>) {
  const [chatroomData, setChatroomData] = useState<chatroomData>();
  const baseURL = useContext(baseURLContext);
  const lastMessageDate = new Date(props.lastMessageDate);

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
    if (props.chatroomType === CHATROOM_TYPE.PRIVATE) {
      const url = `${baseURL.baseUrl}/user/getUser`;
      const recipientId = props.members.filter(
        (membersId) => membersId != props.userId
      )[0];

      axios
        .post<IGetUserRes>(
          url,
          {
            userId: recipientId,
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res.data.data) {
            setChatroomData({
              roomId: props.id,
              chatroomName: res.data.data.username,
              members: props.members,
              profilePhoto: res.data.data.profilePhotoAddress,
              lastMessage: props.lastMessage,
              chatroomType: CHATROOM_TYPE.PRIVATE,
            });
          }
          // console.log(res.data.data);
        })
        .catch((err) => {
          console.log("an error has occured. error = ", err);
        });
    } else {
      setChatroomData({
        roomId: props.id,
        chatroomName: props.chatroomName,
        members: props.members,
        profilePhoto: props.chatroomProfilePhoto,
        lastMessage: props.lastMessage,
        chatroomType: props.chatroomType,
      });
    }
  }, [
    baseURL.baseUrl,
    props.chatroomName,
    props.chatroomProfilePhoto,
    props.chatroomType,
    props.id,
    props.lastMessage,
    props.members,
    props.userId,
  ]);
  return (
    <div
      className={`w-full h-fit flex items-center justify-center p-2 gap-2 border-b-2 cursor-pointer hover:bg-black/15 active:bg-white`}
      onClick={() => {
        if (chatroomData) {
          props.setActiveChatRoomId(props.id);
          props.setShowMessagesContainer({
            isShow: true,
            data: {
              profilePhoto: chatroomData?.profilePhoto,
              chatRoomId: chatroomData?.roomId,
              chatroomName: chatroomData?.chatroomName,
              members: chatroomData?.members,
              chatroomType: chatroomData.chatroomType,
            },
          });
          props.setLoadMessages(true);
          props.setChatRoomUserProfile(props.userId, props.id, false);
        }
      }}
    >
      <img
        className="object-contain min-w-[2.7rem] w-[13%] max-w-[3.3rem] rounded-full"
        src={`${baseURL.imageUrl}/${chatroomData?.profilePhoto}`}
      />

      <div className="flex flex-col w-[80%] sm:w-[75%] md:w-[80%] lg:w-[85%] h-fit">
        <p className="w-[100%] flex justify-between">
          <span className="w-fit truncate ">{chatroomData?.chatroomName}</span>
          <span className="text-sm w-fit sm:text-[0.75rem]">
            {" "}
            {dateToDisplay}
          </span>
        </p>
        <p className="w-fit max-w-[100%] truncate">
          {props.lastMessageVisibleTo.includes(props.userId)
            ? chatroomData?.lastMessage
            : ""}
        </p>
      </div>
    </div>
  );
}
export default ChatRoom;
