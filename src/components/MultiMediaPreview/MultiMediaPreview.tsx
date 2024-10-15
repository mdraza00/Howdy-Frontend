import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { FcDocument } from "react-icons/fc";
import BaseURLContext from "../../contexts/BaseURLContext";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import axios from "axios";
import { MessageType } from "../../enums/message";
import { ImessageRes, IReplyMessage } from "../../Interface/Interface";
import { BsSendFill } from "react-icons/bs";

type propsType = {
  setReplyToMessage: (data: IReplyMessage) => void;
  replyToMessage: IReplyMessage;
  setCloseModel: (a: boolean) => void;
  setMultiMediaType: (a: MessageType | undefined) => void;
  setSendMultiMedia: (a: boolean) => void;
  chatRoomId: string;
  senderId: string;
  messageMultiMedia: {
    isMessageMultiMedia: boolean;
    data: {
      url: string;
      filename: string;
      type: MessageType | undefined;
    } | null;
  };
  setMessageMultiMedia: (obj: {
    isMessageMultiMedia: boolean;
    data: {
      url: string;
      filename: string;
      type: MessageType | undefined;
    } | null;
  }) => void;

  setSendMessage: (message: ImessageRes) => void;
};

export default function SendImage(props: PropsWithChildren<propsType>) {
  const token = localStorage.getItem("token");
  const [caption, setCaption] = useState("");
  const [multimediaFormSubmitted, setMultimediaFromSubmitted] = useState(false);
  const baseUrl = useContext(BaseURLContext);

  useEffect(() => {
    if (multimediaFormSubmitted) {
      (async () => {
        if (props.messageMultiMedia.data && props.messageMultiMedia.data.type) {
          const response = await fetch(props.messageMultiMedia.data.url);
          const blob = await response.blob();
          const fileName =
            props.chatRoomId +
            "__" +
            props.senderId +
            "__" +
            props.messageMultiMedia.data.filename;
          const multiMediaFile = new File([blob], fileName, {
            type: blob.type,
          });
          const formData = new FormData();
          formData.append("multimedia", multiMediaFile);
          formData.append("chatRoomId", props.chatRoomId);
          formData.append("senderId", props.senderId);
          formData.append("caption", caption);
          formData.append("messageType", props.messageMultiMedia.data.type);
          formData.append(
            "replyTo",
            props.replyToMessage.data ? props.replyToMessage.data.messageId : ""
          );
          axios
            .post<ImessageRes>(
              `${baseUrl.baseUrl}/message/save/multimedia`,
              formData,
              {
                headers: {
                  "Content-type": "multipart/form-data",
                  authorization: "Bearer " + token,
                },
              }
            )
            .then((res) => {
              props.setMessageMultiMedia({
                isMessageMultiMedia: false,
                data: null,
              });
              if (res.data.message)
                props.setSendMessage({
                  status: true,
                  message: {
                    _id: res.data.message._id,
                    chatRoomId: res.data.message.chatRoomId,
                    messageType: res.data.message.messageType,
                    image: res.data.message.image,
                    video: res.data.message.video,
                    doc: res.data.message.doc,
                    text: res.data.message.text,
                    createdAt: res.data.message.createdAt,
                    updatedAt: res.data.message.updatedAt,
                    senderId: res.data.message.senderId,
                    visibleTo: res.data.message.visibleTo,
                    deletedFor: res.data.message.deletedFor,
                    deleteForEveryOne: res.data.message.deleteForEveryOne,
                    replyTo: res.data.message.replyTo,
                  },
                });
              props.setReplyToMessage({ isReply: false, data: null });
              setMultimediaFromSubmitted(false);
              props.setCloseModel(true);
              setCaption("");
            })
            .catch((err) => {
              console.log("error in saving image as message. error => ", err);
            });
        }
      })();
    }
  }, [
    baseUrl.baseUrl,
    caption,
    multimediaFormSubmitted,
    props,
    props.chatRoomId,
    props.messageMultiMedia.data,
    props.senderId,
    token,
  ]);
  return (
    <>
      {props.messageMultiMedia.isMessageMultiMedia && (
        <div
          className={`fixed hidden top-0 left-0 w-screen h-screen bg-transparent`}
          onClick={() => {
            props.setCloseModel(true);
          }}
        ></div>
      )}

      <div
        className={`fixed left-0 w-full h-[91.8%] flex items-center justify-center bg-blue-gray-50 transition-all ease-in-out duration-500 ${
          props.messageMultiMedia.isMessageMultiMedia
            ? "top-[8.2vh]"
            : "top-[150vh]"
        }    w-[75%] h-[86.2vh] z-[85]`}
      >
        <button
          className="absolute p-0 top-4 left-4"
          onClick={() => {
            props.setCloseModel(true);
          }}
        >
          <img className="w-7" src={closeBtnIcon} />
        </button>
        <form
          className=" flex flex-col items-center justify-center gap-[4rem] w-full"
          onSubmit={(e) => {
            e.preventDefault();
            setMultimediaFromSubmitted(true);
          }}
        >
          {props.messageMultiMedia.data &&
            props.messageMultiMedia.data.type == MessageType.IMAGE && (
              <img
                src={
                  props.messageMultiMedia.data
                    ? props.messageMultiMedia.data.url
                    : ""
                }
                className="w-[80%] shadow-2xl"
              />
            )}
          {props.messageMultiMedia.data &&
            props.messageMultiMedia.data.type == MessageType.VIDEO && (
              <video
                src={
                  props.messageMultiMedia.data
                    ? props.messageMultiMedia.data.url
                    : ""
                }
                className="w-[80%] shadow-2xl"
                controls={true}
              />
            )}
          {props.messageMultiMedia.data &&
            props.messageMultiMedia.data.type == MessageType.DOC && (
              <div className=" w-[70%] h-fit shadow-2xl bg-blue-gray-200 rounded-md flex flex-col gap-2 py-4 items-center justify-center">
                <FcDocument className="size-[3rem]" />
                <p className="text-lg max-w-[90%] truncate text-center text-gray-700">
                  {props.messageMultiMedia.data.filename}
                </p>
              </div>
            )}
          <div className="absolute bottom-3 flex items-center justify-evenly w-full h-fit bg-blue-gray-50">
            <input
              type="text"
              className=" text-[0.9rem] px-2 py-[0.4rem] rounded-lg w-[80%] outline-none"
              placeholder="Add a caption"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
            />
            <button className="p-2 bg-blue-600" type="submit">
              <BsSendFill className="size-[1rem]" color="white" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
