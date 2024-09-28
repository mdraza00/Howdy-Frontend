import { PropsWithChildren } from "react";
type propsType = {
  time: string;
  createdAt: string;
  messageId: string;
  isSelectMessages: boolean;
  setSelectedMessagesData: (messageId: string, isSelected: boolean) => void;
};
function ReceiverMessage(props: PropsWithChildren<propsType>) {
  return (
    <div
      className={`w-full ${
        props.isSelectMessages ? "flex items-center gap-2" : ""
      }`}
    >
      {props.isSelectMessages && (
        <div className="ml-2">
          <input
            className="w-5 h-5 cursor-pointer"
            id={props.messageId}
            type="checkbox"
            onChange={(e) => {
              props.setSelectedMessagesData(props.messageId, e.target.checked);
            }}
          />
        </div>
      )}
      <p
        id={
          props.messageId +
          "--" +
          new Date(props.createdAt).toLocaleDateString()
        }
        className={`message-p inline-block p-1 ml-3 rounded-md rounded-tl-none my-1 bg-white shadow-lg`}
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
  );
}
export default ReceiverMessage;
