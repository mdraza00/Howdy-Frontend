import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseURLContext from "../../contexts/BaseURLContext";
import Header from "../Header/Header";
import ChatRoomsContainer from "../ChatRoomsContainer/ChatRoomsContainer";
import MessagesContainer from "../MessagesContainer/MessagesContainer";
import UserProfile from "../UserProfile/UserProfile";
import NewChatModel from "../NewChatModel/NewChatModel";
import howdyImage from "/images/Howdy_Image.png";
import ChatRoomUserInfo from "../ChatRoomUserInfo/ChatRoomUserInfo";
import lockIcon from "/icons/lock.png";
import { IShowMessagesContainer } from "../../Interface/Interface";
interface getUserRes {
  status: boolean;
  data: {
    name: string;
    profilePhoto: string;
    email: string;
  };
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
    useState<IShowMessagesContainer>({ isShow: false, data: null });
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

  function displayMessagesContainer(data: IShowMessagesContainer) {
    setShowMessagesContainer(data);
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
      {userData.id && (
        <NewChatModel
          profilePhoto={userData.profilePhoto}
          newChatModel={showNewChatModel}
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
        <ChatRoomsContainer
          setChatRoomUserProfile={displayChatRoomUserProfile}
          userId={userData.id}
          setNewChatModel={setNewChatModel}
          isShowMessagesContainer={showMessagesContainer.isShow}
          updateChatRoomsData={updateChatRoomsData}
          setUpdateChatRoomsData={setUpdateChatRoomsData}
          activeChatRoomId={activeChatRoomId}
          setActiveChatRoomId={setActiveChatRoomId}
          setShowMessagesContainer={displayMessagesContainer}
          setLoadMessages={setLoadMessages}
        />
        {showMessagesContainer.isShow && showMessagesContainer.data && (
          <MessagesContainer
            setChatRoomUserProfile={displayChatRoomUserProfile}
            chatRoomUserProfile={chatRoomUserProfile.isChatRoomUserProfile}
            userId={userData.id}
            showMessagesContainer={showMessagesContainer}
            recipientId={showMessagesContainer.data?.recipientId}
            chatRoomId={showMessagesContainer.data?.chatRoomId}
            chatRoomName={showMessagesContainer.data?.userName}
            chatRoomProfilePhoto={showMessagesContainer.data?.profilePhoto}
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
        {!showMessagesContainer.isShow && (
          <div className="hidden sm:w-[58vw] md:w-[63vw] lg:w-[66vw] xl:w-[70vw] 2xl:w-[72vw] sm:flex sm:float-right h-[93.4vh] bg-homePageBg flex-col justify-center items-center">
            <div className="mb-28 flex flex-col justify-center items-center">
              <img
                className=" w-[70%] max-w-[20rem] object-cover"
                src={howdyImage}
              />
              <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 w-full text-center">
                Welcome to Howdy!
              </h1>
              <p className="w-full text-[0.9rem] text-justify p-3">
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
      </div>
    </>
  );
}
export default Home;
