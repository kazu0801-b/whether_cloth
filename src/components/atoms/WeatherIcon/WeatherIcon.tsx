"use client";

import { Image as ChakraImage } from "@chakra-ui/react";

interface WeatherIconProps {
  icon: string;
  alt: string;
  size?: string;
}

export const WeatherIcon = ({ icon, alt, size = "80px" }: WeatherIconProps) => {
  return (
    <ChakraImage
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt={alt}
      boxSize={size}
      borderRadius="lg"
      bg="white"
      p={2}
    />
  );
};