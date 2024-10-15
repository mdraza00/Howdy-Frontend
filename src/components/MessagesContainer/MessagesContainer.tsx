import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { socket } from "../socket/socket";
import axios from "axios";
import BaseURLContext from "../../contexts/BaseURLContext";

import SenderMessage from "../SenderMessage/SenderMessage";
import ReceiverMessage from "../ReceiverMessage/ReceiverMessage";

import NoMessagesP from "../NoMessagesP/NoMessagesP";
import {
  Imessage,
  ImessageRes,
  IGetMessagesRes,
  ISelectedMessageData,
  IReplyMessage,
  IShowMessagesContainer,
} from "../../Interface/Interface";

import ForwardMessagesModel from "../ForwardMessagesModel/ForwardMessagesModel";
import ChatroomHeader from "../ChatroomHeader/ChatroomHeader";

import DeleteMessagePopup from "../DeleteMessagePopup/DeleteMessagePopup";
import ThreeDotsPopupMenu from "../ThreeDotsPopupMenu/ThreeDotsPopupMenu";
import SelectMessagesOptions from "../SelectMessagesOptions/SelectMessagesOptions";
import SendMessagesForm from "../SendMessagesForm/SendMessagesForm";

type propsType = {
  userId: string;
  recipientId: string;
  chatRoomId: string;
  updateChatRoomsData: boolean;
  loadMessages: boolean;
  chatRoomUserProfile: boolean;
  chatRoomName: string;
  chatRoomProfilePhoto: string;
  showMessagesContainer: IShowMessagesContainer;
  setUpdateChatRoomsData: (a: boolean) => void;
  setLoadMessages: (a: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};

function MessagesContainer(props: PropsWithChildren<propsType>) {
  const [replyToMessage, setReplyToMessage] = useState<IReplyMessage>({
    isReply: false,
    data: null,
  });
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [forwardMessages, setForwardMessages] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isChatRoomDeleted, setIsChatRoomDeleted] = useState(false);
  const [isSelectMessages, setIsSelectMessages] = useState(false);
  const [removeFriend, setRemoveFriend] = useState(false);
  const [isChatRoomMessagesCleared, setIsChatRoomMessagesCleared] =
    useState(false);
  const [threeDotsPopupMenu, setThreeDotsPopupMenu] = useState(false);
  const [deleteForEveryOne, setDeleteForEveryOne] = useState(false);
  const [deleteForMe, setDeleteForMe] = useState(false);
  const [showDeletePopupMenu, setShowDeletePopupMenu] = useState(false);
  const [sendMultiMedia, setSendMultiMedia] = useState(false);
  const [scrollToView, setScrollToView] = useState(false);
  const [sendMessage, setSendMessage] = useState<ImessageRes>({
    status: false,
    message: null,
  });
  const [selectedMessagesData, setSelectedMessagesData] = useState<
    ISelectedMessageData[]
  >([]);

  const baseURL = useContext(BaseURLContext);

  const token = localStorage.getItem("token");

  let date = new Date(13, 7, 2003);

  const messagesContainerDiv = document.getElementById(
    "messages-container-div"
  );

  function setSelectedMessagesDataFunc(
    messageId: string,
    isSelected: boolean,
    createdAt: string
  ) {
    const selectedMessageData = {
      messageId,
      createdAtDate: new Date(createdAt).toLocaleDateString(),
      createdAtTime: new Date(createdAt).toLocaleTimeString(),
    };

    if (isSelected) {
      setSelectedMessagesData((prevSelectedMessages) => {
        return [...prevSelectedMessages, selectedMessageData];
      });
    } else {
      setSelectedMessagesData((prevSelectedMessages) =>
        prevSelectedMessages.filter(
          (messageData) => messageData.messageId !== messageId
        )
      );
    }
  }

  function getPositionAtCenter(element: Element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: (left + width) / 2,
      y: (top + height) / 2,
    };
  }

  function getDistanceBetweenElements(first: Element, second: Element) {
    const firstPosition = getPositionAtCenter(first);
    const secondPosition = getPositionAtCenter(second);
    return Math.sqrt(
      Math.pow(secondPosition.x - firstPosition.x, 2) +
        Math.pow(secondPosition.y - firstPosition.y, 2)
    );
  }

  function messagesContainerScrollHandler() {
    const MessagesPs = document.querySelectorAll(".message-div-container");
    const scrollingDate = document.getElementById("scrolling-date");
    if (messagesContainerDiv) {
      if (messagesContainerDiv.scrollTop < 52) {
        setIsScrolling(false);
      } else if (messagesContainerDiv.scrollTop > 0) {
        setIsScrolling(true);

        if (MessagesPs && scrollingDate) {
          const datesWithDistanceArray: { date: string; distance: number }[] =
            [];
          MessagesPs.forEach((message) => {
            const date = message.id.split("--")[1];
            const distance = getDistanceBetweenElements(scrollingDate, message);
            datesWithDistanceArray.push({
              date: date,
              distance: distance,
            });
          });
          const nearestMessage = datesWithDistanceArray.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr
          );
          scrollingDate.textContent = nearestMessage.date;
        }
      }
    }
  }

  useEffect(() => {
    if (scrollToView) {
      if (messages.length > 0) {
        const lastMessage = document.getElementById(
          `${"--" + messages[messages.length - 1]._id}`
        );
        if (lastMessage) lastMessage.scrollIntoView();
      }
      setScrollToView(false);
    }

    if (removeFriend) {
      axios
        .patch(
          `${baseURL.baseUrl}/user/remove-friend`,
          {
            userId: props.userId,
            friendId: props.recipientId,
            chatroomId: props.chatRoomId,
          },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          props.setUpdateChatRoomsData(
            props.updateChatRoomsData ? false : true
          );
          props.setShowMessagesContainer({ isShow: false, data: null });
          setRemoveFriend(false);
        })
        .catch((err) => console.log(err));
    }

    if (props.loadMessages) {
      const url = `${baseURL.baseUrl}/message/get/${props.chatRoomId}`;
      axios
        .get<IGetMessagesRes>(url, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          props.setLoadMessages(false);
          setSendMultiMedia(false);
          setMessages(res.data.data);
          setScrollToView(true);
          props.setUpdateChatRoomsData(
            props.updateChatRoomsData ? false : true
          );
        });
    }

    // data
    socket.on("receieve-message", () => {
      // setMessages((msgsArray) => [...msgsArray, data]);
      props.setLoadMessages(true);
      setScrollToView(true);
    });

    socket.on("messages-deleted-for-everyone", () => {
      props.setLoadMessages(true);
    });

    if (sendMessage.status && sendMessage.message) {
      console.log("got message", sendMessage.message);
      socket.emit("send-message", {
        _id: sendMessage.message._id,
        chatRoomId: sendMessage.message.chatRoomId,
        senderId: sendMessage.message.senderId,
        messageType: sendMessage.message.messageType,
        image: sendMessage.message.image,
        video: sendMessage.message.video,
        doc: sendMessage.message.doc,
        text: sendMessage.message.text,
        createdAt: sendMessage.message.createdAt,
        updatedAt: sendMessage.message.updatedAt,
        visibleTo: sendMessage.message.visibleTo,
        deletedFor: sendMessage.message.deletedFor,
        deleteForEveryOne: sendMessage.message.deleteForEveryOne,
      });
      setSendMessage({ status: false, message: null });
    }

    if (isChatRoomDeleted) {
      const chatroomId = props.chatRoomId;

      axios
        .delete(`${baseURL.baseUrl}/chatroom/delete/${chatroomId}`, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then(() => {
          props.setShowMessagesContainer({ isShow: false, data: null });
          props.setUpdateChatRoomsData(
            props.updateChatRoomsData ? false : true
          );
        })
        .catch((err) => {
          console.log("error in deleting user chatroom. Error = ", err);
        });
    }
    if (isChatRoomMessagesCleared) {
      const chatroomId = props.chatRoomId;
      const userId = props.userId;
      axios
        .patch<IGetMessagesRes>(
          `${baseURL.baseUrl}/message/clear-messages`,
          {
            chatroomId,
            userId,
          },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setIsChatRoomMessagesCleared(false);
          setMessages(res.data.data);
          props.setUpdateChatRoomsData(
            props.updateChatRoomsData ? false : true
          );
        })
        .catch((err) => {
          console.log("error in deleting user chatroom. Error = ", err);
        });
    }

    if (deleteForEveryOne) {
      axios
        .delete(
          `${baseURL.baseUrl}/message/delete-for-everyone/${props.userId}/${
            props.chatRoomId
          }/${selectedMessagesData
            .map((messageData) => messageData.messageId)
            .join("__")}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          socket.emit("messages-deleted-for-everyone", {
            roomId: props.chatRoomId,
          });
          props.setLoadMessages(true);
          setSelectedMessagesData([]);
          setShowDeletePopupMenu(false);
          setIsSelectMessages(false);
          setDeleteForEveryOne(false);
        })
        .catch((err) => {
          console.log("error in deleting message for everyone. error => ", err);
        });
    }

    if (deleteForMe) {
      axios
        .delete<IGetMessagesRes>(
          `${baseURL.baseUrl}/message/delete-for-me/${props.userId}/${
            props.chatRoomId
          }/${selectedMessagesData
            .map((messageData) => messageData.messageId)
            .join("__")}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setTimeout(() => {
            props.setLoadMessages(true);
          }, 150);
          setSelectedMessagesData([]);
          setShowDeletePopupMenu(false);
          setIsSelectMessages(false);
          setDeleteForMe(false);
        })
        .catch((err) => {
          console.log("error in deleting message for me. error => ", err);
        });
    }

    return () => {
      socket.off("receieve-message");
      socket.off("messages-deleted-for-everyone");
      socket.off("send-message");
    };
  }, [
    baseURL.baseUrl,
    deleteForEveryOne,
    deleteForMe,
    isChatRoomDeleted,
    isChatRoomMessagesCleared,
    messages,
    props,
    removeFriend,
    scrollToView,
    selectedMessagesData,
    sendMessage.message,
    sendMessage.status,
    token,
  ]);

  // handling message input

  return (
    <>
      <ChatroomHeader
        userId={props.userId}
        chatRoomId={props.chatRoomId}
        chatRoomProfilePhoto={props.chatRoomProfilePhoto}
        chatRoomName={props.chatRoomName}
        chatRoomUserProfile={props.chatRoomUserProfile}
        threeDotsPopupMenu={threeDotsPopupMenu}
        setThreeDotsPopupMenu={setThreeDotsPopupMenu}
        setShowMessagesContainer={props.setShowMessagesContainer}
        setChatRoomUserProfile={props.setChatRoomUserProfile}
      />
      <div
        className={`h-full w-full fixed top-[8.2vh] sm:top-[14.7vh] right-0 sm:w-[58vw] md:w-[63vw] ${
          props.chatRoomUserProfile
            ? "lg:w-[33vw] lg:right-[33vw] xl:w-[37vw] 2xl:w-[39vw]"
            : "lg:w-[66vw] xl:w-[70vw] 2xl:w-[72vw]"
        }  `}
      >
        <div
          id="messages-container-div"
          className={`overflow-auto overflow-x-hidden ${
            replyToMessage.isReply && !isSelectMessages
              ? "h-[76.5vh]"
              : "h-[83.6%] sm:h-[77.01vh]"
          }  scroll-bar scroll-smooth bg-chatroom-background transition-all ease-in-out`}
          onScroll={messagesContainerScrollHandler}
        >
          <div
            className={`h-fit w-[98.0%]  ${
              isScrolling ? "top-[0]" : "top-[-3rem]"
            } transition-all ease-in-out flex duration-200 items-center justify-center absolute z-[5]`}
          >
            <p
              id="scrolling-date"
              className={`mb-4 text-center text-[0.7rem] px-2 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
            ></p>
          </div>
          {(messages.length === 0 ||
            messages.filter(
              (message) =>
                message.visibleTo.includes(props.userId) &&
                !message.deletedFor.includes(props.userId)
            ).length < 1) && <NoMessagesP />}
          {messages
            .filter(
              (message) =>
                message.visibleTo.includes(props.userId) &&
                !message.deletedFor.includes(props.userId)
            )
            .map((message) => {
              const msg =
                message.senderId === props.userId ? (
                  <SenderMessage
                    setReplyToMessage={setReplyToMessage}
                    senderId={props.userId}
                    chatRoomName={props.chatRoomName}
                    messageType={message.messageType}
                    image={message.image}
                    text={message.text}
                    video={message.video}
                    doc={message.doc}
                    deleteForEveryOne={message.deleteForEveryOne}
                    key={message._id}
                    time={message.createdAt}
                    createdAt={message.createdAt}
                    messageId={message._id}
                    replyTo={message.replyTo}
                    setShowDeletePopupMenu={setShowDeletePopupMenu}
                    isSelectMessages={isSelectMessages}
                    setIsSelectMessages={setIsSelectMessages}
                    setSelectedMessagesData={setSelectedMessagesDataFunc}
                  />
                ) : (
                  <ReceiverMessage
                    setReplyToMessage={setReplyToMessage}
                    senderId={props.userId}
                    chatRoomName={props.chatRoomName}
                    messageType={message.messageType}
                    image={message.image}
                    text={message.text}
                    video={message.video}
                    doc={message.doc}
                    deleteForEveryOne={message.deleteForEveryOne}
                    key={message._id}
                    time={message.createdAt}
                    createdAt={message.createdAt}
                    messageId={message._id}
                    isSelectMessages={isSelectMessages}
                    setIsSelectMessages={setIsSelectMessages}
                    replyTo={message.replyTo}
                    setShowDeletePopupMenu={setShowDeletePopupMenu}
                    setSelectedMessagesData={setSelectedMessagesDataFunc}
                  />
                );
              let dateJSX = <></>;
              if (
                new Date(message.createdAt).toLocaleDateString() !=
                date.toLocaleDateString()
              ) {
                date = new Date(message.createdAt);
                dateJSX = (
                  <div className="flex justify-center w-full h-fit text-[0.7rem]">
                    <p
                      className={`date-p mb-4 text-center px-2 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
                    >
                      {date.toLocaleDateString()}
                    </p>
                  </div>
                );
              }
              return (
                <div className="h-fit" key={message._id + "message-date"}>
                  {dateJSX}
                  {msg}
                </div>
              );
            })}
        </div>
        {/* send-messages-container */}
        <div className="relative h-fit z-10">
          {!isSelectMessages && (
            <SendMessagesForm
              replyToMessage={replyToMessage}
              setReplyToMessage={setReplyToMessage}
              chatRoomUserProfile={props.chatRoomUserProfile}
              userId={props.userId}
              chatRoomId={props.chatRoomId}
              sendMultiMedia={sendMultiMedia}
              setSendMultiMedia={setSendMultiMedia}
              setIsChatRoomMessagesCleared={setIsChatRoomMessagesCleared}
              setSendMessage={setSendMessage}
            />
          )}
          {forwardMessages && (
            <ForwardMessagesModel
              setSendMessage={setSendMessage}
              userId={props.userId}
              selectedMessagesData={selectedMessagesData}
              setSelectedMessagesData={setSelectedMessagesData}
              setForwardMessages={setForwardMessages}
            />
          )}
          {isSelectMessages && (
            <SelectMessagesOptions
              chatRoomUserProfile={props.chatRoomUserProfile}
              selectedMessagesData={selectedMessagesData}
              setIsSelectMessages={setIsSelectMessages}
              setForwardMessages={setForwardMessages}
              setShowDeletePopupMenu={setShowDeletePopupMenu}
              setSelectedMessagesData={setSelectedMessagesData}
            />
          )}
        </div>
      </div>

      <ThreeDotsPopupMenu
        userId={props.userId}
        setRemoveFriend={setRemoveFriend}
        chatRoomId={props.chatRoomId}
        threeDotsPopupMenu={threeDotsPopupMenu}
        setIsSelectMessages={setIsSelectMessages}
        setIsChatRoomDeleted={setIsChatRoomDeleted}
        setThreeDotsPopupMenu={setThreeDotsPopupMenu}
        setIsChatRoomMessagesCleared={setIsChatRoomMessagesCleared}
        setShowMessagesContainer={props.setShowMessagesContainer}
        setChatRoomUserProfile={props.setChatRoomUserProfile}
      />
      {showDeletePopupMenu && (
        <DeleteMessagePopup
          selectedMessagesData={selectedMessagesData}
          setShowDeletePopupMenu={setShowDeletePopupMenu}
          setDeleteForEveryOne={setDeleteForEveryOne}
          setDeleteForMe={setDeleteForMe}
        />
      )}
    </>
  );
}
export default MessagesContainer;
