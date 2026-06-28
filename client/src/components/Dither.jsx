import React, { useRef, useEffect } from 'react';

const Dither = ({
  color = 'rgba(6, 21, 43, 0.04)',
  speed = 0.8,
  pixelSize = 3,
  className = '',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      time += speed * 0.02;

      const w = canvas.width;
      const h = canvas.height;
      const size = pixelSize;

      // Draw dithered waves using sine wave patterns
      for (let x = 0; x < w; x += size * 4) {
        for (let y = 0; y < h; y += size * 4) {
          // Calculate wave intensity
          const noise = Math.sin(x * 0.005 + time) * Math.cos(y * 0.005 + time) * 0.5 + 0.5;

          // Render pixelated retro dither pattern based on wave density
          if (noise > 0.15) {
            ctx.fillRect(x, y, size, size);
          }
          if (noise > 0.35 && x + size * 2 < w && y + size * 2 < h) {
            ctx.fillRect(x + size * 2, y + size * 2, size, size);
          }
          if (noise > 0.55 && x + size * 2 < w) {
            ctx.fillRect(x + size * 2, y, size, size);
          }
          if (noise > 0.75 && y + size * 2 < h) {
            ctx.fillRect(x, y + size * 2, size, size);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, pixelSize]);

  return <canvas ref={canvasRef} className={`absolute inset-0 block pointer-events-none ${className}`} />;
};

export default Dither;
