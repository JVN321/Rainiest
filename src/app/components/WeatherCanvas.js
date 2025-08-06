'use client';

import { useEffect, useRef } from 'react';

export default function WeatherCanvas({ isVisible, districtData, isNight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Animation based on district data and time
    if (districtData.hasLeaveInfo) {
      animateRain(ctx, canvas);
    } else if (isNight) {
      animateMoonClouds(ctx, canvas);
    } else {
      animateSunClouds(ctx, canvas);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, districtData, isNight]);

  const animateRain = (ctx, canvas) => {
    const raindrops = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 15 + 10,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 6 + 4
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw clouds
      drawCloud(ctx, canvas.width / 2 - 120, 80, 80);
      drawCloud(ctx, canvas.width / 2 + 60, 100, 60);
      
      // Draw raindrops
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      raindrops.forEach(drop => {
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.speedX, drop.y + drop.length);
      });
      
      ctx.stroke();
      
      // Update raindrop positions
      raindrops.forEach(drop => {
        drop.x += drop.speedX;
        drop.y += drop.speedY;
        
        if (drop.y > canvas.height) {
          drop.x = Math.random() * canvas.width;
          drop.y = -20;
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const animateSunClouds = (ctx, canvas) => {
    let cloudX = Math.random() * canvas.width;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sun
      drawSun(ctx, canvas.width / 2, 120, 60);
      
      // Draw moving clouds
      for (let i = 0; i < 3; i++) {
        drawCloud(ctx, cloudX + i * 180, 100 + i * 30, 80 + Math.random() * 20);
      }
      
      cloudX += 1.2;
      if (cloudX > canvas.width) cloudX = -200;
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const animateMoonClouds = (ctx, canvas) => {
    let cloudX = Math.random() * canvas.width;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw moon
      drawMoon(ctx, canvas.width / 2, 120, 50);
      
      // Draw moving clouds
      for (let i = 0; i < 3; i++) {
        drawCloud(ctx, cloudX + i * 180, 100 + i * 30, 80 + Math.random() * 20);
      }
      
      cloudX += 0.8;
      if (cloudX > canvas.width) cloudX = -200;
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const drawCloud = (ctx, x, y, size) => {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#cfd8dc';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + size * 0.5, y - size * 0.5, size * 0.5, Math.PI * 1, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.5, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawSun = (ctx, x, y, radius) => {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe082';
    ctx.shadowColor = '#ffd54f';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.restore();
  };

  const drawMoon = (ctx, x, y, radius) => {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#b0bec5';
    ctx.shadowColor = '#eceff1';
    ctx.shadowBlur = 20;
    ctx.fill();
    
    // Crescent effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x + 15, y - 10, radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  };

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ display: isVisible ? 'block' : 'none' }}
    />
  );
}
