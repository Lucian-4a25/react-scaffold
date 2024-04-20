import React, { useEffect, useRef } from "react"
import "./index.scss"
// @ts-ignore
// import backgroundImage from '@assets/screenshot1.png';

// Test canvas with background image
export default ({ }: {}) => {
  let canvas_ref = useRef(null);
  const width = 500;
  const height = 500;

  useEffect(() => {
    if (!canvas_ref.current) {
      console.error("cavnas ref is empty");
      return;
    }
    const canvasEl = canvas_ref.current as HTMLCanvasElement;
    const ctx = canvasEl.getContext("2d");
    ctx.fillStyle = "pink";
    ctx.fillRect(100, 100, 200, 200);

  }, []);

  // console.log("background path: ", backgroundImage)

  return <div className="canvas-container">
    <div className="canvas-background" style={{ width: `${width}px`, height: `${height}px`, /* backgroundImage: `url(${backgroundImage})` */ }}></div>
    <canvas ref={canvas_ref} className="cavans-item" width={width} height={500}></canvas>
  </div >
}