import { PropsWithChildren, useEffect, useContext, useState } from "react";
import Context from "../../contexts/BaseURLContext";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import notificationIcon from "/icons/bell icon.png";
import blockIcon from "/icons/block icon.png";
import reportIcon from "/icons/dislike icon.png";
import deleteChatIcon from "/icons/dustbin.png";
import axios from "axios";
type propsType = {
  userId: string;
  chatRoomId: string;
  chatRoomUserProfile: {
    isChatRoomUserProfile: boolean;
    chatRoomId: string;
    userId: string;
  };
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};
interface getChatRoomMembersRes {
  status: boolean;
  message: string[];
}
interface getUserRes {
  status: boolean;
  data: { name: string; email: string; profilePhoto: string; about: string };
}

function ChatRoomUserInfo(props: PropsWithChildren<propsType>) {
  const [chatRoomUserData, setChatRoomUserData] = useState({
    username: "",
    email: "",
    profilePhoto: "",
    about: "",
  });
  const [mute, isMute] = useState(false);
  const baseUrl = useContext(Context);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (props.chatRoomUserProfile.isChatRoomUserProfile) {
      axios
        .get<getChatRoomMembersRes>(
          `${baseUrl.baseUrl}/chatroom/get/chatRoomMembers/${props.chatRoomId}`,
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const recipientId =
            res.data.message[0] === props.userId
              ? res.data.message[1]
              : res.data.message[0];

          axios
            .post<getUserRes>(
              `${baseUrl.baseUrl}/user/getUser`,
              {
                userId: recipientId,
              },
              { headers: { authorization: `Bearer ${token}` } }
            )
            .then((res) => {
              setChatRoomUserData({
                username: res.data.data.name,
                email: res.data.data.email,
                profilePhoto: res.data.data.profilePhoto,
                about: res.data.data.about,
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, [
    props.userId,
    props.chatRoomId,
    baseUrl.baseUrl,
    token,
    props.chatRoomUserProfile.isChatRoomUserProfile,
  ]);
  return (
    <div
      className={`w-full fixed top-0 ${
        props.chatRoomUserProfile.isChatRoomUserProfile
          ? "right-0"
          : "right-[-50rem]"
      } transition-all ease-in-out duration-500  sm:top-[6.5vh] sm:w-[58vw] md:w-[63vw] lg:w-[33vw] bg-blue-gray-50 flex flex-col gap-3 z-[500]`}
    >
      <div className="shadow-md h-fit">
        <div className="flex items-center gap-7 bg-white h-fit">
          <button
            className="p-2"
            onClick={() => {
              props.setChatRoomUserProfile(
                props.userId,
                props.chatRoomId,
                false
              );
            }}
          >
            <img className="w-6" src={closeBtnIcon} />
          </button>
          <p className="text-lg">User Info</p>
        </div>
        <div className="flex flex-col items-center bg-white py-4 h-fit">
          <img
            className="h-48 object-cover rounded-full"
            src={`${baseUrl.baseUrl}/${chatRoomUserData.profilePhoto}`}
          />
          <p className="mt-1 text-xl">{chatRoomUserData.username}</p>
          <p className="text-gray-700 text-[1rem]">{chatRoomUserData.email}</p>
        </div>
      </div>
      <div className="bg-white shadow-md py-3 px-4 h-fit">
        <p className="text-gray-700 mb-1">About</p>
        <p>{chatRoomUserData.about}</p>
      </div>
      <div className="bg-white shadow-md h-fit">
        <div className=" h-fit py-3 px-3 hover:bg-black/[.06] transition-all ease-in-out flex items-center justify-between cursor-pointer">
          <p className="flex items-center gap-2">
            <img src={notificationIcon} className="w-4" /> Mute Notifications
          </p>
          <div
            className={`w-12 h-6 ${
              mute ? "bg-blue-600/[.20]" : "bg-gray-600"
            } border-2 border-gray-600 rounded-full`}
            onClick={() => {
              isMute(mute ? false : true);
            }}
          >
            <div
              className={`h-full w-5 ${
                mute ? "bg-blue-600" : "bg-white"
              } rounded-full transition-all ease-in-out ${
                mute ? "ml-5" : "ml-0"
              } `}
            ></div>
          </div>
        </div>
        <div className="py-3 px-3  h-fit hover:bg-black/[.06] transition-all ease-in-out cursor-pointer">
          <p className="flex items-center gap-2">
            <img src={blockIcon} className="w-4" /> Block{" "}
            {chatRoomUserData.username}
          </p>
        </div>
        <div className="py-3 px-3 h-fit hover:bg-black/[.06] transition-all ease-in-out cursor-pointer">
          <p className="flex items-center gap-2">
            <img src={reportIcon} className="w-4" />
            Report {chatRoomUserData.username}
          </p>
        </div>
        <div className="py-3 px-3 h-fit hover:bg-black/[.06] transition-all ease-in-out cursor-pointer">
          <p className="flex items-center gap-2">
            {" "}
            <img src={deleteChatIcon} className="w-4" />
            Delete Chat
          </p>
        </div>
      </div>
    </div>
  );
}
export default ChatRoomUserInfo;
