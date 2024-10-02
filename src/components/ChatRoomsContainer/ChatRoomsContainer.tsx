import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { socket } from "../socket/socket";
import axios from "axios";
import BaseURLContext from "../../contexts/BaseURLContext";
import newChatBtn from "/new-chat.png";
import styles from "./ChatRoomsContainer.module.css";
import ChatRoom from "../ChatRoom/ChatRoom";
type propsType = {
  userId: string;
  setNewChatModel: (a: boolean) => void;
  updateChatRoomsData: boolean;
  setUpdateChatRoomsData: (a: boolean) => void;
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
interface getChatRoomsRes {
  status: boolean;
  data: {
    _id: string;
    members: string[];
    lastMessage: string;
    lastMessageDate: string;
    lastMessageVisibleTo: string[];
    createdAt: string;
    updatedAt: string;
  }[];
}
interface getUsersRes {
  status: boolean;
  message: {
    _id: string;
    email: string;
    username: string;
    profilePhotoAddress: string;
  }[];
}
type chatRoomData = {
  _id: string;
  members: string[];
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
  createdAt: string;
  updatedAt: string;
};

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

function ChatRoomsContainer(props: PropsWithChildren<propsType>) {
  const [chatRoomsData, setChatRoomsData] = useState<chatRoomData[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [userNameInput, setUserNameInput] = useState("");
  const BaseURL = useContext(BaseURLContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userNameInput) {
      const url = `${BaseURL.baseUrl}/user/getUsers`;
      axios
        .post<getUsersRes>(
          url,
          {
            userNametoFind: userNameInput,
            senderId: props.userId,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data);

          setUsersData(res.data.message);
        });
      // console.log(userNameInput);
    } else {
      socket.on("last message", (data) => {
        console.log(data);
        setChatRoomsData((chatRoomsData) => {
          const updatedData = chatRoomsData.map((chatRoom) => {
            return {
              ...chatRoom,
              lastMessage:
                chatRoom._id === data.roomId
                  ? data.message
                  : chatRoom.lastMessage,
              lastMessageDate:
                chatRoom._id === data.roomId
                  ? data.lastMessageDate
                  : chatRoom.lastMessageDate,
              lastMessageVisibleTo: data.visibleTo,
            };
          });
          return [...updatedData];
        });
      });
      const url = `${BaseURL.baseUrl}/chatroom/get/ChatRooms`;
      const currentUserId = props.userId;
      axios
        .post<getChatRoomsRes>(
          url,
          { currentUserId },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setChatRoomsData(res.data.data);
        })
        .catch((err) => {
          console.log(
            "an error has occured in finding chatrooms. error = ",
            err
          );
        });
    }
    return () => {
      socket.off("last message");
    };
  }, [
    BaseURL.baseUrl,
    props.updateChatRoomsData,
    props.userId,
    token,
    userNameInput,
  ]);
  return (
    <div className={`h-full w-1/4 gap-2 flex flex-col items-center px-2`}>
      {/* button  */}
      <div className=" w-full flex items-center justify-between">
        <h2 className="text-2xl">Chat</h2>
        <button
          className=""
          onClick={() => {
            props.setNewChatModel(true);
          }}
        >
          <img src={newChatBtn} className="size-7" />
        </button>
      </div>
      <input
        type="text"
        className="w-full text-md rounded-sm px-2 py-1 bg-gray-200 focus:outline-none"
        placeholder="username"
        onChange={(e) => setUserNameInput(e.target.value)}
        value={userNameInput}
      />
      {/* chatrooms */}
      <div className="h-full w-full flex flex-col border-r-2 overflow-auto scroll-bar">
        {!userNameInput &&
          chatRoomsData.map((chatRoom) => {
            // join chatroom using socket
            socket.emit("join room", chatRoom._id);
            return (
              <ChatRoom
                userId={props.userId}
                key={chatRoom._id}
                id={chatRoom._id}
                lastMessage={chatRoom.lastMessage}
                lastMessageDate={chatRoom.lastMessageDate}
                lastMessageVisibleTo={chatRoom.lastMessageVisibleTo}
                members={chatRoom.members}
                activeChatRoomId={props.activeChatRoomId}
                setShowMessagesContainer={props.setShowMessagesContainer}
                setActiveChatRoomId={props.setActiveChatRoomId}
                setChatRoomUserProfile={props.setChatRoomUserProfile}
              />
            );
          })}
        {userNameInput &&
          usersData.map((userData) => (
            <div
              id={userData._id}
              key={userData._id}
              className={`flex items-center gap-2 p-2 rounded-md border-black ${styles["newChatUser"]}`}
              onClick={(e) => {
                const recipientId = e.currentTarget.id;
                const senderId = props.userId;
                const url = `${BaseURL.baseUrl}/chatroom/createRoom`;

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
                    // console.log(res.data.message);
                    props.setActiveChatRoomId(res.data.message);
                    props.setShowMessagesContainer(
                      res.data.message,
                      userData.username,
                      userData.profilePhotoAddress,
                      senderId,
                      recipientId
                    );
                    props.setNewChatModel(false);
                  })
                  .catch((err) => {
                    console.log(
                      "an error has occured in creating chatroom. error = ",
                      err
                    );
                  });

                setUserNameInput("");
              }}
            >
              <img
                src={`${BaseURL.baseUrl}/${userData.profilePhotoAddress}`}
                className="object-cover w-12 rounded-full"
              />
              <p>{userData.username}</p>
            </div>
          ))}
        {/* {userNameInput && 
          usersData.map(userData=>)} */}
      </div>
    </div>
  );
}

export default ChatRoomsContainer;
