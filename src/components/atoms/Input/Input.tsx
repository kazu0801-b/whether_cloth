"use client";

import { Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

type InputProps = ChakraInputProps;

export const Input = ({ ...props }: InputProps) => {
  return (
    <ChakraInput
      bg="white"
      borderColor="gray.300"
      _hover={{ borderColor: "blue.400" }}
      _focus={{ borderColor: "blue.500", shadow: "outline" }}
      {...props}
    />
  );
};