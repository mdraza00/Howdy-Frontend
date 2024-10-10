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

export interface IReplyMessage {
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
export interface IReplyToMessageData {
  isReplyTo: boolean;
  data: {
    repliedTo: string;
    text: string;
    messageType: MessageType;
    image: { name: string; address: string } | null;
    video: { name: string; address: string } | null;
    doc: boolean;
  } | null;
}

export interface IForwardMessageData {
  isForwardMessage: boolean;
  data: ISelectedMessageData[] | null;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  profilePhotoAddress: string;
}
export interface getUserRes {
  status: boolean;
  message: User | null;
}

export interface getUsersRes {
  status: boolean;
  message: {
    _id: string;
    email: string;
    username: string;
    profilePhotoAddress: string;
  }[];
}

export interface createOrGetChatRoomRes {
  status: boolean;
  message: string;
}

export interface ICreateChatRoomRes {
  status: boolean;
  message: string;
}

export interface IShowMessagesContainer {
  isShow: boolean;
  data: {
    profilePhoto: string;
    chatRoomId: string;
    userName: string;
    senderId: string;
    recipientId: string;
  } | null;
}
