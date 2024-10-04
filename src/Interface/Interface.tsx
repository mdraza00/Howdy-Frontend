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
