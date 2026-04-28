'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Penguin.module.css';

export default function Penguin() {
  const [hovering, setHovering] = useState(false);
  const wrapperRef = useRef(null);
  const imageDataRef = useRef(null);
  const imgSizeRef = useRef({ width: 0, height: 0 });

  // Load SilentP into an offscreen canvas and cache pixel data
  useEffect(() => {
    const img = new window.Image();
    img.src = '/SilentP.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      imageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imgSizeRef.current = { width: canvas.width, height: canvas.height };
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!imageDataRef.current || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.floor((x / rect.width) * imgSizeRef.current.width);
    const py = Math.floor((y / rect.height) * imgSizeRef.current.height);

    if (px < 0 || py < 0 || px >= imgSizeRef.current.width || py >= imgSizeRef.current.height) {
      setHovering(false);
      return;
    }

    const idx = (py * imgSizeRef.current.width + px) * 4 + 3;
    const alpha = imageDataRef.current.data[idx];
    setHovering(alpha > 30);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Пінгвін-гід"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/SilentP.png"
        alt="Пінгвін мовчить"
        className={styles.penguin}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/TalkingP.png"
        alt="Пінгвін говорить"
        className={`${styles.penguin} ${styles.talking} ${hovering ? styles.show : ''}`}
      />
    </div>
  );
}
