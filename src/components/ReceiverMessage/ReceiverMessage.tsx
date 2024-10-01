import { PropsWithChildren, useState } from "react";
import downArrowHead from "/icons/down-arrow-head.png";
type propsType = {
  time: string;
  createdAt: string;
  messageId: string;
  isSelectMessages: boolean;
  setSelectedMessagesData: (
    messageId: string,
    isSelected: boolean,
    createdAt: string
  ) => void;
};
function ReceiverMessage(props: PropsWithChildren<propsType>) {
  const [messagePopup, setMessagePopup] = useState(false);
  if (messagePopup) {
    setTimeout(() => {
      const messagePopupElement = document.getElementById(
        "message-popup-container"
      );
      if (messagePopupElement) {
        const rect = messagePopupElement.getBoundingClientRect();

        if (rect.bottom - window.innerHeight > 0) {
          messagePopupElement.style.top = "-850%";
          // messagePopupElement.scrollIntoView();
        }
      }
    }, 0);
  }

  return (
    <>
      {messagePopup && (
        <div
          className="absolute w-[75vw] h-screen top-0 z-[50]"
          onClick={() => setMessagePopup(false)}
        ></div>
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
              <div className="hover:bg-black/5 px-3 py-2 w-40">
                Message info
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
                Reply
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
                React
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
                Forward
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
                Pin
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
                Star
              </div>
              <div className="hover:bg-black/5 px-3 py-2 w-40 transition-all ease-in-out">
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
              className={`absolute right-1 top-[0.5%] invisible group-hover:visible hover:bg-black/10 rounded-sm active:bg-white transition-all ease-in-out`}
              onClick={() => {
                setMessagePopup(messagePopup ? false : true);
              }}
            >
              <img className="w-5" src={downArrowHead} />
            </span>
            <div
              className={`${
                props.isSelectMessages ? "flex items-center gap-2" : ""
              }`}
            >
              <p
                id={
                  props.messageId +
                  "--" +
                  new Date(props.createdAt).toLocaleDateString()
                }
                className={`message-p flex items-center w-fit p-1 ${
                  props.isSelectMessages ? "ml-11" : "ml-3"
                }  rounded-md rounded-tl-none my-1 bg-white shadow-lg border-2 select-none`}
              >
                {props.children}
                <span className="text-slate-500 text-sm ml-1">
                  <sub>
                    {" "}
                    {`${new Date(props.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </sub>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ReceiverMessage;
