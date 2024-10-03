import { PropsWithChildren, useContext, useState } from "react";
import BaseURLContext from "../../contexts/BaseURLContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import deleteForEveryOneIcon from "/icons/delete-for-every-one-icon.png";
import { MessageType } from "../../enums/message";
type propsType = {
  deleteForEveryOne: number;
  messageType: MessageType;
  text: string;
  image: { name: string; address: string; caption: string } | null;
  video: { name: string; address: string; caption: string } | null;
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

function SenderMessage(props: PropsWithChildren<propsType>) {
  const BaseUrlContext = useContext(BaseURLContext);
  const [messagePopup, setMessagePopup] = useState(false);
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
  return (
    <>
      {messagePopup && (
        <div
          className="absolute w-[75vw] h-screen top-0 bg-transparent z-[60]"
          onClick={() => setMessagePopup(false)}
        ></div>
      )}
      <div className="relative">
        {props.isSelectMessages && (
          <>
            <div
              className="absolute w-full h-full hover:bg-black/10"
              onClick={() => {
                if (props.isSelectMessages) {
                  const checkbox = document.getElementById(props.messageId);
                  if (checkbox) checkbox.click();
                }
              }}
            ></div>
            <div className="ml-2 absolute top-[50%] translate-y-[-42%]">
              <input
                className="w-5 h-5 cursor-pointer relative"
                id={props.messageId}
                type="checkbox"
                onChange={(e) => {
                  props.setSelectedMessagesData(
                    `${props.messageId}--send`,
                    e.target.checked,
                    props.createdAt
                  );
                }}
              />
            </div>
          </>
        )}
        <div
          className={`flex justify-end ${
            props.isSelectMessages ? "hover:bg-black/10" : ""
          }`}
        >
          <div className="group relative w-fit">
            {messagePopup && (
              <div
                id="message-popup-container"
                className="absolute bg-white shadow-2xl z-[60] right-5 top-5 py-2"
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
                <div
                  className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out cursor-pointer active:bg-white"
                  onClick={() => {
                    console.log("delete");
                    props.setSelectedMessagesData(
                      `${props.messageId}--send`,
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
            {/* 
            {props.isSelectMessages && (
              
            )} */}
            <span
              className={`absolute w-[40%] z-10 right-3 h-[80%] top-1 ${
                messagePopup ? "visible" : "invisible"
              } bg-gradient-to-tr from-transparent via-blue-200 to-blue-200 group-hover:visible rounded-sm cursor-pointer`}
              onClick={() => setMessagePopup(messagePopup ? false : true)}
            >
              <div className="flex justify-end">
                <MdKeyboardArrowDown size={25} color="grey" />
              </div>
            </span>
            <div>
              <div
                id={
                  props.messageId +
                  "--" +
                  new Date(props.createdAt).toLocaleDateString()
                }
                className={`message-p relative flex items-center p-2 mr-3 rounded-md rounded-tr-none my-1 bg-blue-200 shadow-lg select-none ${
                  props.messageType === MessageType.TEXT
                    ? "pr-[4.25rem]"
                    : "pb-7"
                }`}
              >
                {props.deleteForEveryOne === 0 ? (
                  <>
                    {props.messageType === MessageType.TEXT && (
                      <span>{props.text}</span>
                    )}
                    {props.messageType === MessageType.IMAGE && props.image && (
                      <div>
                        <img
                          className="h-60"
                          src={`${BaseUrlContext.baseUrl}/${props.image.address}/${props.image.name}`}
                        />
                        <p>{props.image.caption}</p>
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
export default SenderMessage;
