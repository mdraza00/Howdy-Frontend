import axios from "axios";
import { PropsWithChildren, useContext } from "react";
import Context from "../../contexts/BaseURLContext";
import {
  ICreateChatRoomRes,
  IShowMessagesContainer,
} from "../../Interface/Interface";
type propsType = {
  _id: string;
  userId: string;
  updateChatRoomsData: boolean;
  username: string;
  profilePhotoAddress: string;
  setUserNameInput: (username: string) => void;
  setNewChatModel: (bool: boolean) => void;
  setLoadMessages: (bool: boolean) => void;
  setUpdateChatRoomsData: (bool: boolean) => void;
  setActiveChatRoomId: (chatroomId: string) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
};
export default function User(props: PropsWithChildren<propsType>) {
  const BaseURL = useContext(Context);
  const token = localStorage.getItem("token");
  return (
    <div
      id={props._id}
      key={props._id}
      className={`flex items-center h-fit gap-2 p-2 rounded-md cursor-pointer hover:bg-black/15`}
      onClick={(e) => {
        const recipientId = e.currentTarget.id;
        const senderId = props.userId;
        const url = `${BaseURL.baseUrl}/chatroom/createRoom`;
        console.log(recipientId, senderId, url);
        axios
          .post<ICreateChatRoomRes>(
            url,
            {
              senderId,
              recipientId,
            },
            { headers: { authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            // update chatrooms
            props.setUpdateChatRoomsData(
              props.updateChatRoomsData ? false : true
            );
            // console.log(res.data.message);
            props.setActiveChatRoomId(res.data.message);
            props.setShowMessagesContainer({
              isShow: true,
              data: {
                profilePhoto: props.profilePhotoAddress,
                chatRoomId: res.data.message,
                userName: props.username,
                senderId: senderId,
                recipientId: recipientId,
              },
            });

            props.setLoadMessages(true);
            props.setNewChatModel(false);
          })
          .catch((err) => {
            console.log(
              "an error has occured in creating chatroom. error = ",
              err
            );
          });

        props.setUserNameInput("");
      }}
    >
      <img
        onClick={() => {
          console.log(`${BaseURL.baseUrl}/${props.profilePhotoAddress}`);
        }}
        src={`${BaseURL.imageUrl}/${props.profilePhotoAddress}`}
        className="object-cover w-12 rounded-full"
      />
      <p>{props.username}</p>
    </div>
  );
}
