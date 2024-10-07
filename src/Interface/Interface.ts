import { MessageType } from "../enums/message";

export interface Imessage {
  _id: string;
  chatRoomId: string;
  senderId: string;
  messageType: MessageType;
  text: string;
  image: { name: string; address: string; caption: string } | null;
  video: { name: string; address: string; caption: string } | null;
  doc: { name: string; address: string; caption: string } | null;
  visibleTo: string[];
  deletedFor: string[];
  deleteForEveryOne: number;
  createdAt: string;
  updatedAt: string;
  replyTo: string | undefined;
}
export interface ImessageRes {
  status: boolean;
  message: Imessage | null;
}

export interface IGetMessagesRes {
  status: boolean;
  data: Imessage[];
}

export interface ISelectedMessageData {
  messageId: string;
  createdAtDate: string;
  createdAtTime: string;
}

export interface IMessageMultiMedia {
  isMessageMultiMedia: boolean;
  data: {
    url: string;
    filename: string;
    type: MessageType | undefined;
  } | null;
}

export interface IReplayMessage {
  isReply: boolean;
  data: {
    senderName: string;
    text: string;
    image: { name: string; address: string } | null;
    video: { name: string; address: string } | null;
    doc: boolean;
    messageId: string;
    messageType: MessageType;
  } | null;
}
