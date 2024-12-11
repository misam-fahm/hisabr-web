"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any; 
}

const Images: React.FC<ImageProps> = ({ src, alt = 'Image', width = 500, height = 300, ...props }) => {
      const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering Image on the server side
  }


  return <Image src={src} alt={alt} width={width} height={height} {...props} />;


};

export default Images;
