import { PropsWithChildren, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";

type propsType = {
  setImageSrc: (src: string) => void;
  setIsImagePreview: (a: boolean) => void;
  croppedImage: (image: File) => void;
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  imgSrc: string;
};

function ImagePreview(props: PropsWithChildren<propsType>) {
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

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

  // props.setIsImagePreview(false);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-[1004]">
      <div className="relative h-fit w-full flex flex-col gap-14 items-center justify-center bg-black/15 py-2">
        {!!props.imgSrc && (
          <div className="">
            <ReactCrop
              crop={props.crop}
              onChange={(_, percentCrop) => props.setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              minHeight={100}
              circularCrop
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
            <div className="w-full flex items-center justify-evenly">
              <Button
                className="w-[43%]"
                color="teal"
                onClick={onDownloadCropClick}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Select
              </Button>
              <Button
                className="w-[43%]"
                onClick={() => {
                  props.setImageSrc("");
                  props.setIsImagePreview(false);
                }}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ImagePreview;
