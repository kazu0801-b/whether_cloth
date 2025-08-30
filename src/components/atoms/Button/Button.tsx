"use client";

import { Button as ChakraButton, ButtonProps as ChakraButtonProps, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface ButtonProps extends Omit<ChakraButtonProps, 'leftIcon' | 'rightIcon'> {
  leftIcon?: IconType;
  rightIcon?: IconType;
}

export const Button = ({ leftIcon, rightIcon, children, ...props }: ButtonProps) => {
  return (
    <ChakraButton
      {...props}
      leftIcon={leftIcon ? <Icon as={leftIcon} /> : undefined}
      rightIcon={rightIcon ? <Icon as={rightIcon} /> : undefined}
      _hover={{ transform: "translateY(-2px)", shadow: "lg", ...props._hover }}
      transition="all 0.2s"
    >
      {children}
    </ChakraButton>
  );
};