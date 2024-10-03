import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseURLContext from "../../contexts/BaseURLContext";
import Header from "../Header/Header";
import styles from "./Home.module.css";
import ChatRoomsContainer from "../ChatRoomsContainer/ChatRoomsContainer";
import MessagesContainer from "../MessagesContainer/MessagesContainer";
import UserProfile from "../UserProfile/UserProfile";
import NewChatModel from "../NewChatModel/NewChatModel";
import howdyImage from "/images/Howdy_Image.png";
import ChatRoomUserInfo from "../ChatRoomUserInfo/ChatRoomUserInfo";
import lockIcon from "/icons/lock.png";
interface getUserRes {
  status: boolean;
  data: {
    name: string;
    profilePhoto: string;
    email: string;
  };
}
interface IShowMessagesContainer {
  profilePhoto: string;
  chatRoomId: string;
  userName: string;
  senderId: string;
  recipientId: string;
}
interface authUser {
  status: boolean;
  data: {
    message: string;
    id: string;
  };
}
function Home() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    profilePhoto: "",
  });
  const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);
  const [showNewChatModel, setShowNewChatModel] = useState(false);
  const [loadMessages, setLoadMessages] = useState(false);
  const [showUserProfileModel, setShowUserProfileModel] = useState(false);
  const [chatRoomUserProfile, setChatRoomUserProfile] = useState({
    isChatRoomUserProfile: false,
    chatRoomId: "",
    userId: "",
  });
  const [showMessagesContainer, setShowMessagesContainer] =
    useState<IShowMessagesContainer>();
  const [updateChatRoomsData, setUpdateChatRoomsData] = useState(false);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  // const [chatRooms, setChatRooms] = useState({});
  const navigate = useNavigate();
  const baseURL = useContext(BaseURLContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // check of token is valid or not
      axios
        .post<authUser>(`${baseURL.baseUrl}/auth`, {
          token,
        })
        .then((response) => {
          axios
            .post<getUserRes>(
              `${baseURL.baseUrl}/user/getUser`,
              {
                userId: response.data.data.id,
              },
              { headers: { authorization: `Bearer ${token}` } }
            )
            .then((res) => {
              if (res.data.status && res.data.data?.email) {
                setUserData({
                  id: response.data.data.id,
                  name: res.data.data?.name,
                  email: res.data.data?.email,
                  profilePhoto: res.data.data?.profilePhoto,
                });
              }
            })
            .catch((err) => {
              console.log("error from home = ", err);
            });
        })
        .catch((err) => {
          console.log(err);
          navigate("/login-signup");
        });
      // get user information
    } else {
      navigate("/login-signup");
    }
  }, [baseURL.baseUrl, navigate, isUserDataUpdated]);

  function setNewChatModel(a: boolean) {
    setShowNewChatModel(a);
  }
  function displayMessagesContainer(
    chatRoomId: string,
    userName: string,
    profilePhoto: string,
    senderId: string,
    recipientId: string,
    showMessagesContianer: boolean = true
  ) {
    if (showMessagesContianer)
      setShowMessagesContainer({
        chatRoomId,
        userName,
        profilePhoto,
        senderId,
        recipientId,
      });
    else setShowMessagesContainer(undefined);
  }

  function displayChatRoomUserProfile(
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) {
    setChatRoomUserProfile({ isChatRoomUserProfile, userId, chatRoomId });
  }
  return (
    <>
      {showNewChatModel && (
        <NewChatModel
          profilePhoto={userData.profilePhoto}
          setNewChatModel={setNewChatModel}
          userId={userData.id}
          updateChatRoomsData={updateChatRoomsData}
          setActiveChatRoomId={setActiveChatRoomId}
          setUpdateChatRoomsData={setUpdateChatRoomsData}
          setShowMessagesContainer={displayMessagesContainer}
          setLoadMessages={setLoadMessages}
        />
      )}

      {showUserProfileModel && (
        <UserProfile
          userId={userData.id}
          setShowUserProfileModel={setShowUserProfileModel}
          isUserDataUpdated={isUserDataUpdated}
          setIsUserDataUpdated={setIsUserDataUpdated}
        />
      )}
      <div className="h-full">
        <Header
          profilePhoto={userData.profilePhoto}
          name={userData.name}
          setShowUserProfileModel={setShowUserProfileModel}
        />
        <section className={`h-5/6 flex ${styles["h-95"]}`}>
          <ChatRoomsContainer
            setChatRoomUserProfile={displayChatRoomUserProfile}
            userId={userData.id}
            setNewChatModel={setNewChatModel}
            updateChatRoomsData={updateChatRoomsData}
            setUpdateChatRoomsData={setUpdateChatRoomsData}
            activeChatRoomId={activeChatRoomId}
            setActiveChatRoomId={setActiveChatRoomId}
            setShowMessagesContainer={displayMessagesContainer}
            setLoadMessages={setLoadMessages}
          />
          {!!showMessagesContainer && (
            <MessagesContainer
              setChatRoomUserProfile={displayChatRoomUserProfile}
              chatRoomUserProfile={chatRoomUserProfile.isChatRoomUserProfile}
              userId={userData.id}
              recipientId={showMessagesContainer.recipientId}
              chatRoomId={showMessagesContainer.chatRoomId}
              chatRoomName={showMessagesContainer.userName}
              chatRoomProfilePhoto={showMessagesContainer.profilePhoto}
              updateChatRoomsData={updateChatRoomsData}
              setUpdateChatRoomsData={setUpdateChatRoomsData}
              setShowMessagesContainer={displayMessagesContainer}
              loadMessages={loadMessages}
              setLoadMessages={setLoadMessages}
            />
          )}
          {chatRoomUserProfile.isChatRoomUserProfile && (
            <ChatRoomUserInfo
              userId={userData.id}
              chatRoomId={chatRoomUserProfile.chatRoomId}
              setChatRoomUserProfile={displayChatRoomUserProfile}
            />
          )}
          {!showMessagesContainer && (
            <div className="w-3/4  bg-homePageBg flex flex-col justify-center items-center">
              <div className="mb-28 flex flex-col justify-center items-center">
                <img
                  className="w-[340px] h-[300px] object-cover"
                  src={howdyImage}
                />
                <h1 className="text-4xl mb-2">Welcome to Howdy!</h1>
                <p>
                  "Connect, chat, and discover with Howdy - where conversations
                  start with a simple hello!"
                </p>
              </div>

              <div className="absolute bottom-8 text-sm text-blue-gray-700">
                <span className="flex items-center gap-1">
                  <img className="w-[13px]" src={lockIcon} /> Your personal
                  messages are end-to-end encrypted
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
export default Home;
