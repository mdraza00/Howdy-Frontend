import { PropsWithChildren, useEffect, useState, useRef } from "react";
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
  const videoStream = useRef<MediaStream>();
  const [multiMediaType, setMultiMediaType] = useState<MessageType>();
  const [cameraInput, setCameraInput] = useState(false);
  const [takeInput, setTakeInput] = useState(false);
  const [messageMultiMedia, setMessageMultiMedia] =
    useState<IMessageMultiMedia>({ isMessageMultiMedia: false, data: null });
  const multimediaMessageInput = document.getElementById(
    "multimedia-message-input"
  );

  const cameraVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (takeInput) {
      multimediaMessageInput?.click();
      setTakeInput(false);
    }
    if (cameraInput) {
      (async () => {
        await navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
            },
          })
          .then((stream) => {
            if (cameraVideo.current) {
              videoStream.current = stream;
              cameraVideo.current.srcObject = videoStream.current;
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })();
    }
    if (!cameraInput) {
      if (videoStream.current)
        videoStream.current.getTracks().forEach((stream) => stream.stop());
    }
    return () => {
      if (multimediaMessageInput) multimediaMessageInput.nodeValue = "";
    };
  }, [multimediaMessageInput, takeInput, cameraInput]);
  return (
    <>
      {props.sendMultiMedia && (
        <div
          className="absolute w-[100vw] h-screen left-[-25vw] bottom-0 bg-transparent z-[71]"
          onClick={() => props.setSendMultiMedia(false)}
        ></div>
      )}

      {cameraInput && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-transparent z-[100]"
          onClick={() => {
            setCameraInput(false);
            if (cameraVideo.current) cameraVideo.current.nodeValue = "";
            setMultiMediaType(undefined);
            setMessageMultiMedia({ isMessageMultiMedia: false, data: null });
          }}
        ></div>
      )}
      <div
        className={`fixed flex items-center justify-center gap-5 transition-all ease-in-out duration-500 ${
          cameraInput ? "bottom-0" : "bottom-[-999px]"
        }  right-0 w-[75%] h-[45.783rem] bg-blue-gray-50 z-[101]`}
      >
        <video
          id="user-camera-video-stream"
          className=" w-[55%]"
          autoPlay
          ref={cameraVideo}
        ></video>
        <button
          className="p-2 rounded-full bg-transparent hover:bg-black/15"
          onClick={() => {
            if (videoStream.current && cameraVideo.current) {
              const stream = videoStream.current.getVideoTracks()[0];
              const canvas = document.createElement("canvas");
              const { width, height } = stream.getSettings();
              canvas.width = width || 250;
              canvas.height = height || 250;

              canvas.getContext("2d")?.drawImage(cameraVideo.current, 0, 0);
              const image = canvas.toDataURL("image/png");
              setMessageMultiMedia({
                isMessageMultiMedia: true,
                data: {
                  url: image,
                  filename: "camera-photo.png",
                  type: multiMediaType,
                },
              });
              videoStream.current.getTracks().forEach((stream) => stream.stop);
              setCameraInput(false);
            }
          }}
        >
          <FaCamera size={40} />
        </button>
      </div>

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
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer"
          onClick={() => {
            setMultiMediaType(MessageType.IMAGE);
            setCameraInput(true);
          }}
        >
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
