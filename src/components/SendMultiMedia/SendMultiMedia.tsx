import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { FaFileAlt } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { FaPollH } from "react-icons/fa";
import { PiStickerFill } from "react-icons/pi";
import { MessageType } from "../../enums/message";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import MultiMediaPreview from "../MultiMediaPreview/MultiMediaPreview";
import {
  ImessageRes,
  IMessageMultiMedia,
  IReplyMessage,
} from "../../Interface/Interface";

type props = {
  sendMultiMedia: boolean;
  setReplyToMessage: (data: IReplyMessage) => void;
  replyToMessage: IReplyMessage;
  chatRoomUserProfile: boolean;
  chatRoomId: string;
  senderId: string;
  setSendMultiMedia: (a: boolean) => void;
  setSendMessage: (message: ImessageRes) => void;
};

export default function SendFile(props: PropsWithChildren<props>) {
  const videoStream = useRef<MediaStream>();
  const [closeModel, setCloseModel] = useState(false);
  const [multiMediaType, setMultiMediaType] = useState<MessageType>();
  const [cameraInput, setCameraInput] = useState(false);
  const [takeInput, setTakeInput] = useState(false);
  const [messageMultiMedia, setMessageMultiMedia] =
    useState<IMessageMultiMedia>({ isMessageMultiMedia: false, data: null });
  const multimediaMessageInputRef = useRef<HTMLInputElement>(null);

  const cameraVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (closeModel && multimediaMessageInputRef.current) {
      setMessageMultiMedia({ isMessageMultiMedia: false, data: null });
      setMultiMediaType(undefined);
      setCloseModel(false);
      multimediaMessageInputRef.current.value = "";
    }
    if (takeInput) {
      multimediaMessageInputRef.current?.click();
      setTakeInput(false);
    }
    if (cameraInput) {
      (async () => {
        console.log(navigator);
        await navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
            },
          })
          .then((stream) => {
            console.log("hello");
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
  }, [multimediaMessageInputRef, takeInput, cameraInput, closeModel]);
  return (
    <>
      {props.sendMultiMedia && (
        <div
          className="fixed w-full h-full top-0 left-0 bg-transparent bottom-0"
          onClick={() => {
            props.setSendMultiMedia(false);
          }}
        ></div>
      )}

      {cameraInput && (
        <div
          className="fixed hidden top-0 left-0 w-screen h-screen bg-transparent z-[100]"
          onClick={() => {
            setCameraInput(false);
            if (cameraVideo.current) cameraVideo.current.nodeValue = "";
            setMultiMediaType(undefined);
            setMessageMultiMedia({ isMessageMultiMedia: false, data: null });
          }}
        ></div>
      )}
      <div
        className={`fixed right-0 border-2 border-black flex flex-col items-center justify-center gap-24 transition-all ease-in-out duration-500 ${
          cameraInput
            ? `top-[8.2vh] sm:top-[14.7vh] sm:w-[58vw] md:w-[63vw] ${
                props.chatRoomUserProfile
                  ? "lg:w-[33vw] lg:right-[33vw] xl:w-[37vw] 2xl:w-[39vw]"
                  : "lg:w-[66vw] xl:w-[70vw] 2xl:w-[72vw]"
              }`
            : "top-[150vh]"
        } w-full h-[90%] sm:h-[85.35%] bg-blue-gray-50 z-[1]`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => {
            setCameraInput(false);
            if (cameraVideo.current) cameraVideo.current.nodeValue = "";
            setMultiMediaType(undefined);
            setMessageMultiMedia({ isMessageMultiMedia: false, data: null });
          }}
        >
          <img className="w-10" src={closeBtnIcon} />
        </button>
        <video
          id="user-camera-video-stream"
          className=" w-[80%] border-2 border-black"
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
        setReplyToMessage={props.setReplyToMessage}
        replyToMessage={props.replyToMessage}
        setCloseModel={setCloseModel}
        setSendMultiMedia={props.setSendMultiMedia}
        setMultiMediaType={setMultiMediaType}
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
        ref={multimediaMessageInputRef}
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
        className={` ml-1 transition-all ease-in-out duration-[390ms] fixed left-[0] ${
          props.sendMultiMedia
            ? props.replyToMessage.isReply
              ? "bottom-[18vh]"
              : `bottom-[8.40vh]`
            : "bottom-[-33vh]"
        } bg-white shadow-xl py-2 px-3 rounded-xl h-fit sm:left-[42vw] md:left-[37vw] lg:left-[34vw] xl:left-[30vw] 2xl:left-[28vw]`}
      >
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit"
          onClick={() => {
            setTakeInput(true);
            setMultiMediaType(MessageType.DOC);
            props.setSendMultiMedia(false);
          }}
        >
          <FaFileAlt size={19} color="purple" /> <span>Document</span>
        </div>
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit"
          onClick={() => {
            setTakeInput(true);
            setMultiMediaType(MessageType.IMAGE);
            props.setSendMultiMedia(false);
          }}
        >
          <IoMdPhotos size={19} color="blue" /> <span>Photos</span>
        </div>
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit"
          onClick={() => {
            setTakeInput(true);
            setMultiMediaType(MessageType.VIDEO);
            props.setSendMultiMedia(false);
          }}
        >
          <FaFileVideo size={19} color="red" /> <span>Videos</span>
        </div>
        <div
          className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit"
          onClick={() => {
            setCameraInput(true);
            setMultiMediaType(MessageType.IMAGE);
            props.setSendMultiMedia(false);
          }}
        >
          <FaCamera size={19} color="orange" /> <span>Camera</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit">
          <FaPollH
            size={19}
            color="brown"
            onClick={() => {
              props.setSendMultiMedia(false);
            }}
          />{" "}
          <span>Poll</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 active:bg-white transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer h-fit">
          <PiStickerFill
            size={19}
            color="purple"
            onClick={() => {
              props.setSendMultiMedia(false);
            }}
          />{" "}
          <span>New sticker</span>
        </div>
      </div>
    </>
  );
}
