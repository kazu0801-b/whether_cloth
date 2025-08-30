"use client";

import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from "@chakra-ui/react";

type BadgeProps = ChakraBadgeProps;

export const Badge = ({ children, ...props }: BadgeProps) => {
  return (
    <ChakraBadge p={2} borderRadius="full" {...props}>
      {children}
    </ChakraBadge>
  );
};