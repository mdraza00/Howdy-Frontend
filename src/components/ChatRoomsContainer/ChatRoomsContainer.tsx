import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { socket } from "../socket/socket";
import axios from "axios";
import BaseURLContext from "../../contexts/BaseURLContext";
import ChatRoom from "../ChatRoom/ChatRoom";
import User from "../User/User";
import { RiChatNewFill } from "react-icons/ri";
import {
  IChatRoom,
  IGetChatRoomRes,
  IGetUsersRes,
  IShowMessagesContainer,
  IUser,
} from "../../Interface/Interface";
import { FaUserPlus } from "react-icons/fa";

type propsType = {
  userId: string;
  updateChatRoomsData: boolean;
  activeChatRoomId: string;
  isShowMessagesContainer: boolean;
  setNewChatModel: (a: boolean) => void;
  setFriendRequestModel: (a: boolean) => void;
  setUpdateChatRoomsData: (a: boolean) => void;
  setLoadMessages: (a: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
  setActiveChatRoomId: (a: string) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};

interface User {
  _id: string;
  email: string;
  username: string;
  profilePhotoAddress: string;
}

function ChatRoomsContainer(props: PropsWithChildren<propsType>) {
  const [chatRoomsData, setChatRoomsData] = useState<IChatRoom[]>([]);
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [userNameInput, setUserNameInput] = useState("");
  const BaseURL = useContext(BaseURLContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userNameInput) {
      const url = `${BaseURL.baseUrl}/chatroom/get-my-chatroom-members-by-name/${props.userId}/${userNameInput}`;
      axios
        .get<IGetUsersRes>(url, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.data) setUsersData(res.data.data);
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
        .post<IGetChatRoomRes>(
          url,
          { currentUserId },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setChatRoomsData(res.data.data);
        })
        .catch((err) => {
          console.log(
            "an error has occurred in finding chatroom's. error = ",
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
    <div
      className={`h-[93%] w-full sm:w-[42vw] md:w-[37vw] lg:w-[34vw] xl:w-[30vw] 2xl:w-[28vw] sm:border-2 sm:border-gray-100 gap-2 flex flex-col items-center fixed sm:flex top-[6.5vh] left-[0] sm:text-[0.85rem] md:text-[0.9rem] lg:text-[1rem]`}
    >
      {/* button  */}
      <div className="hidden w-full h-fit sm:flex items-center justify-between p-1 ">
        <h2 className="text-lg md:text-xl lg:text-2xl">Chat</h2>
        <div className="flex gap-[1rem]">
          <div
            className={`h-fit bg-blue-600 p-1 rounded-sm`}
            onClick={() => props.setNewChatModel(true)}
          >
            <RiChatNewFill
              color="white"
              className="size-5 md:size-6 lg:size-7"
            />
          </div>
          <div
            className="h-fit bg-blue-600 p-1 rounded-sm "
            onClick={() => {
              props.setFriendRequestModel(true);
            }}
          >
            <FaUserPlus color="white" className="size-5 md:size-6 lg:size-7" />
          </div>
        </div>
      </div>
      <input
        type="text"
        className="w-[97%] text-[1rem] rounded-full px-[0.9rem] sm:px[0.7px] md:px[0.8rem] lg:px[0.9rem] py-[0.4rem] sm:py-[0.2rem] md:py-[0.3rem] lg:py-[0.4rem] mt-2 sm:mt-0 bg-gray-200 focus:outline-none"
        placeholder="username"
        onChange={(e) => setUserNameInput(e.target.value)}
        value={userNameInput}
      />
      {/* chatrooms */}
      <div className="w-full flex flex-col mt-3 sm:mt-1 overflow-auto scroll-bar">
        {!userNameInput &&
          chatRoomsData.map((chatRoom) => {
            // join chatroom using socket
            socket.emit("join room", chatRoom._id);
            return (
              <ChatRoom
                userId={props.userId}
                key={chatRoom._id}
                id={chatRoom._id}
                chatroomType={chatRoom.chatroomType}
                chatroomProfilePhoto={chatRoom.chatroomProfilePhoto}
                groupDescription={chatRoom.groupDescription}
                chatroomName={chatRoom.chatroomName}
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
        className={`absolute sm:hidden w-fit h-fit ${
          props.isShowMessagesContainer ? "bottom-[-30rem]" : "bottom-4"
        } flex flex-col gap-[1rem] right-4 z-[90]`}
      >
        <div
          className={`bg-blue-600 rounded-md p-[0.5rem]`}
          onClick={() => props.setNewChatModel(true)}
        >
          <RiChatNewFill color="white" size={25} />
        </div>
        <div
          className={`bg-blue-600 rounded-md p-[0.5rem]`}
          onClick={() => props.setFriendRequestModel(true)}
        >
          <FaUserPlus color="white" size={25} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoomsContainer;
