import React, { useEffect, useRef } from "react";

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const resizeHandler = () => {
        const parentWidth = canvas.parentElement?.clientWidth || 0;
        const width = Math.min(parentWidth, 600);
        canvas.width = width;
        canvas.height = width;
      };

      let animationFrameId = 0;

      const drawCircle = () => {
        const currentTime = new Date().getTime();
        const animationDurationMs = 5000;
        const elapsedTime = currentTime % animationDurationMs;
        const percent = elapsedTime / animationDurationMs;

        const width = canvas.width;
        const height = canvas.height;
        const radius = 6;

        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        let maxAnimationHeight = canvas.height / 2;
        const amplitude = Math.cos(2 * Math.PI * percent);
        let y = centerY + amplitude * maxAnimationHeight;

        ctx.arc(centerX, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        animationFrameId = requestAnimationFrame(drawCircle);
      };

      drawCircle();

      resizeHandler();
      window.addEventListener("resize", resizeHandler);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeHandler);
      };
    }
  }, []);
  return (
    <div>
      <h1>Animating Sound: Amplitude</h1>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
