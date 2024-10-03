import { PropsWithChildren, useEffect, useState } from "react";

type propsType = {
  sendPhotos: boolean;
  setSendPhotos: (a: boolean) => void;
};
export default function SendImage(props: PropsWithChildren<propsType>) {
  const [messageImage, setMessageImage] = useState("");
  const imageMessageInput = document.getElementById("image-message-input");
  useEffect(() => {
    if (props.sendPhotos) imageMessageInput?.click();
  }, [imageMessageInput, props.sendPhotos]);
  return (
    <>
      {props.sendPhotos && (
        <div
          className={`fixed top-0 left-0 w-screen h-screen bg-transparent z-[85]`}
          onClick={() => props.setSendPhotos(false)}
        ></div>
      )}

      <div
        className={`fixed transition-all ease-in-out duration-500 bg-blue-gray-50 ${
          messageImage ? "bottom-0" : "bottom-[-999px]"
        }    w-[75%] h-[86.2vh] z-[85]`}
      >
        <div className="flex items-center justify-center">
          <img src={messageImage} className="w-[20rem]" />
        </div>
        <input
          id="image-message-input"
          className="hidden absolute top-[1000000px]"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              const reader = new FileReader();
              reader.onload = function () {
                if (reader.result) {
                  const imageURL = reader.result.toString();
                  setMessageImage(imageURL);
                }
                // specify what to do when the file is ready.
              };
              reader.readAsDataURL(files[0]);
            }
          }}
        />
      </div>
    </>
  );
}
