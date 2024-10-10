import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { socket } from "../socket/socket";
import axios from "axios";
import BaseURLContext from "../../contexts/BaseURLContext";
import newChatBtn from "/new-chat.png";
import ChatRoom from "../ChatRoom/ChatRoom";
import User from "../User/User";
import { RiChatNewFill } from "react-icons/ri";
import { IShowMessagesContainer } from "../../Interface/Interface";
type propsType = {
  userId: string;
  setNewChatModel: (a: boolean) => void;
  updateChatRoomsData: boolean;
  setUpdateChatRoomsData: (a: boolean) => void;
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

function ChatRoomsContainer(props: PropsWithChildren<propsType>) {
  const [chatRoomsData, setChatRoomsData] = useState<chatRoomData[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [userNameInput, setUserNameInput] = useState("");
  const BaseURL = useContext(BaseURLContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userNameInput) {
      const url = `${BaseURL.baseUrl}/chatroom/get-my-chatroom-members-by-name/${props.userId}/${userNameInput}`;
      axios
        .get<getUsersRes>(url, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUsersData(res.data.message);
        });
    } else {
      socket.on(
        "last-message",
        (data: {
          chatRoomId: string;
          text: string;
          date: string;
          visibleTo: string[];
        }) => {
          setChatRoomsData((chatRoomsData) => {
            const updatedData = chatRoomsData.map((chatRoom) => {
              return {
                ...chatRoom,
                lastMessage:
                  chatRoom._id === data.chatRoomId
                    ? data.text
                    : chatRoom.lastMessage,
                lastMessageDate:
                  chatRoom._id === data.chatRoomId
                    ? data.date
                    : chatRoom.lastMessageDate,
                lastMessageVisibleTo: data.visibleTo,
              };
            });
            return [...updatedData];
          });
        }
      );
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
      socket.off("last-message");
    };
  }, [
    BaseURL.baseUrl,
    props.updateChatRoomsData,
    props.userId,
    token,
    userNameInput,
  ]);
  return (
    <div className={"h-auto w-full gap-2 flex flex-col items-center"}>
      {/* button  */}
      <div className="w-full h-fit hidden border-2 border-black items-center justify-between">
        <h2 className="text-2xl">Chat</h2>
        <button
          className=""
          onClick={() => {
            props.setNewChatModel(true);
          }}
        >
          <img src={newChatBtn} className="size-8" />
        </button>
      </div>
      <input
        type="text"
        className="w-full text-[1rem] rounded-full px-[0.9rem] py-[0.4rem] mt-2 bg-gray-200 focus:outline-none"
        placeholder="username"
        onChange={(e) => setUserNameInput(e.target.value)}
        value={userNameInput}
      />
      {/* chatrooms */}
      <div className=" h-full w-full flex flex-col mt-3 overflow-auto scroll-bar">
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
                setLoadMessages={props.setLoadMessages}
                setActiveChatRoomId={props.setActiveChatRoomId}
                setChatRoomUserProfile={props.setChatRoomUserProfile}
              />
            );
          })}
        {userNameInput &&
          usersData.map((userData) => (
            <User
              _id={userData._id}
              userId={props.userId}
              updateChatRoomsData={props.updateChatRoomsData}
              username={userData.username}
              profilePhotoAddress={userData.profilePhotoAddress}
              setUserNameInput={setUserNameInput}
              setNewChatModel={props.setNewChatModel}
              setLoadMessages={props.setLoadMessages}
              setUpdateChatRoomsData={props.setUpdateChatRoomsData}
              setActiveChatRoomId={props.setActiveChatRoomId}
              setShowMessagesContainer={props.setShowMessagesContainer}
            />
          ))}
        {/* {userNameInput && 
          usersData.map(userData=>)} */}
      </div>
      <div
        className="fixed w-fit h-fit p-[0.5rem] bottom-4 right-4 bg-blue-600 rounded-md "
        onClick={() => props.setNewChatModel(true)}
      >
        <RiChatNewFill color="white" size={25} />
      </div>
    </div>
  );
}

export default ChatRoomsContainer;
