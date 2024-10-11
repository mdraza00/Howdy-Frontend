import { PropsWithChildren } from "react";
import { ISelectedMessageData } from "../../Interface/Interface";

type propsType = {
  selectedMessagesData: ISelectedMessageData[];
  setShowDeletePopupMenu: (bool: boolean) => void;
  setDeleteForEveryOne: (bool: boolean) => void;
  setDeleteForMe: (bool: boolean) => void;
};
export default function DeleteMessagePopup(
  props: PropsWithChildren<propsType>
) {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/20 z-[1000]"
        onClick={() => props.setShowDeletePopupMenu(false)}
      ></div>
      <div
        className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[78%] h-fit rounded-lg ${
          props.selectedMessagesData
            .map(
              (selectedMessage: ISelectedMessageData) =>
                selectedMessage.messageId.split("--")[1]
            )
            .includes("receive")
            ? "h-[17%]"
            : "h-[30%]"
        }  bg-white z-[1001] p-4   shadow-2xl`}
      >
        <p className="text-[0.85rem]">Delete Chat ?</p>
        <div className="flex flex-col gap-3 justify-center items-end mt-3">
          {!props.selectedMessagesData
            .map((selectedMessage) => selectedMessage.messageId.split("--")[1])
            .includes("receive") && (
            <button
              className="rounded-full bg-blue-600 text-white w-[10.0rem] border-2 text-[0.85rem] px-1 py-2"
              onClick={() => props.setDeleteForEveryOne(true)}
            >
              Delete for everyone
            </button>
          )}
          <div
            className={`flex ${
              props.selectedMessagesData
                .map(
                  (selectedMessage) => selectedMessage.messageId.split("--")[1]
                )
                .includes("receive")
                ? "gap-3"
                : "flex-col gap-3 items-end"
            }`}
          >
            <button
              className="rounded-full bg-blue-600 text-white border-2 px-3 py-2 text-[0.85rem]"
              onClick={() => props.setDeleteForMe(true)}
            >
              Delete for me
            </button>
            <button
              className="rounded-full bg-white text-blue-500 border-2 px-3 py-2 text-[0.85rem]"
              onClick={() => {
                props.setDeleteForEveryOne(false);
                props.setDeleteForMe(false);
                props.setShowDeletePopupMenu(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
