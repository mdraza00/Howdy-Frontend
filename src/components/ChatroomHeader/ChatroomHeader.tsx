import { PropsWithChildren, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IShowMessagesContainer } from "../../Interface/Interface";
import Context from "../../contexts/BaseURLContext";

import threeDotsIcon from "/three-dots-icon.png";
import searchIcon from "/search-icon.png";

type propsType = {
  userId: string;
  chatRoomId: string;
  chatRoomProfilePhoto: string;
  chatRoomName: string;
  threeDotsPopupMenu: boolean;
  setThreeDotsPopupMenu: (bool: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};
export default function ChatroomHeader(props: PropsWithChildren<propsType>) {
  const baseURL = useContext(Context);
  return (
    <div className="fixed top-0 left-0 h-[8.2vh] w-full bg-light-blue-800 flex justify-between items-center z-[500]">
      <div className="flex items-center gap-1 pl-2">
        <FaArrowLeft
          size={25}
          onClick={() => {
            props.setShowMessagesContainer({ isShow: false, data: null });
          }}
        />
        <div
          className=" h-fit  pl-1 py-[0.2rem] flex gap-2 items-center  rounded-md active:bg-white/[.15] transition-all ease-in-out cursor-pointer"
          onClick={() => {
            props.setChatRoomUserProfile(props.userId, props.chatRoomId, true);
          }}
        >
          <img
            src={`${baseURL.baseUrl}/${props.chatRoomProfilePhoto}`}
            className="w-11 h-11 rounded-full object-cover"
          />
          <p className="text-white text-[0.95rem]">{props.chatRoomName}</p>
        </div>
      </div>
      <div className="flex h-fit items-center">
        <button className="rounded-full active:bg-white/[.20] active:shadow-md transition-all ease-in-out duration-200">
          <img className="w-6" src={searchIcon} />
        </button>
        <button
          className="rounded-full active:bg-white/[.20] active:shadow-md transition-all ease-in-out duration-200"
          onClick={() => {
            props.setThreeDotsPopupMenu(
              props.threeDotsPopupMenu ? false : true
            );
          }}
        >
          <img className="w-7" src={threeDotsIcon} />
        </button>
      </div>
    </div>
  );
}
