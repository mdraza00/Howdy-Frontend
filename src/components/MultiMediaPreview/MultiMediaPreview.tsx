import { PropsWithChildren, useEffect, useState, useContext } from "react";
import { FcDocument } from "react-icons/fc";
import BaseURLContext from "../../contexts/BaseURLContext";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import sendMessageBtn from "../../assets/send-message-btn-icon.png";
import axios from "axios";
import { MessageType } from "../../enums/message";

type propsType = {
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

  setSendMessage: (object: {
    isSendMessage: boolean;
    data: {
      _id: string;
      roomId: string;
      messageType: MessageType;
      image: { name: string; address: string; caption: string } | null;
      video: { name: string; address: string; caption: string } | null;
      doc: { name: string; address: string; caption: string } | null;
      message: string;
      lastMessageDate: string;
      createdAt: string;
      updatedAt: string;
      senderId: string;
      visibleTo: string[];
      deletedFor: string[];
      deleteForEveryOne: number;
    } | null;
  }) => void;
};

interface ISaveMultimediaMessageRes {
  status: boolean;
  message: {
    chatRoomId: string;
    senderId: string;
    messageType: MessageType;
    text: string;
    image: {
      name: string;
      caption: string;
      address: string;
    } | null;
    video: {
      name: string;
      caption: string;
      address: string;
    } | null;
    doc: {
      name: string;
      caption: string;
      address: string;
    } | null;
    visibleTo: string[];
    deletedFor: string[];
    deleteForEveryOne: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

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
          axios
            .post<ISaveMultimediaMessageRes>(
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
              props.setSendMessage({
                isSendMessage: true,
                data: {
                  _id: res.data.message._id,
                  roomId: res.data.message.chatRoomId,
                  messageType: res.data.message.messageType,
                  image: res.data.message.image,
                  video: res.data.message.video,
                  doc: res.data.message.doc,
                  message: res.data.message.text,
                  lastMessageDate: res.data.message.createdAt,
                  createdAt: res.data.message.createdAt,
                  updatedAt: res.data.message.updatedAt,
                  senderId: res.data.message.senderId,
                  visibleTo: res.data.message.visibleTo,
                  deletedFor: res.data.message.deletedFor,
                  deleteForEveryOne: res.data.message.deleteForEveryOne,
                },
              });
              setMultimediaFromSubmitted(false);
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
          className={`fixed top-0 left-0 w-screen h-screen bg-transparent z-[85]`}
          onClick={() =>
            props.setMessageMultiMedia({
              isMessageMultiMedia: false,
              data: null,
            })
          }
        ></div>
      )}

      <div
        className={`fixed bg-blue-gray-50 transition-all ease-in-out duration-500 ${
          props.messageMultiMedia.isMessageMultiMedia
            ? "bottom-0"
            : "bottom-[-999px]"
        }    w-[75%] h-[86.2vh] z-[85]`}
      >
        <button
          className="absolute p-0 top-4 left-4"
          onClick={() => {
            props.setMessageMultiMedia({
              isMessageMultiMedia: false,
              data: null,
            });
          }}
        >
          <img className="w-10" src={closeBtnIcon} />
        </button>
        <form
          className="flex flex-col gap-12 items-center justify-center mt-24 w-full"
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
                className="h-[25rem] shadow-2xl"
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
                className="h-[25rem] shadow-2xl"
                controls={true}
              />
            )}
          {props.messageMultiMedia.data &&
            props.messageMultiMedia.data.type == MessageType.DOC && (
              <div className="h-[17rem] w-[32rem] shadow-2xl bg-blue-gray-200 rounded-md flex flex-col gap-4 items-center justify-center">
                <FcDocument size={80} />
                <p className="text-2xl text-center text-gray-700">
                  {props.messageMultiMedia.data.filename}
                </p>
              </div>
            )}
          <div className="flex items-center justify-center gap-7 w-full">
            <input
              type="text"
              className="text-lg px-2 py-[0.25rem] rounded-lg w-7/12 outline-none"
              placeholder="Add a caption"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
            />
            <button className="p-0" type="submit">
              <img className="w-[2.1rem]" src={sendMessageBtn} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
