import {
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { socket } from "../socket/socket";
import axios from "axios";
import BaseURLContext from "../../contexts/BaseURLContext";
import sendMessageBtnIcon from "../../assets/send-message-btn-icon.png";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import starIcon from "/icons/star.png";
import dustbinIcon from "/icons/dustbin-black.png";
import forwardIcon from "/icons/forward.png";
import downloadIcon from "/icons/download.png";
import styles from "./MessagesContainer.module.css";
import SenderMessage from "../SenderMessage/SenderMessage";
import ReceiverMessage from "../ReceiverMessage/ReceiverMessage";
import threeDotsIcon from "/three-dots-icon.png";
import searchIcon from "/search-icon.png";
import NoMessagesP from "../NoMessagesP/NoMessagesP";
import { Button } from "@material-tailwind/react";
import SendMultiMedia from "../SendMultiMedia/SendMultiMedia";
import { MessageType } from "../../enums/message";
import {
  Imessage,
  ImessageRes,
  IGetMessagesRes,
  ISelectedMessageData,
} from "../../Interface/Interface";

type propsType = {
  userId: string;
  recipientId: string;
  chatRoomId: string;
  updateChatRoomsData: boolean;
  setUpdateChatRoomsData: (a: boolean) => void;
  setLoadMessages: (a: boolean) => void;
  loadMessages: boolean;
  setShowMessagesContainer: (
    chatRoomId: string,
    userName: string,
    profilePhoto: string,
    senderId: string,
    recipientId: string,
    showMessagesContianer: boolean
  ) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
  chatRoomUserProfile: boolean;
  chatRoomName: string;
  chatRoomProfilePhoto: string;
};

function MessagesContainer(props: PropsWithChildren<propsType>) {
  const [messages, setMessages] = useState<Imessage[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isChatRoomDeleted, setIsChatRoomDeleted] = useState(false);
  const [isSelectMessages, setIsSelectMessages] = useState(false);
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
    const MessagesPs = document.querySelectorAll(".message-p");
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
          `${messages[messages.length - 1]._id}--${new Date(
            messages[messages.length - 1].createdAt
          ).toLocaleDateString()}`
        );
        if (lastMessage) lastMessage.scrollIntoView();
      }
      setScrollToView(false);
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

    socket.on("receieve-message", (data) => {
      setMessages((msgsArray) => [...msgsArray, data]);
      setScrollToView(true);
    });

    socket.on("messages-deleted-for-everyone", () => {
      props.setLoadMessages(true);
    });

    if (sendMessage.status && sendMessage.message) {
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
          props.setShowMessagesContainer("", "", "", "", "", false);
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
    props.chatRoomId,
    scrollToView,
    selectedMessagesData,
    sendMessage,
    token,
  ]);

  const storeMessagesInDB = (
    message: string,
    chatRoomId: string,
    senderId: string,
    messageType: MessageType
  ) => {
    const url = `${baseURL.baseUrl}/message/save`;
    axios
      .post<ImessageRes>(
        url,
        {
          chatRoomId: chatRoomId,
          senderId: senderId,
          text: message,
          messageType: messageType,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.message)
          setSendMessage({
            status: true,
            message: {
              _id: res.data.message._id,
              chatRoomId: res.data.message.chatRoomId,
              messageType: res.data.message.messageType,
              image: res.data.message.image,
              video: res.data.message.video,
              text: res.data.message.text,
              doc: res.data.message.doc,
              createdAt: res.data.message.createdAt,
              updatedAt: res.data.message.updatedAt,
              senderId: res.data.message.senderId,
              visibleTo: res.data.message.visibleTo,
              deletedFor: res.data.message.deletedFor,
              deleteForEveryOne: res.data.message.deleteForEveryOne,
            },
          });
      })
      .catch((err) => {
        console.log("error in storing message. error => ", err);
      });
  };
  // handling message input
  const sendMessageBtnHandler = function (e: React.BaseSyntheticEvent) {
    e.preventDefault();

    const messageInput = inputRef.current?.value;

    if (messageInput && messageInput.length > 0) {
      const senderId = props.userId;

      if (senderId)
        storeMessagesInDB(
          messageInput,
          props.chatRoomId,
          senderId,
          MessageType.TEXT
        );

      if (inputRef.current) inputRef.current.value = "";

      setIsChatRoomMessagesCleared(false);
    }
  };

  return (
    <>
      <div
        className={`${
          props.chatRoomUserProfile ? "w-[45%]" : "w-[75%]"
        } h-[85.9vh] transition-all ease-in-out`}
      >
        <div className="w-full bg-light-blue-800 flex justify-between relative z-[70]">
          <div
            className="flex gap-2 items-center p-1 px-4 rounded-md active:bg-white/[.15] transition-all ease-in-out cursor-pointer"
            onClick={() => {
              props.setChatRoomUserProfile(
                props.userId,
                props.chatRoomId,
                true
              );
            }}
          >
            <img
              src={`${baseURL.baseUrl}/${props.chatRoomProfilePhoto}`}
              className="w-12 h-12 m-1 rounded-full object-cover"
            />
            <p className="text-white">{props.chatRoomName}</p>
          </div>
          <div className="flex items-center">
            <button className="rounded-full active:bg-white/[.20] active:shadow-md transition-all ease-in-out duration-200">
              <img className="w-6" src={searchIcon} />
            </button>
            <button
              className="rounded-full active:bg-white/[.20] active:shadow-md transition-all ease-in-out duration-200"
              onClick={() => {
                setThreeDotsPopupMenu(threeDotsPopupMenu ? false : true);
              }}
            >
              <img className="w-7" src={threeDotsIcon} />
            </button>
          </div>
        </div>
        <div
          id="messages-container-div"
          className={`overflow-auto h-full scroll-bar ${styles["display-message-container"]} scroll-smooth`}
          onScroll={messagesContainerScrollHandler}
        >
          {/* top-[6.7rem] */}
          {/* w-[74.4%] */}
          <div
            className={`flex justify-center absolute ${
              props.chatRoomUserProfile ? "w-[44.8%]" : "w-[74.4%]"
            }  ${
              isScrolling ? "top-[6.7rem]" : "top-[3rem]"
            } transition-all ease-in-out duration-200  z-[2]`}
          >
            <p
              id="scrolling-date"
              className={`mb-4 text-center text-xs px-3 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
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
                    setShowDeletePopupMenu={setShowDeletePopupMenu}
                    isSelectMessages={isSelectMessages}
                    setSelectedMessagesData={setSelectedMessagesDataFunc}
                  />
                ) : (
                  <ReceiverMessage
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
                  <div className="flex justify-center w-full">
                    <p
                      className={`date-p text-xs mb-4 text-center px-3 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
                    >
                      {date.toLocaleDateString()}
                    </p>
                  </div>
                );
              }
              return (
                <div key={message._id}>
                  {dateJSX}
                  {msg}
                </div>
              );
            })}
        </div>
        {/* send-messages-container */}
        <div className="relative">
          {!isSelectMessages && (
            <>
              <SendMultiMedia
                chatRoomId={props.chatRoomId}
                senderId={props.userId}
                setSendMessage={setSendMessage}
                sendMultiMedia={sendMultiMedia}
                setSendMultiMedia={setSendMultiMedia}
              />
              <div className="h-[6.2vh] flex bg-blue-gray-50 items-center justify-end px-2 z-[72] relative">
                <form
                  className={`w-[96%] flex items-center  `}
                  onSubmit={sendMessageBtnHandler}
                >
                  <input
                    id="message-input"
                    type="text"
                    className="w-full rounded-sm px-2 py-1 mx-2 focus:outline-none text-xl"
                    placeholder="Type a message"
                    ref={inputRef}
                    // value={messageInput}
                    // onChange={(e) => setMessageInput(e.target.value)}
                  />

                  <button
                    type="submit"
                    className={`w-fit flex justify-center ${styles["send-message-btn"]}`}
                  >
                    <img className="w-6" src={sendMessageBtnIcon} />
                  </button>
                </form>
              </div>
            </>
          )}
          {isSelectMessages && (
            <div className="h-[6.3vh] flex items-center px-5 justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="p-1 flex items-center gap-3  hover:bg-black/10 active:bg-transparent transition-all ease-in-out"
                  onClick={() => {
                    setSelectedMessagesData([]);
                    setIsSelectMessages(false);
                  }}
                >
                  <img className="w-6" src={closeBtnIcon} />
                </button>
                <span className="text-base">
                  {selectedMessagesData.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`p-1  transition-all ease-in-out ${
                    selectedMessagesData.length > 0
                      ? "hover:bg-black/10 active:bg-transparent"
                      : "opacity-15"
                  } `}
                  disabled={!(selectedMessagesData.length > 0)}
                  onClick={() => {}}
                >
                  <img src={starIcon} className="w-6 cursor" />
                </button>
                <button
                  className={`p-1  transition-all ease-in-out ${
                    selectedMessagesData.length > 0
                      ? "hover:bg-black/10 active:bg-transparent"
                      : "opacity-15"
                  } `}
                  disabled={!(selectedMessagesData.length > 0)}
                  onClick={() => {
                    setShowDeletePopupMenu(true);
                  }}
                >
                  <img src={dustbinIcon} className="w-6 cursor-pointer" />
                </button>
                <button
                  className={`p-1  transition-all ease-in-out ${
                    selectedMessagesData.length > 0
                      ? "hover:bg-black/10 active:bg-transparent"
                      : "opacity-15"
                  } `}
                  disabled={!(selectedMessagesData.length > 0)}
                  onClick={() => {}}
                >
                  <img src={forwardIcon} className="w-6 cursor-pointer" />
                </button>
                <button
                  className={`p-1  transition-all ease-in-out ${
                    selectedMessagesData.length > 0
                      ? "hover:bg-black/10 active:bg-transparent"
                      : "opacity-15"
                  } `}
                  disabled={!(selectedMessagesData.length > 0)}
                  onClick={() => {}}
                >
                  <img src={downloadIcon} className="w-6 cursor-pointer" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {threeDotsPopupMenu && (
        <div
          className="absolute w-screen h-[91.9vh] z-[60]"
          onClick={() => setThreeDotsPopupMenu(false)}
        ></div>
      )}
      <div
        className={`absolute bg-white ${
          threeDotsPopupMenu ? "top-28" : "-top-52"
        }  ${
          props.chatRoomUserProfile ? "right-[30rem]" : "right-3"
        }  py-2 z-[60] transition-all ease-in-out duration-300`}
      >
        <div
          className="w-52 px-8 py-3 hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            props.setChatRoomUserProfile(props.userId, props.chatRoomId, true);
            setThreeDotsPopupMenu(false);
          }}
        >
          <p>Contact Info</p>
        </div>
        <div
          className="w-52 px-8 py-3 hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            setThreeDotsPopupMenu(false);
            setIsSelectMessages(true);
          }}
        >
          <p>Select Messages</p>
        </div>
        <div
          className="w-52 px-8 py-3 hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() =>
            props.setShowMessagesContainer("", "", "", "", "", false)
          }
        >
          <p>Close Chat</p>
        </div>
        <div
          className="w-52 px-8 py-3 hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            setIsChatRoomMessagesCleared(true);
            setTimeout(() => {
              setThreeDotsPopupMenu(false);
            }, 100);
          }}
        >
          <p>Clear Chat</p>
        </div>
        <div
          className="w-52 px-8 py-3 hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => setIsChatRoomDeleted(true)}
        >
          <p>Delete Chat</p>
        </div>
      </div>
      {showDeletePopupMenu && (
        <>
          <div
            className="absolute w-[99.99vw] h-[94.3vh] bg-black/20 z-[1000]"
            onClick={() => setShowDeletePopupMenu(false)}
          ></div>
          <div
            className={`absolute w-[32%] ${
              selectedMessagesData
                .map(
                  (selectedMessage) => selectedMessage.messageId.split("--")[1]
                )
                .includes("receive")
                ? "h-[17%]"
                : "h-[30%]"
            }  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white z-[1001] px-6 py-4 shadow-2xl`}
          >
            <p className="text-base">Delete Chat ?</p>
            <div className="flex flex-col gap-3 justify-center items-end mt-3">
              {!selectedMessagesData
                .map(
                  (selectedMessage) => selectedMessage.messageId.split("--")[1]
                )
                .includes("receive") && (
                <Button
                  className="rounded-full bg-blue-600 text-white border-2 w-fit"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onClick={() => setDeleteForEveryOne(true)}
                >
                  Delete for everyone
                </Button>
              )}
              <div
                className={`flex ${
                  selectedMessagesData
                    .map(
                      (selectedMessage) =>
                        selectedMessage.messageId.split("--")[1]
                    )
                    .includes("receive")
                    ? "gap-3"
                    : "flex-col gap-3 items-end"
                }`}
              >
                <Button
                  className="rounded-full bg-blue-600 text-white border-2 w-fit"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onClick={() => setDeleteForMe(true)}
                >
                  Delete for me
                </Button>
                <Button
                  className="rounded-full bg-white text-blue-500 border-2 w-fit"
                  onClick={() => {
                    setDeleteForEveryOne(false);
                    setDeleteForMe(false);
                    setShowDeletePopupMenu(false);
                  }}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default MessagesContainer;
