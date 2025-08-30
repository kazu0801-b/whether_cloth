"use client";

import { Box, VStack, HStack, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { FiSun, FiClock } from "react-icons/fi";
import { BsSun, BsSunset } from "react-icons/bs";
import { TimeBasedClothingAdvice as TimeBasedAdviceType } from "../../../types/weather";
import { WeatherIcon } from "../../atoms";

interface TimeBasedClothingAdviceProps {
  advice: TimeBasedAdviceType;
}

export const TimeBasedClothingAdvice = ({ advice }: TimeBasedClothingAdviceProps) => {
  const timeSlots = [
    {
      key: 'morning',
      data: advice.morning,
      title: '朝（6-12時）',
      icon: FiSun,
      color: 'orange.500'
    },
    {
      key: 'afternoon', 
      data: advice.afternoon,
      title: '昼（12-18時）',
      icon: BsSun,
      color: 'yellow.500'
    },
    {
      key: 'evening',
      data: advice.evening,
      title: '夜（18-24時）',
      icon: BsSunset,
      color: 'purple.500'
    }
  ];

  const availableSlots = timeSlots.filter(slot => slot.data);

  if (availableSlots.length === 0) {
    return (
      <Box bg="white" borderRadius="lg" p={6} w="full">
        <HStack mb={4}>
          <FiClock color="gray.500" />
          <Heading size="md" color="gray.700">時間帯別天気予報</Heading>
        </HStack>
        <Text color="gray.600">{advice.dayOverview}</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="lg" p={4} w="full">
      <VStack spacing={3} align="stretch">
        <HStack mb={1}>
          <FiClock color="gray.500" fontSize="18px" />
          <Heading size="sm" color="gray.700">時間帯別天気予報</Heading>
        </HStack>
        
        <Text fontSize="xs" color="gray.600" mb={2}>
          {advice.dayOverview}
        </Text>

        <SimpleGrid 
          columns={{ base: 1, md: Math.min(3, availableSlots.length) }} 
          spacing={3}
          minChildWidth="220px"
        >
          {availableSlots.map((slot) => (
            <Box key={slot.key} bg="gray.50" borderRadius="md" p={2} minH="140px" maxH="180px" overflowY="auto">
              <VStack spacing={1} align="stretch">
                <HStack justify="space-between" flexShrink={0}>
                  <HStack>
                    <Box as={slot.icon} color={slot.color} fontSize="16px" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      {slot.title}
                    </Text>
                  </HStack>
                  <HStack>
                    <WeatherIcon 
                      icon={slot.data!.weather.icon} 
                      alt={slot.data!.weather.weather}
                      size="32px" 
                    />
                    <VStack spacing={0} align="end">
                      <Text fontSize="sm" fontWeight="bold">
                        {slot.data!.weather.temp}°C
                      </Text>
                      <Text fontSize="xs" color="blue.600" fontWeight="medium">
                        ☔ {slot.data!.weather.pop}%
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
                
                <Text fontSize="xs" color="gray.600" flexShrink={0}>
                  {slot.data!.weather.weather}
                </Text>

                <VStack spacing={1} align="stretch" flex="1">
                  {/* 最も重要な情報のみ表示 */}
                  <Box>
                    {/* 基本服装（最重要） */}
                    {slot.data!.clothing.mainClothing.length > 0 && (
                      <Text fontSize="xs" color="blue.600" fontWeight="semibold">
                        {slot.data!.clothing.mainClothing.slice(0, 1).join("")}
                        {slot.data!.clothing.outerwear.length > 0 && ` + ${slot.data!.clothing.outerwear[0]}`}
                      </Text>
                    )}
                    
                    {/* 小物・アクセサリー */}
                    {slot.data!.clothing.accessories.length > 0 && (
                      <Text fontSize="xs" color="purple.600" mt={1}>
                        {slot.data!.clothing.accessories.slice(0, 2).join(", ")}
                      </Text>
                    )}
                    
                    {/* 重要なアドバイス */}
                    {slot.data!.clothing.tips.length > 0 && (
                      <Text fontSize="xs" color="orange.600" mt={1} fontWeight="medium">
                        💡 {slot.data!.clothing.tips[0]}
                      </Text>
                    )}
                  </Box>
                </VStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};