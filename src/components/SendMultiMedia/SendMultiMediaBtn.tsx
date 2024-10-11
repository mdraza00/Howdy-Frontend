import { PropsWithChildren } from "react";
import { FaPlus } from "react-icons/fa";

type propsType = {
  sendMultiMedia: boolean;
  setSendMultiMedia: (bool: boolean) => void;
};

export default function SendMultiMediaBtn(props: PropsWithChildren<propsType>) {
  return (
    <div className={`h-fit w-fit pb-[0.2rem] `}>
      <button
        className={`${
          props.sendMultiMedia ? "bg-black/10" : ""
        } rounded-full border-none hover:bg-black/10`}
        onClick={() => {
          props.setSendMultiMedia(props.sendMultiMedia ? false : true);
        }}
      >
        <FaPlus
          id="send-file-icon"
          className={`transition-all ease-in-out duration-[370ms] ${
            props.sendMultiMedia ? "rotate-[225deg]" : "rotate-[0deg]"
          }`}
          size={22}
        />
      </button>
    </div>
  );
}
