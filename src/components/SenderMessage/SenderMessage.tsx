import { PropsWithChildren } from "react";
type propsType = {
  time: string;
  createdAt: string;
  messageId: string;
  isSelectMessages: boolean;
  setSelectedMessagesData: (messageId: string, isSelected: boolean) => void;
};

function SenderMessage(props: PropsWithChildren<propsType>) {
  return (
    <div className="relative">
      {props.isSelectMessages && (
        <div className="ml-2 absolute top-[50%] translate-y-[-42%]">
          <input
            className="w-5 h-5 cursor-pointer"
            id={props.messageId}
            type="checkbox"
            onChange={(e) => {
              props.setSelectedMessagesData(
                `${props.messageId}--send`,
                e.target.checked
              );
            }}
          />
        </div>
      )}
      <div
        className={`w-full flex justify-end hover:bg-black/10`}
        onClick={() => {
          if (props.isSelectMessages) {
            const checkbox = document.getElementById(props.messageId);
            if (checkbox) checkbox.click();
          }
        }}
      >
        <p
          id={
            props.messageId +
            "--" +
            new Date(props.createdAt).toLocaleDateString()
          }
          className={`message-p inline-block  p-2 mr-3 rounded-md rounded-tr-none my-1 bg-blue-200 shadow-lg select-none`}
        >
          {props.children}{" "}
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
  );
}
export default SenderMessage;
