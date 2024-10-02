import { PropsWithChildren } from "react";
import { FaPlus, FaFileAlt } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { FaPollH } from "react-icons/fa";
import { PiStickerFill } from "react-icons/pi";

type props = {
  sendFile: boolean;
  setSendFile: (a: boolean) => void;
};

export default function SendFile(props: PropsWithChildren<props>) {
  return (
    <>
      {props.sendFile && (
        <div
          className="absolute w-[100vw] h-screen left-[-25vw] bottom-0 bg-transparent z-[71]"
          onClick={() => props.setSendFile(false)}
        ></div>
      )}

      <div
        className={`transition-all ease-in-out duration-[390ms] fixed left-[25.45%] z-[71] ${
          props.sendFile ? `bottom-[3.2rem]` : "bottom-[-900px]"
        } bg-white shadow-xl py-2 px-3 rounded-xl `}
      >
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaFileAlt size={19} color="purple" /> <span>Document</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <IoMdPhotos size={19} color="blue" /> <span>Photos</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaFileVideo size={19} color="red" /> <span>Videos</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaCamera size={19} color="orange" /> <span>Camera</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <FaPollH size={19} color="brown" /> <span>Poll</span>
        </div>
        <div className="flex items-center gap-2 w-36 hover:bg-black/5 transition-all ease-in-out py-[7px] px-[10px] rounded-md cursor-pointer">
          <PiStickerFill size={19} color="purple" /> <span>New sticker</span>
        </div>
      </div>

      <div
        className={`absolute top-[50%] translate-y-[-50%] left-[0.65rem] w-11 h-fit z-[81]`}
      >
        <button
          className={`px-2 ${
            props.sendFile ? "bg-black/10" : ""
          } rounded-full border-none hover:bg-black/10`}
          onClick={() => {
            props.setSendFile(props.sendFile ? false : true);
          }}
        >
          <FaPlus
            id="send-file-icon"
            className={`transition-all ease-in-out duration-[370ms] ${
              props.sendFile ? "rotate-[225deg]" : "rotate-[0deg]"
            }`}
            size={22}
          />
        </button>
      </div>
    </>
  );
}
