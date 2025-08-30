"use client";

import { 
  Box, 
  VStack, 
  Heading, 
  Icon, 
  Alert, 
  Text,
  Flex
} from "@chakra-ui/react";
import { MdOutlineCheckroom, MdOutlineBackpack, MdTipsAndUpdates } from "react-icons/md";
import { ClothingCategory } from "../../molecules";
import { OutfitSuggestion } from "../../../types/weather";

interface ClothingSuggestionProps {
  suggestion: OutfitSuggestion;
}

export const ClothingSuggestion = ({ suggestion }: ClothingSuggestionProps) => {
  return (
    <Box bg="green.50" borderRadius="xl" p={6} w="full">
      <VStack spacing={6}>
        <Heading 
          size="lg" 
          textAlign="center" 
          color="gray.800"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={MdOutlineCheckroom} color="green.500" />
          今日の服装提案
        </Heading>
        
        <VStack spacing={4} w="full">
          <ClothingCategory
            icon={MdOutlineCheckroom}
            iconColor="blue.500"
            title="基本アイテム"
            items={suggestion.mainClothing}
            colorScheme="blue"
          />

          <ClothingCategory
            emoji="🧥"
            title="アウター"
            items={suggestion.outerwear}
            colorScheme="green"
          />

          <ClothingCategory
            emoji="👟"
            title="履物"
            items={suggestion.footwear}
            colorScheme="purple"
          />

          <ClothingCategory
            icon={MdOutlineBackpack}
            iconColor="yellow.600"
            title="アクセサリー・小物"
            items={suggestion.accessories}
            colorScheme="yellow"
          />

          {suggestion.tips.length > 0 && (
            <Alert 
              status="info" 
              borderRadius="lg" 
              bg="orange.50" 
              border="1px" 
              borderColor="orange.200"
            >
              <Icon as={MdTipsAndUpdates} color="orange.500" mr={2} />
              <VStack align="start" spacing={2} flex={1}>
                <Text fontWeight="bold" color="orange.800">
                  アドバイス
                </Text>
                <VStack align="start" spacing={1}>
                  {suggestion.tips.map((tip, index) => (
                    <Flex key={index} align="start">
                      <Text mr={2} color="orange.600">•</Text>
                      <Text fontSize="sm" color="orange.700">
                        {tip}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </VStack>
            </Alert>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};