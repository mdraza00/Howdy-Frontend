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
interface getMessagesRes {
  status: boolean;
  data: {
    chatRoomId: string;
    createdAt: string;
    senderId: string;
    text: string;
    visibleTo: string[];
    updatedAt: string;
    _id: string;
  }[];
}
interface messagesData {
  chatRoomId: string;
  createdAt: string;
  senderId: string;
  visibleTo: string[];
  text: string;
  updatedAt: string;
  _id: string;
}
type propsType = {
  userId: string;
  recipientId: string;
  chatRoomId: string;
  updateChatRoomsData: boolean;
  setUpdateChatRoomsData: (a: boolean) => void;
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
  // const [messageDate, setMessageDate] = useState("");
  const [messages, setMessages] = useState<messagesData[]>([]);
  // const [messageInput, setMessageInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isChatRoomDeleted, setIsChatRoomDeleted] = useState(false);
  const [isSelectMessages, setIsSelectMessages] = useState(false);
  const [isChatRoomMessagesCleared, setIsChatRoomMessagesCleared] =
    useState(false);
  const [threeDotsPopupMenu, setThreeDotsPopupMenu] = useState(false);
  const [deleteSelectedMessages, setDeleteSelectedMessages] = useState(false);

  const [selectedMessagesData, setSelectedMessagesData] = useState<string[]>(
    []
  );
  const baseURL = useContext(BaseURLContext);

  const token = localStorage.getItem("token");

  if (messages.length > 0) {
    const lastMessage = document.getElementById(
      `${messages[messages.length - 1]._id}--${new Date(
        messages[messages.length - 1].createdAt
      ).toLocaleDateString()}`
    );
    if (lastMessage) lastMessage.scrollIntoView();
  }

  let date = new Date(13, 7, 2003);

  const messagesContainerDiv = document.getElementById(
    "messages-container-div"
  );

  function setSelectedMessagesDataFunc(messageId: string, isSelected: boolean) {
    console.log("message id = ", messageId, "is selected = ", isSelected);
    if (isSelected)
      setSelectedMessagesData((prevSelectedMessages) => {
        return [...prevSelectedMessages, messageId];
      });
    else
      setSelectedMessagesData((prevSelectedMessages) =>
        prevSelectedMessages.filter((el) => el !== messageId)
      );
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
    const url = `${baseURL.baseUrl}/message/get/${props.chatRoomId}`;
    axios
      .get<getMessagesRes>(url, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data.data);
      });

    socket.on("receieve message", (data) => {
      const newMessage: messagesData = {
        chatRoomId: data.roomId,
        createdAt: new Date(Date.now()).toString(),
        updatedAt: new Date(Date.now()).toString(),
        senderId: data.senderId,
        text: data.message,
        visibleTo: [props.userId, props.recipientId],
        _id: data.roomId + data.senderId + Date.now().toLocaleString(),
      };
      setMessages((msgsArray) => [...msgsArray, newMessage]);
    });

    socket.on("delete-messages", (data) => {
      setMessages((previousMessages) => {
        const idsOfMessageToBeDeleted = data.messages;
        return previousMessages.filter(
          (msg) => !idsOfMessageToBeDeleted.includes(msg._id)
        );
      });
    });

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
        .patch(
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
          console.log(res.data);
          // props.setUpdateChatRoomsData(
          //   props.updateChatRoomsData ? false : true
          // );
        })
        .catch((err) => {
          console.log("error in deleting user chatroom. Error = ", err);
        });
    }

    if (deleteSelectedMessages) {
      socket.emit("delete-messages", {
        roomId: props.chatRoomId,
        messages: selectedMessagesData,
      });
      axios
        .delete(
          `${
            baseURL.baseUrl
          }/message/delete/selected-messages/${selectedMessagesData.join(
            "--"
          )}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setIsSelectMessages(false);
          setDeleteSelectedMessages(false);
        })
        .catch((err) => {
          console.log("error in deleting selected messages ", err);
        });
    }

    return () => {
      socket.off("receieve message");
      socket.off("delete-messages");
    };
  }, [
    baseURL.baseUrl,
    deleteSelectedMessages,
    isChatRoomDeleted,
    isChatRoomMessagesCleared,
    props,
    props.chatRoomId,
    selectedMessagesData,
    token,
  ]);

  const storeMessagesInDB = (
    message: string,
    chatRoomId: string,
    senderId: string
  ) => {
    const url = `${baseURL.baseUrl}/message/save`;
    axios
      .post(
        url,
        {
          chatRoomId: chatRoomId,
          senderId: senderId,
          text: message,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(() => {});
  };
  // handling message input
  const sendMessageBtnHandler = function (e: React.BaseSyntheticEvent) {
    e.preventDefault();

    const messageInput = inputRef.current?.value;
    if (messageInput && messageInput.length > 0) {
      // if (messagesDiv) console.log(messagesDiv.scrollHeight);
      socket.emit("sent message", {
        roomId: props.chatRoomId,
        message: messageInput,
        lastMessageDate: Date.now(),
        senderId: props.userId,
      });
      const senderId = props.userId;
      if (senderId) storeMessagesInDB(messageInput, props.chatRoomId, senderId);
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
            } transition-all ease-in-out duration-200  z-10`}
          >
            <p
              id="scrolling-date"
              className={`mb-4 text-center text-xs px-3 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
            ></p>
          </div>
          {messages.length === 0 && (
            <div className="flex justify-center w-full">
              <p
                className={`mb-4 text-center text-xs px-3 py-1 mt-2 rounded-md bg-blue-gray-50 shadow-md`}
              >
                No Messags
              </p>
            </div>
          )}
          {messages?.map((message) => {
            const msg =
              message.senderId === props.userId ? (
                <SenderMessage
                  key={message._id}
                  time={message.createdAt}
                  createdAt={message.createdAt}
                  messageId={message._id}
                  isSelectMessages={isSelectMessages}
                  setSelectedMessagesData={setSelectedMessagesDataFunc}
                >
                  {message.text}
                </SenderMessage>
              ) : (
                <ReceiverMessage
                  key={message._id}
                  time={message.createdAt}
                  createdAt={message.createdAt}
                  messageId={message._id}
                  isSelectMessages={isSelectMessages}
                  setSelectedMessagesData={setSelectedMessagesDataFunc}
                >
                  {message.text}
                </ReceiverMessage>
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
            return message.visibleTo.includes(props.userId) ? (
              <div key={message._id}>
                {dateJSX}
                {msg}
              </div>
            ) : (
              ""
            );
          })}
        </div>
        {/* send-messages-container */}
        <div>
          {!isSelectMessages && (
            <form
              className={`h-[6.2vh] flex items-center bg-slate-200`}
              onSubmit={sendMessageBtnHandler}
            >
              <input
                id="message-input"
                type="text"
                className="w-full rounded-sm px-2 mx-2 focus:outline-none text-xl"
                placeholder="message"
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
          )}
          {isSelectMessages && (
            <div className="h-[6.3vh] flex items-center px-5 justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="p-1 flex items-center gap-3  hover:bg-black/10 active:bg-transparent transition-all ease-in-out"
                  onClick={() => setIsSelectMessages(false)}
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
                  onClick={() => {
                    console.log(
                      "apply start on message ",
                      selectedMessagesData
                    );
                  }}
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
                    setDeleteSelectedMessages(true);
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
                  onClick={() => {
                    console.log("forward", selectedMessagesData);
                  }}
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
                  onClick={() => {
                    console.log("download");
                  }}
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
    </>
  );
}
export default MessagesContainer;
