import { PropsWithChildren, useContext } from "react";
import { IReplyMessage } from "../../Interface/Interface";
import Context from "../../contexts/BaseURLContext";
import { MessageType } from "../../enums/message";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import { IoIosDocument } from "react-icons/io";
type propsType = {
  setReplyToMessage: (data: IReplyMessage) => void;
  replyToMessage: IReplyMessage;
};
export default function ReplyMessage(props: PropsWithChildren<propsType>) {
  const baseURL = useContext(Context);
  return (
    <div
      className={`fixed ${
        props.replyToMessage.data ? "bottom-[8.4vh]" : "bottom-[-10vh]"
      } bg-blue-gray-50 h-fit flex items-center w-full justify-between px-2 pt-[0.35rem] pb-0 gap-1 transition-all duration-400 z-[130]`}
    >
      <div
        className={`w-full h-fit pl-2 py-[0.1rem] rounded-sm bg-blue-gray-100 flex items-center justify-between`}
      >
        <div className="flex flex-col justify-center">
          <p className="text-sm">{props.replyToMessage.data?.senderName}</p>
          <p className="text-sm">{props.replyToMessage.data?.text}</p>
        </div>
        {props.replyToMessage.data?.messageType === MessageType.IMAGE &&
          props.replyToMessage.data.image && (
            <div>
              <img
                className="h-14"
                src={`${baseURL.baseUrl}/${props.replyToMessage.data.image.address}/${props.replyToMessage.data.image.name}`}
              />
            </div>
          )}
        {props.replyToMessage.data?.messageType === MessageType.VIDEO &&
          props.replyToMessage.data.video && (
            <div>
              <video
                className="h-14"
                src={`${baseURL.baseUrl}/${props.replyToMessage.data.video.address}/${props.replyToMessage.data.video.name}`}
              />
            </div>
          )}
        {props.replyToMessage.data?.messageType === MessageType.DOC &&
          props.replyToMessage.data.doc && <IoIosDocument size={56} />}
      </div>
      <img
        className="h-7 cursor-pointer"
        src={closeBtnIcon}
        onClick={() => props.setReplyToMessage({ isReply: false, data: null })}
      />
    </div>
  );
}
