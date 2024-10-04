import { PropsWithChildren, useEffect, useState } from "react";
import { FaPlus, FaFileAlt } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { FaPollH } from "react-icons/fa";
import { PiStickerFill } from "react-icons/pi";
import { MessageType } from "../../enums/message";
import MultiMediaPreview from "../MultiMediaPreview/MultiMediaPreview";
type props = {
  sendMultiMedia: boolean;
  chatRoomId: string;
  senderId: string;
  setSendMultiMedia: (a: boolean) => void;
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
interface IMessageMultiMedia {
  isMessageMultiMedia: boolean;
  data: {
    url: string;
    filename: string;
    type: MessageType | undefined;
  } | null;
}

export default function SendFile(props: PropsWithChildren<props>) {
  const [multiMediaType, setMultiMediaType] = useState<MessageType>();
  const [takeInput, setTakeInput] = useState(false);
  const [messageMultiMedia, setMessageMultiMedia] =
    useState<IMessageMultiMedia>({ isMessageMultiMedia: false, data: null });
  const multimediaMessageInput = document.getElementById(
    "multimedia-message-input"
  );

  useEffect(() => {
    if (takeInput) {
      multimediaMessageInput?.click();
      setTakeInput(false);
    }
    return () => {
      if (multimediaMessageInput) multimediaMessageInput.nodeValue = "";
    };
  }, [multimediaMessageInput, takeInput]);
  return (
    <>
      {props.sendMultiMedia && (
        <div
          className="absolute w-[100vw] h-screen left-[-25vw] bottom-0 bg-transparent z-[71]"
          onClick={() => props.setSendMultiMedia(false)}
        ></div>
      )}

      <MultiMediaPreview
        setSendMessage={props.setSendMessage}
        messageMultiMedia={messageMultiMedia}
        setMessageMultiMedia={setMessageMultiMedia}
        senderId={props.senderId}
        chatRoomId={props.chatRoomId}
      />

      <input
        id="multimedia-message-input"
        className="hidden absolute top-[1000000px]"
        type="file"
        accept={`${
          multiMediaType == MessageType.IMAGE
            ? "image/*"
            : multiMediaType == MessageType.VIDEO
            ? "video/*"
            : ""
        }`}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const fileName = files[0].name;
            const reader = new FileReader();
            reader.onload = function () {
              if (reader.result) {
                console.log(reader.result);
                const multiMediaURL = reader.result.toString();
                setMessageMultiMedia({
                  isMessageMultiMedia: true,
                  data: {
                    url: multiMediaURL,
                    filename: fileName,
                    type: multiMediaType,
                  },
                });
                props.setSendMultiMedia(false);
              }
            };
            reader.readAsDataURL(files[0]);
          }
        }}
      />

      <div
        className={`transition-all ease-in-out duration-[390ms] fixed left-[25.45%] z-[71] ${
          props.sendMultiMedia ? `bottom-[3.2rem]` : "bottom-[-900px]"
        } bg-white shadow-xl py-2 px-3 rounded-xl `}
      >
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer"
          onClick={() => {
            setMultiMediaType(MessageType.DOC);
            setTakeInput(true);
          }}
        >
          <FaFileAlt size={19} color="purple" /> <span>Document</span>
        </div>
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer"
          onClick={() => {
            setMultiMediaType(MessageType.IMAGE);
            setTakeInput(true);
          }}
        >
          <IoMdPhotos size={19} color="blue" /> <span>Photos</span>
        </div>
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer"
          onClick={() => {
            setMultiMediaType(MessageType.VIDEO);
            setTakeInput(true);
          }}
        >
          <FaFileVideo size={19} color="red" /> <span>Videos</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaCamera size={19} color="orange" /> <span>Camera</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaPollH size={19} color="brown" /> <span>Poll</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <PiStickerFill size={19} color="purple" /> <span>New sticker</span>
        </div>
      </div>

      <div
        className={`absolute top-[50%] translate-y-[-50%] left-[0.65rem] w-11 h-fit z-[81]`}
      >
        <button
          className={`px-2 ${
            props.sendMultiMedia ? "bg-black/10" : ""
          } rounded-full border-none hover:bg-black/10`}
          onClick={() => {
            props.setSendMultiMedia(props.sendMultiMedia ? false : true);
          }}
        >
          <FaPlus
            id="send-file-icon"
            className={`transition-all ease-in-out duration-[370ms] ${
              props.sendMultiMedia ? "rotate-[225deg]" : "rotate-[0deg]"
            }`}
            size={22}
          />
        </button>
      </div>
    </>
  );
}
