import { CHATROOM_TYPE } from "../enums/chatroomType";
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

export interface IUser {
  _id: string;
  username: string;
  email: string;
  friends: string[];
  profilePhotoAddress: string;
  about: string;
}
export interface IGetUserRes {
  status: boolean;
  data: IUser | null;
}
export interface IGetUsersRes {
  status: boolean;
  data: IUser[] | null;
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

export interface IFriend {
  _id: string;
  username: string;
  email: string;
  friends: string[];
  profilePhotoAddress: string;
  about: string;
}
export interface IGetFriendRes {
  status: boolean;
  message: IFriend[] | null;
}

export interface IGetUsersRes {
  status: boolean;
  message: {
    _id: string;
    username: string;
    profilePhotoAddress: string;
    isFriendRequest: boolean;
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
    chatroomName: string;
    chatroomType: CHATROOM_TYPE;
    members: string[];
  } | null;
}

export interface ISendFriendRequest {
  isSend: boolean;
  data: {
    requestedUserId: string;
    senderId: string;
  } | null;
}

export interface IGetFriendRequestsRes {
  status: boolean;
  message: {
    _id: string;
    request_to: string;
    request_by: {
      _id: string;
      username: string;
      profilePhoto: {
        fileAddress: string;
      };
    };
    request_status: string;
    __v: 0;
  }[];
}
export interface IFriendRequestsData {
  friendRequestId: string;
  senderId: string;
  username: string;
  profilePhotoAddress: string;
}
export interface ICreateGroup {
  isCreate: boolean;
  roomMembersId: string[] | null;
}

export interface IChatRoom {
  _id: string;
  chatroomType: CHATROOM_TYPE;
  members: string[];
  chatroomProfilePhoto: string;
  groupDescription: string;
  chatroomName: string;
  lastMessage: string;
  lastMessageDate: string;
  lastMessageVisibleTo: string[];
  about: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetChatRoomRes {
  status: boolean;
  data: IChatRoom[];
}
