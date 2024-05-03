import React, { useEffect, useRef } from "react";

type BodyType = {
  px: number;
  py: number;
  vx: number;
  vy: number;
  trail: Array<{
    x: number;
    y: number;
  }>;
  oscillator: OscillatorNode;
  gainNode: GainNode;
};

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const resizeHandler = () => {
        const parentWidth = canvas.parentElement?.clientWidth || 0;
        const width = Math.min(parentWidth, 600);
        canvas.width = width;
        canvas.height = width;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      let animationFrameId = 0;

      const bodies: BodyType[] = [
        {
          px: canvas.width * 0.5,
          py: 0,
          vx: -1,
          vy: 1,
          trail: [],
          oscillator: audioContext.createOscillator(),
          gainNode: audioContext.createGain(),
        },
        {
          px: canvas.width * 0.5,
          py: canvas.height,
          vx: 1,
          vy: -1,
          trail: [],
          oscillator: audioContext.createOscillator(),
          gainNode: audioContext.createGain(),
        },
      ];

      for (const body of bodies) {
        body.oscillator.type = "sine";
        body.oscillator.connect(body.gainNode);
        body.gainNode.connect(audioContext.destination);
      }

      const render = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gravitational constant
        const G = 20;

        for (let i = 0; i < bodies.length; i++) {
          const body1 = bodies[i];
          for (let j = i + 1; j < bodies.length; j++) {
            const body2 = bodies[j];

            // Calculate distance between the bodies
            const dx = body2.px - body1.px;
            const dy = body2.py - body1.py;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply gravitational force
            const force = G / (distance * distance);
            const fx = force * dx;
            const fy = force * dy;

            // Update velocities
            body1.vx += fx;
            body1.vy += fy;
            body2.vx -= fx;
            body2.vy -= fy;
          }

          // Update positions
          body1.px += body1.vx;
          body1.py += body1.vy;

          // Draw the body
          ctx.beginPath();
          ctx.arc(body1.px, body1.py, 20, 0, Math.PI * 2);
          const colors = ["red", "green", "blue"];
          ctx.fillStyle = colors[i];
          ctx.fill();
          ctx.closePath();

          // Update trail
          body1.trail.push({ x: body1.px, y: body1.py });
          if (body1.trail.length > 500) {
            body1.trail.shift();
          }

          // Draw trail
          ctx.beginPath();
          ctx.moveTo(body1.trail[0].x, body1.trail[0].y);
          for (let j = 1; j < body1.trail.length; j++) {
            ctx.lineTo(body1.trail[j].x, body1.trail[j].y);
          }
          ctx.strokeStyle = colors[i];
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.closePath();

          // Update sound for body
          const volume = 1 - body1.py / canvas.height;
          body1.gainNode.gain.value = volume;

          const numHalfWidths = body1.px / (canvas.width / 2);
          const freqMultiplier = 2 ** numHalfWidths;
          body1.oscillator.frequency.value = 220 * freqMultiplier;
        }

        animationFrameId = requestAnimationFrame(render);
      };

      canvas.addEventListener(
        "click",
        () => {
          for (const body of bodies) {
            body.oscillator.start();
          }
          render();
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
    <>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <h1>Animating Sound: Two Bodies</h1>
        <div style={{ textAlign: "center" }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </>
  );
}
