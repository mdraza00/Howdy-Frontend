import axios from "axios";
import ReplyMessage from "../ReplyMessage/ReplyMessage";
import SendMultiMedia from "../SendMultiMedia/SendMultiMedia";
import SendMultiMediaBtn from "../SendMultiMedia/SendMultiMediaBtn";

import { BsSendFill } from "react-icons/bs";
import { PropsWithChildren, useContext, useEffect, useRef } from "react";
import { ImessageRes, IReplyMessage } from "../../Interface/Interface";
import { MessageType } from "../../enums/message";
import Context from "../../contexts/BaseURLContext";

type propsType = {
  userId: string;
  chatRoomId: string;
  sendMultiMedia: boolean;
  chatRoomUserProfile: boolean;
  replyToMessage: IReplyMessage;
  setSendMultiMedia: (bool: boolean) => void;
  setIsChatRoomMessagesCleared: (bool: boolean) => void;
  setReplyToMessage: (data: IReplyMessage) => void;
  setSendMessage: (data: ImessageRes) => void;
};

export default function SendMessagesForm(props: PropsWithChildren<propsType>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const baseURL = useContext(Context);
  const token = localStorage.getItem("token");

  const storeMessagesInDB = (
    message: string,
    chatRoomId: string,
    senderId: string,
    messageType: MessageType
  ) => {
    const url = `${baseURL.baseUrl}/message/save`;
    axios
      .post<ImessageRes>(
        url,
        {
          chatRoomId: chatRoomId,
          senderId: senderId,
          text: message,
          replyTo: props.replyToMessage.data
            ? props.replyToMessage.data.messageId
            : undefined,
          messageType: messageType,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message)
          props.setSendMessage({
            status: true,
            message: {
              _id: res.data.message._id,
              chatRoomId: res.data.message.chatRoomId,
              messageType: res.data.message.messageType,
              image: res.data.message.image,
              video: res.data.message.video,
              text: res.data.message.text,
              doc: res.data.message.doc,
              createdAt: res.data.message.createdAt,
              updatedAt: res.data.message.updatedAt,
              senderId: res.data.message.senderId,
              visibleTo: res.data.message.visibleTo,
              deletedFor: res.data.message.deletedFor,
              deleteForEveryOne: res.data.message.deleteForEveryOne,
              replyTo: res.data.message.replyTo,
            },
          });
      })
      .catch((err) => {
        console.log("error in storing message. error => ", err);
      });
  };

  const sendMessageBtnHandler = function (e: React.BaseSyntheticEvent) {
    e.preventDefault();

    const messageInput = inputRef.current?.value;

    if (messageInput && messageInput.length > 0) {
      const senderId = props.userId;

      if (senderId) {
        storeMessagesInDB(
          messageInput,
          props.chatRoomId,
          senderId,
          MessageType.TEXT
        );

        if (inputRef.current) inputRef.current.value = "";
        props.setReplyToMessage({ isReply: false, data: null });
        props.setIsChatRoomMessagesCleared(false);
      }
    }
  };

  useEffect(() => {
    if (props.replyToMessage.isReply) {
      if (inputRef.current) inputRef.current.focus();
    }
  }, [props.replyToMessage.isReply]);
  return (
    <>
      <ReplyMessage
        chatRoomUserProfile={props.chatRoomUserProfile}
        setReplyToMessage={props.setReplyToMessage}
        replyToMessage={props.replyToMessage}
      />
      <SendMultiMedia
        setReplyToMessage={props.setReplyToMessage}
        replyToMessage={props.replyToMessage}
        chatRoomId={props.chatRoomId}
        senderId={props.userId}
        chatRoomUserProfile={props.chatRoomUserProfile}
        setSendMessage={props.setSendMessage}
        sendMultiMedia={props.sendMultiMedia}
        setSendMultiMedia={props.setSendMultiMedia}
      />
      <div
        className={`fixed w-full sm:w-[58vw] md:w-[63vw] ${
          props.chatRoomUserProfile
            ? "lg:right-[33vw] lg:w-[33vw] xl:w-[37vw] 2xl:w-[39vw]"
            : "lg:w-[66vw] xl:w-[70vw] 2xl:w-[72vw]"
        }   bottom-0 right-0 bg-gray-200 flex flex-col items-center gap-[0.5rem] py-[0.4rem]
                px-1 transition-all ease-in-out duration-500 h-[8.4vh]`}
      >
        <div className="flex items-center absolute left-0 top-0 w-full">
          <SendMultiMediaBtn
            sendMultiMedia={props.sendMultiMedia}
            setSendMultiMedia={props.setSendMultiMedia}
          />
          <form
            className={`flex items-center gap-2 w-full pr-1`}
            onSubmit={sendMessageBtnHandler}
          >
            <input
              id="message-input"
              type="text"
              className="w-[95%] rounded-sm px-2 py-1 mr-1 focus:outline-none"
              placeholder="Type a message"
              ref={inputRef}
              autoFocus={true}
            />

            <button type="submit" className={`bg-blue-600 p-[0.4rem]`}>
              <BsSendFill color="white" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
