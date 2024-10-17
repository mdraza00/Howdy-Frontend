import axios from "axios";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import BaseURLContext from "../../contexts/BaseURLContext";
import { MessageType } from "../../enums/message";
import deleteForEveryOneIcon from "/icons/delete-for-every-one-icon.png";
import { TfiDownload } from "react-icons/tfi";
import { FaFileAlt } from "react-icons/fa";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import domains from "../../assets/domains";
import {
  ImessageRes,
  IReplyMessage,
  IReplyToMessageData,
} from "../../Interface/Interface";
type propsType = {
  setReplyToMessage: (data: IReplyMessage) => void;
  senderId: string;
  chatRoomName: string;
  deleteForEveryOne: number;
  messageType: MessageType;
  text: string;
  image: { name: string; address: string; caption: string } | null;
  video: { name: string; address: string; caption: string } | null;
  doc: { name: string; address: string; caption: string } | null;
  time: string;
  createdAt: string;
  messageId: string;
  isSelectMessages: boolean;
  setIsSelectMessages: (data: boolean) => void;
  setShowDeletePopupMenu: (a: boolean) => void;
  replyTo: string | undefined;
  setSelectedMessagesData: (
    messageId: string,
    isSelected: boolean,
    createdAt: string
  ) => void;
};
function ReceiverMessage(props: PropsWithChildren<propsType>) {
  const browserSupportedExtentions = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "mp4",
    "gif",
    "txt",
    "svg",
  ];
  const BaseUrlContext = useContext(BaseURLContext);
  const [messagePopup, setMessagePopup] = useState(false);
  const [gotToMessage, setGoToMessage] = useState("");
  const [replyToMessageData, setReplyToMessageData] =
    useState<IReplyToMessageData>();
  const [forwardMessage, setForwardMessage] = useState(false);
  const [zoomImage, setZoomImage] = useState({ isZoom: false, src: "" });
  const [fileData, setFileData] = useState({
    isFile: false,
    filename: "",
    extension: "",
  });

  useEffect(() => {
    if (forwardMessage) {
      const selectMessageCheckBox = document.getElementById(props.messageId);
      selectMessageCheckBox?.click();
      setForwardMessage(false);
    }

    if (gotToMessage.length > 0) {
      const message = document.getElementById("--" + gotToMessage);
      if (message) message.scrollIntoView();
      if (message) {
        message.scrollIntoView({ block: "nearest" });
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            const div = document.getElementById(`#${gotToMessage}`);
            if (div) {
              div.style.backgroundColor = "rgba(0,0,0,0.1)";
              setTimeout(() => {
                div.style.backgroundColor = "rgba(0,0,0,0)";
              }, 1000);
            }
            setGoToMessage("");
          }
        });
        observer.observe(message);
      }
      setGoToMessage("");
    }

    if (props.replyTo) {
      const token = localStorage.getItem("token");
      axios
        .get<ImessageRes>(
          `${BaseUrlContext.baseUrl}/message/get-message/${props.replyTo}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.data.message)
            setReplyToMessageData({
              isReplyTo: true,
              data: {
                repliedTo:
                  res.data.message.senderId === props.senderId
                    ? "you"
                    : props.chatRoomName,
                messageType: res.data.message.messageType,
                text: res.data.message.text,
                image: res.data.message.image,
                video: res.data.message.video,
                doc: !!res.data.message.doc,
              },
            });
        })
        .catch(() => {
          console.log("error in finding the response message");
        });
    }
  }, [
    BaseUrlContext.baseUrl,
    forwardMessage,
    gotToMessage,
    props.chatRoomName,
    props.messageId,
    props.replyTo,
    props.senderId,
  ]);

  if (messagePopup) {
    setTimeout(() => {
      const messagePopupElement = document.getElementById(
        "message-popup-container"
      );
      if (messagePopupElement) {
        const rect = messagePopupElement.getBoundingClientRect();

        if (rect.bottom - window.innerHeight > 0) {
          messagePopupElement.style.top = "-15rem";
        }
      }
    }, 0);
  }

  if (props.doc && !fileData.isFile) {
    const filename =
      props.doc.name.split("__")[props.doc.name.split("__").length - 1];
    const extension =
      props.doc.name.split(".")[props.doc.name.split(".").length - 1];
    setFileData({ filename, extension: extension, isFile: true });
  }

  return (
    <>
      {/* {messagePopup && (
        <div
          className="absolute w-[75vw] h-screen top-0 z-[50]"
          onClick={() => setMessagePopup(false)}
        ></div>
      )} */}
      {zoomImage.isZoom && (
        <>
          <div className="fixed top-[8.4vh] left-[0] w-full h-[91.6vh] bg-blue-gray-50 black">
            <div className="h-full w-full flex items-center justify-center">
              <img
                className="absolute w-10 top-3 right-3"
                src={closeBtnIcon}
                onClick={() => setZoomImage({ isZoom: false, src: "" })}
              />
              <img className="shadow-2xl w-[90%]" src={zoomImage.src} />
            </div>
          </div>
        </>
      )}
      <div
        className="transition-all ease-in-out w-full relative text-[0.85rem]"
        id={`#${props.messageId}`}
      >
        {props.isSelectMessages && (
          <div
            className="absolute w-full h-full hover:bg-black/10"
            onClick={() => {
              if (props.isSelectMessages) {
                const checkbox = document.getElementById(props.messageId);
                if (checkbox) checkbox.click();
              }
            }}
          ></div>
        )}

        <div
          className="message-div-container relative w-full"
          id={`date--${new Date(props.createdAt).toLocaleDateString()}`}
        >
          <div
            className={`group p-1 bg-white ${
              props.isSelectMessages ? "ml-11" : "ml-3"
            } rounded-md rounded-tl-none shadow-lg my-2 relative z-[3] w-fit max-w-[65%] border-2`}
          >
            {messagePopup && (
              <div
                className="bg-transparent fixed top-0 left-0 h-full w-full"
                onClick={() => setMessagePopup(false)}
              ></div>
            )}
            {messagePopup && (
              <div
                id="message-popup-container"
                className="absolute top-3 right-0 py-1 bg-white h-fit w-36 shadow-2xl"
              >
                <div className="hover:bg-black/5 px-2 py-1  h-fit cursor-pointer">
                  Message info
                </div>
                <div
                  className="hover:bg-black/5 px-2 py-1  h-fit transition-all ease-in-out cursor-pointer"
                  onClick={() => {
                    setMessagePopup(false);
                    props.setReplyToMessage({
                      isReply: true,
                      data: {
                        senderName: props.chatRoomName,
                        text: props.text,
                        image: props.image
                          ? {
                              name: props.image.name,
                              address: props.image.address,
                            }
                          : null,
                        video: props.video
                          ? {
                              name: props.video.name,
                              address: props.video.address,
                            }
                          : null,
                        doc:
                          props.messageType === MessageType.DOC ? true : false,
                        messageId: props.messageId,
                        messageType: props.messageType,
                      },
                    });
                  }}
                >
                  Reply
                </div>
                <div className="hover:bg-black/5 px-2 py-1  h-fit transition-all ease-in-out cursor-pointer">
                  React
                </div>
                <div
                  className="hover:bg-black/5 px-2 py-1  h-fit transition-all ease-in-out cursor-pointer"
                  onClick={() => {
                    props.setIsSelectMessages(true);
                    setForwardMessage(true);
                    setMessagePopup(false);
                  }}
                >
                  Forward
                </div>
                <div className="hover:bg-black/5 px-2 py-1  h-fit transition-all ease-in-out cursor-pointer">
                  Pin
                </div>
                <div className="hover:bg-black/5 px-2 py-1  h-fit transition-all ease-in-out cursor-pointer">
                  Star
                </div>
                <div className="hover:bg-black/5 px-2 py-1 h-fit transition-all ease-in-out cursor-pointer">
                  Report
                </div>
                <div
                  className="hover:bg-black/5 px-2 py-1 transition-all ease-in-out cursor-pointer"
                  onClick={() => {
                    props.setSelectedMessagesData(
                      `${props.messageId}--receive`,
                      true,
                      props.createdAt
                    );
                    props.setShowDeletePopupMenu(true);
                  }}
                >
                  Delete
                </div>
              </div>
            )}

            {props.isSelectMessages && (
              <div className="absolute top-[50%] translate-y-[-42%] left-[-2.18rem]">
                {props.deleteForEveryOne === 0 && (
                  <input
                    className="w-5 h-5 cursor-pointer"
                    id={props.messageId}
                    type="checkbox"
                    onChange={(e) => {
                      props.setSelectedMessagesData(
                        `${props.messageId}--receive`,
                        e.target.checked,
                        props.createdAt
                      );
                    }}
                  />
                )}
              </div>
            )}
            <span
              className={`absolute ${
                props.messageType === MessageType.TEXT ||
                props.messageType === MessageType.DOC
                  ? "top-[-5px]"
                  : "top-[0px]"
              } right-[0] z-10`}
              onClick={() => {
                setMessagePopup(messagePopup ? false : true);
              }}
            >
              <MdKeyboardArrowDown size={25} color="grey" />
            </span>
            <div
              className={`${
                props.isSelectMessages
                  ? "flex flex-col items-stretch gap-2"
                  : ""
              } w-fit`}
            >
              {props.deleteForEveryOne === 0 && props.replyTo && (
                <div
                  onClick={() => {
                    if (props.replyTo) setGoToMessage(props.replyTo);
                  }}
                  className={`cursor-pointer flex justify-between rounded-md items-center pl-2 mb-1 bg-black/5 ${
                    replyToMessageData?.data?.messageType ===
                      MessageType.TEXT ||
                    replyToMessageData?.data?.messageType === MessageType.DOC
                      ? "h-[3.0rem]"
                      : "h-[4rem]"
                  } mt-[0.65rem] w-full`}
                >
                  <div className="h-fit w-[60%]">
                    <p className="max-w-[100%] truncate">
                      {replyToMessageData?.data?.repliedTo}
                    </p>
                    <p className="text-gray-800 flex gap-1 items-center max-w-[8rem] truncate">
                      {replyToMessageData?.data?.doc && <FaFileAlt />}{" "}
                      {replyToMessageData?.data?.text}
                    </p>
                  </div>
                  {replyToMessageData?.data?.image && (
                    <img
                      className="h-14"
                      src={`${BaseUrlContext.baseUrl}/${replyToMessageData?.data?.image.address}/${replyToMessageData?.data?.image.name}`}
                    />
                  )}
                  {replyToMessageData?.data?.video && (
                    <video
                      className="h-14"
                      src={`${BaseUrlContext.baseUrl}/${replyToMessageData?.data?.video.address}/${replyToMessageData?.data?.video.name}`}
                    />
                  )}
                </div>
              )}
              <div
                className={`scroll-mt-[14rem] flex items-end justify-between ${
                  props.messageId
                } ${
                  props.messageType === MessageType.TEXT ? "pr-[3.3rem]" : ""
                } `}
                id={"--" + props.messageId}
              >
                {props.deleteForEveryOne === 0 ? (
                  <>
                    {props.messageType === MessageType.TEXT && (
                      <div className="">
                        {props.text.split(" ").map((word) => {
                          return domains
                            .map(
                              (domain) =>
                                word.endsWith(domain) && word.length > 4
                            )
                            .filter((bool) => bool)[0] ? (
                            <a
                              className="text-blue-800 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`${
                                word.startsWith("http") ||
                                word.startsWith("https")
                                  ? word
                                  : "https://" + word
                              }`}
                            >
                              {" " + word + " "}
                            </a>
                          ) : (
                            <span>{" " + word + " "}</span>
                          );
                        })}
                      </div>
                    )}
                    {props.messageType === MessageType.IMAGE && props.image && (
                      <div className="flex flex-col gap-2">
                        <img
                          className="w-full sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem] xl:max-w-[25rem]"
                          src={`${BaseUrlContext.imageUrl}/${props.image.address}/${props.image.name}`}
                          onClick={() => {
                            if (props.image)
                              setZoomImage({
                                isZoom: true,
                                src: `${BaseUrlContext.baseUrl}/${props.image.address}/${props.image.name}`,
                              });
                          }}
                        />
                        <p
                          className={`${
                            props.image.caption.length <= 0 && "h-3"
                          }`}
                        >
                          {props.image.caption}
                        </p>
                      </div>
                    )}
                    {props.messageType === MessageType.VIDEO && props.video && (
                      <div className="flex flex-col gap-2">
                        <video
                          className="w-full sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem] xl:max-w-[25rem]"
                          src={`${BaseUrlContext.imageUrl}/${props.video.address}/${props.video.name}`}
                          controls={true}
                        />
                        <p
                          className={`${
                            props.video.caption.length <= 0 && "h-3"
                          }`}
                        >
                          {props.video.caption}
                        </p>
                      </div>
                    )}
                    {props.messageType === MessageType.DOC && props.doc && (
                      <div className={`flex flex-col gap-2 mt-[0.65rem]`}>
                        <div className="flex gap-1 items-center bg-black/15 py-2 pl-1 pr-2 rounded-md">
                          <div className="flex items-center justify-center ">
                            <FaFileAlt size={25} className="p-1" />
                            <span className="max-w-[8.5rem] truncate">
                              {fileData.filename}
                            </span>
                          </div>
                          <div className="cursor-pointer">
                            <a
                              href={`${BaseUrlContext.imageUrl}/${props.doc.address}/${props.doc.name}`}
                              download={true}
                            >
                              {browserSupportedExtentions.includes(
                                fileData.extension
                              ) ? (
                                <div className="px-3 py-1 text-sm border border-black text-black bg-transparent rounded-md cursor-pointer">
                                  View
                                </div>
                              ) : (
                                <TfiDownload
                                  color="black"
                                  size={28}
                                  className="border-[1.5px] border-black p-1 rounded-full"
                                />
                              )}
                            </a>
                          </div>
                        </div>
                        <p className={`${!props.doc.caption && "h-2"}`}>
                          {props.doc.caption}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-gray-700 flex items-center gap-[3px] w-[16rem] text-[0.8rem]">
                    <img className="size-3" src={deleteForEveryOneIcon} />
                    {props.text}
                  </span>
                )}
                <span
                  className={`absolute ${
                    props.messageType !== MessageType.TEXT &&
                    "absolute right-[6px] "
                  } text-blue-gray-800 text-[0.6rem] right-[0.50rem] bottom-[0.2rem]`}
                >
                  {`${new Date(props.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ReceiverMessage;
