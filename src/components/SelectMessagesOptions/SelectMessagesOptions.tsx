import { PropsWithChildren } from "react";
import { ISelectedMessageData } from "../../Interface/Interface";

import closeBtnIcon from "../../assets/close-btn-icon.png";
import starIcon from "/icons/star.png";
import dustbinIcon from "/icons/dustbin-black.png";
import forwardIcon from "/icons/forward.png";
import downloadIcon from "/icons/download.png";

type propsType = {
  selectedMessagesData: ISelectedMessageData[];
  setIsSelectMessages: (bool: boolean) => void;
  setForwardMessages: (bool: boolean) => void;
  setShowDeletePopupMenu: (bool: boolean) => void;
  setSelectedMessagesData: (data: ISelectedMessageData[]) => void;
};

export default function SelectMessagesOptions(
  props: PropsWithChildren<propsType>
) {
  return (
    <div className=" fixed h-[8.4vh] w-full bottom-0 flex items-center justify-between">
      <div className="flex h-fit items-center gap-3">
        <button
          className="p-1 flex items-center gap-3  hover:bg-black/10 active:bg-transparent transition-all ease-in-out"
          onClick={() => {
            props.setSelectedMessagesData([]);
            props.setIsSelectMessages(false);
          }}
        >
          <img className="w-6" src={closeBtnIcon} />
        </button>
        <span className="text-base">
          {props.selectedMessagesData.length} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`p-1  transition-all ease-in-out ${
            props.selectedMessagesData.length > 0
              ? "hover:bg-black/10 active:bg-transparent"
              : "opacity-15"
          } `}
          disabled={!(props.selectedMessagesData.length > 0)}
          onClick={() => {}}
        >
          <img src={starIcon} className="w-6 cursor" />
        </button>
        <button
          className={`p-1  transition-all ease-in-out ${
            props.selectedMessagesData.length > 0
              ? "hover:bg-black/10 active:bg-transparent"
              : "opacity-15"
          } `}
          disabled={!(props.selectedMessagesData.length > 0)}
          onClick={() => {
            props.setShowDeletePopupMenu(true);
          }}
        >
          <img src={dustbinIcon} className="w-6 cursor-pointer" />
        </button>
        <button
          className={`p-1  transition-all ease-in-out ${
            props.selectedMessagesData.length > 0
              ? "hover:bg-black/10 active:bg-transparent"
              : "opacity-15"
          } `}
          disabled={!(props.selectedMessagesData.length > 0)}
          onClick={() => {
            console.log(props.selectedMessagesData);

            props.setIsSelectMessages(false);
            props.setForwardMessages(true);
          }}
        >
          <img src={forwardIcon} className="w-6 cursor-pointer" />
        </button>
        <button
          className={`p-1  transition-all ease-in-out ${
            props.selectedMessagesData.length > 0
              ? "hover:bg-black/10 active:bg-transparent"
              : "opacity-15"
          } `}
          disabled={!(props.selectedMessagesData.length > 0)}
          onClick={() => {}}
        >
          <img src={downloadIcon} className="w-6 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
