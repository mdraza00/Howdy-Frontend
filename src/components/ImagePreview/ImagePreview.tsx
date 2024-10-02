import { PropsWithChildren, useRef, useState } from "react";
// import { Crop } from "react-image-crop";
import closeBtnIcon from "../../assets/close-btn-icon.png";
import { Button } from "@material-tailwind/react";
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";

type propsType = {
  setIsImagePreview: (a: boolean) => void;
  croppedImage: (image: File) => void;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  imgSrc: string;
};

function ImagePreview(props: PropsWithChildren<propsType>) {
  // const [crop, setCrop] = useState<Crop>();
  // const [imgSrc, setImgSrc] = useState("");
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setCrop(undefined);
  //     const reader = new FileReader();
  //     reader.addEventListener("load", () =>
  //       setImgSrc(reader.result?.toString() || "")
  //     );
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) =>
    centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
      mediaWidth,
      mediaHeight
    );

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    props.setCrop(centerAspectCrop(width, height, 1));
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offScreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offScreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offScreen.width,
      offScreen.height
    );
    const blob = await offScreen.convertToBlob({
      type: "image/png",
    });
    const croppedImageFile = new File([blob], "cropped-image.png", {
      type: "image/png",
    });
    props.croppedImage(croppedImageFile);
    props.setIsImagePreview(false);
  }
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          1,
          0
        );
      }
    },
    100,
    [completedCrop, 1, 0]
  );

  return (
    <div className="absolute flex w-screen h-screen items-center justify-center z-[1004]">
      <button
        className="absolute top-[27%] right-[27%] bg-white border-2 border-black z-50"
        onClick={() => {
          props.setIsImagePreview(false);
        }}
      >
        <img src={closeBtnIcon} className="w-6" />
      </button>
      <div className="w-[50%] h-[50%] flex flex-col gap-3 items-center justify-center bg-black/35 py-2">
        {!!props.imgSrc && (
          <div>
            <ReactCrop
              crop={props.crop}
              onChange={(_, percentCrop) => props.setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              minHeight={100}
              // circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={props.imgSrc}
                style={{
                  transform: `scale(${1}) rotate(${0}deg)`,
                  height: "14rem",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        )}
        {!!completedCrop && (
          <>
            <div className="hidden">
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div>
              <Button
                className="bg-lightGreen w-52"
                onClick={onDownloadCropClick}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Select
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ImagePreview;
