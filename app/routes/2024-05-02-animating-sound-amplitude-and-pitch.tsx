import React, { useEffect, useRef } from "react";

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let mouseX = 0, mouseY = 0;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const resizeHandler = () => {
        const parentWidth = canvas.parentElement?.clientWidth || 0;
        const width = Math.min(parentWidth, 600);
        canvas.width = width;
        canvas.height = width;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      let animationFrameId = 0;

      canvas.addEventListener("mousemove", function(event) {
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
      });

      const drawCircle = () => {
        const radius = 6;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        const volume = 1 - (mouseY / canvas.height);
        gainNode.gain.value = volume;

        const numHalfWidths = mouseX / (canvas.width / 2);
        const freqMultiplier = 2 ** numHalfWidths;
        oscillator.frequency.value = 220 * freqMultiplier;

        animationFrameId = requestAnimationFrame(drawCircle);
      };

      canvas.addEventListener(
        "click",
        () => {
          oscillator.start();
          drawCircle();
        },
        { once: true }
      );

      resizeHandler();
      window.addEventListener("resize", resizeHandler);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeHandler);
        audioContext.close();
      };
    }
  }, []);
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>Animating Sound: Amplitude and Pitch</h1>
      <div style={{ textAlign: "center" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
