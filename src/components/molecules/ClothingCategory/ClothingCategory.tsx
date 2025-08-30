"use client";

import { Box, HStack, Heading, Icon, Wrap, WrapItem, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Badge } from "../../atoms";

interface ClothingCategoryProps {
  icon?: IconType;
  emoji?: string;
  iconColor?: string;
  title: string;
  items: string[];
  colorScheme: string;
}

export const ClothingCategory = ({
  icon,
  emoji,
  iconColor = "blue.500",
  title,
  items,
  colorScheme
}: ClothingCategoryProps) => {
  if (items.length === 0) return null;

  return (
    <Box bg="white" borderRadius="lg" p={4} w="full">
      <HStack mb={3}>
        {icon && <Icon as={icon} color={iconColor} />}
        {emoji && <Text fontSize="lg">{emoji}</Text>}
        <Heading size="sm" color="gray.800">{title}</Heading>
      </HStack>
      <Wrap>
        {items.map((item, index) => (
          <WrapItem key={index}>
            <Badge colorScheme={colorScheme}>
              {item}
            </Badge>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};