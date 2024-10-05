import { PropsWithChildren, useContext, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import BaseURLContext from "../../contexts/BaseURLContext";
import { MessageType } from "../../enums/message";
import deleteForEveryOneIcon from "/icons/delete-for-every-one-icon.png";
import { TfiDownload } from "react-icons/tfi";
import { FaFileAlt } from "react-icons/fa";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import domains from "../../assets/domains";
type propsType = {
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
  setShowDeletePopupMenu: (a: boolean) => void;
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
  const [zoomImage, setZoomImage] = useState({ isZoom: false, src: "" });
  const [fileData, setFileData] = useState({
    isFile: false,
    filename: "",
    extension: "",
  });
  if (messagePopup) {
    setTimeout(() => {
      const messagePopupElement = document.getElementById(
        "message-popup-container"
      );
      if (messagePopupElement) {
        const rect = messagePopupElement.getBoundingClientRect();

        if (rect.bottom - window.innerHeight > 0) {
          messagePopupElement.style.top = "-19rem";
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
      {messagePopup && (
        <div
          className="absolute w-[75vw] h-screen top-0 z-[50]"
          onClick={() => setMessagePopup(false)}
        ></div>
      )}
      {zoomImage.isZoom && (
        <>
          <div
            className="fixed top-0 right-0 w-screen h-screen bg-transparent black z-[100]"
            onClick={() => setZoomImage({ isZoom: false, src: "" })}
          ></div>
          <div className="fixed top-[5.55vh] right-[0] w-[75%] h-[94.35%] bg-blue-gray-50 black z-[101]">
            <div className="h-full w-full flex items-center justify-center">
              <img
                className="absolute w-10 top-3 right-3"
                src={closeBtnIcon}
                onClick={() => setZoomImage({ isZoom: false, src: "" })}
              />
              <img className="shadow-2xl h-[60%]" src={zoomImage.src} />
            </div>
          </div>
        </>
      )}
      <div className="w-full relative">
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

        <div className="relative w-fit">
          {messagePopup && (
            <div
              id="message-popup-container"
              className="absolute top-[50%] left-[80%] py-2 bg-white z-[60] shadow-2xl"
            >
              <div className="hover:bg-black/5 px-3 py-2 w-40 cursor-pointer">
                Message info
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                Reply
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                React
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                Forward
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                Pin
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                Star
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer">
                Report
              </div>
              <div
                className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer"
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
          <div className="group relative z-[3]">
            {props.isSelectMessages && (
              <div className="ml-2 absolute top-[50%] translate-y-[-42%]">
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
              </div>
            )}
            <span
              className={`absolute bg-gradient-to-tr  z-10  ${
                messagePopup ? "visible" : "invisible"
              } ${
                props.messageType == MessageType.TEXT
                  ? "from-transparent  via-white to-white h-full w-[40%] top-[1px] left-[60%]"
                  : "from-transparent from-45%  via-white to-white h-[20%] w-[20%] top-0 right-0"
              } group-hover:visible  rounded-md transition-all ease-in-out cursor-pointer`}
              onClick={() => {
                setMessagePopup(messagePopup ? false : true);
              }}
            >
              <div className="flex justify-end pr-[5px]">
                <MdKeyboardArrowDown size={25} color="grey" />
              </div>
            </span>
            <div
              className={`${
                props.isSelectMessages ? "flex items-center gap-2" : ""
              }`}
            >
              <div
                id={
                  props.messageId +
                  "--" +
                  new Date(props.createdAt).toLocaleDateString()
                }
                className={`message-p flex items-center w-fit p-1 ${
                  props.isSelectMessages ? "ml-11" : "ml-3"
                }  rounded-md rounded-tl-none my-1 bg-white shadow-lg border-2 select-none ${
                  props.messageType === MessageType.TEXT ? "pr-[4.25rem]" : ""
                }`}
              >
                {props.deleteForEveryOne === 0 ? (
                  <>
                    {
                      props.messageType === MessageType.TEXT && (
                        <div>
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
                      )
                      // (domains.includes(
                      //   "." +
                      //     props.text.split(".")[
                      //       props.text.split(".").length - 1
                      //     ]
                      // ) ? (

                      // ) : (

                      // ))
                    }
                    {props.messageType === MessageType.IMAGE && props.image && (
                      <div className="flex flex-col gap-2">
                        <img
                          className="h-60"
                          src={`${BaseUrlContext.baseUrl}/${props.image.address}/${props.image.name}`}
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
                          className="h-60"
                          src={`${BaseUrlContext.baseUrl}/${props.video.address}/${props.video.name}`}
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
                      <div className={`flex flex-col gap-2`}>
                        <div className="flex gap-5 items-center bg-black/15 py-4 px-2 rounded-md">
                          <div className="flex items-center justify-center gap-1">
                            <FaFileAlt size={25} className="p-1" />
                            {fileData.filename}
                          </div>
                          <div className="cursor-pointer">
                            <a
                              href={`${BaseUrlContext.baseUrl}/${props.doc.address}/${props.doc.name}`}
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
                  <span className="text-gray-700 flex items-center gap-1">
                    <img className="size-4" src={deleteForEveryOneIcon} />
                    {props.text}
                  </span>
                )}
                <span
                  className={`absolute bottom-[0.4rem] right-[0.59rem] text-blue-gray-800 text-xs ml-1`}
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
