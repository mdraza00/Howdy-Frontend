import { PropsWithChildren, useContext } from "react";
import { IReplayMessage } from "../../Interface/Interface";
import Context from "../../contexts/BaseURLContext";
import { MessageType } from "../../enums/message";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import { IoIosDocument } from "react-icons/io";
type propsType = {
  setReplyToMessage: (data: IReplayMessage) => void;
  replyToMessage: IReplayMessage;
};
export default function ReplyMessage(props: PropsWithChildren<propsType>) {
  const baseURL = useContext(Context);
  if (props.replyToMessage.data)
    return (
      <div className="flex ml-12 items-center w-[95%] justify-between">
        <div
          className={`w-[96.5%] h-[3.6rem] px-3 pl-3 pr-0 rounded-md bg-blue-gray-100 flex items-center justify-between`}
        >
          <div>
            <p className="text-sm">{props.replyToMessage.data.senderName}</p>
            <p className="text-sm">{props.replyToMessage.data.text}</p>
          </div>
          {props.replyToMessage.data.messageType === MessageType.IMAGE &&
            props.replyToMessage.data.image && (
              <div>
                <img
                  className="h-14"
                  src={`${baseURL.baseUrl}/${props.replyToMessage.data.image.address}/${props.replyToMessage.data.image.name}`}
                />
              </div>
            )}
          {props.replyToMessage.data.messageType === MessageType.VIDEO &&
            props.replyToMessage.data.video && (
              <div>
                <video
                  className="h-14"
                  src={`${baseURL.baseUrl}/${props.replyToMessage.data.video.address}/${props.replyToMessage.data.video.name}`}
                />
              </div>
            )}
          {props.replyToMessage.data.messageType === MessageType.DOC &&
            props.replyToMessage.data.doc && <IoIosDocument size={56} />}
        </div>
        <img
          className="h-8 cursor-pointer"
          src={closeBtnIcon}
          onClick={() =>
            props.setReplyToMessage({ isReply: false, data: null })
          }
        />
      </div>
    );
}
