"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

const Images: React.FC<ImageProps> = ({
  src,
  alt = "Image",
  width = 500,
  height = 300,
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <Image src={src} alt={alt} width={width} height={height} {...props} />
  ) : (
    // Render a placeholder while waiting for the client to mount
    <div style={{ width, height }} />
  );
};

export default Images;
