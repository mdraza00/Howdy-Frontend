import { PropsWithChildren } from "react";
import { IShowMessagesContainer } from "../../Interface/Interface";

type propsType = {
  userId: string;
  chatRoomId: string;
  threeDotsPopupMenu: boolean;
  setIsSelectMessages: (bool: boolean) => void;
  setIsChatRoomDeleted: (bool: boolean) => void;
  setThreeDotsPopupMenu: (bool: boolean) => void;
  setIsChatRoomMessagesCleared: (bool: boolean) => void;
  setShowMessagesContainer: (data: IShowMessagesContainer) => void;
  setChatRoomUserProfile: (
    userId: string,
    chatRoomId: string,
    isChatRoomUserProfile: boolean
  ) => void;
};
export default function ThreeDotsPopupMenu(
  props: PropsWithChildren<propsType>
) {
  return (
    <>
      {props.threeDotsPopupMenu && (
        <div
          className="fixed top-0 left-0 h-full bg-black w-full bg-transparent z-[400]"
          onClick={() => props.setThreeDotsPopupMenu(false)}
        ></div>
      )}

      <div
        className={`fixed bg-white ${
          props.threeDotsPopupMenu ? "top-[8.2vh]" : "top-[-20rem]"
        } right-1  transition-all ease-in-out duration-[440ms] h-fit w-fit pr-2 py-1 z-[401]`}
      >
        <div
          className="px-2 py-[0.3rem] hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            props.setChatRoomUserProfile(props.userId, props.chatRoomId, true);
            props.setThreeDotsPopupMenu(false);
          }}
        >
          <p>Contact Info</p>
        </div>
        <div
          className="px-2 py-[0.3rem] hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            props.setThreeDotsPopupMenu(false);
            props.setIsSelectMessages(true);
          }}
        >
          <p>Select Messages</p>
        </div>
        <div
          className="px-2 py-[0.3rem] hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() =>
            props.setShowMessagesContainer({ isShow: false, data: null })
          }
        >
          <p>Close Chat</p>
        </div>
        <div
          className="px-2 py-[0.3rem] hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => {
            props.setIsChatRoomMessagesCleared(true);
            setTimeout(() => {
              props.setThreeDotsPopupMenu(false);
            }, 100);
          }}
        >
          <p>Clear Chat</p>
        </div>
        <div
          className="px-2 py-[0.3rem] hover:bg-black/[.06] transition-all ease-in-out cursor-pointer active:bg-white"
          onClick={() => props.setIsChatRoomDeleted(true)}
        >
          <p>Delete Chat</p>
        </div>
      </div>
    </>
  );
}
