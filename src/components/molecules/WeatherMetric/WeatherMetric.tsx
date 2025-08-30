"use client";

import { Box, Heading, Text, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface WeatherMetricProps {
  icon: IconType;
  iconColor: string;
  value: string | number;
  unit: string;
  label: string;
}

export const WeatherMetric = ({
  icon,
  iconColor,
  value,
  unit,
  label
}: WeatherMetricProps) => {
  return (
    <Box bg="white" borderRadius="lg" shadow="sm" p={4} textAlign="center">
      <Icon as={icon} color={iconColor} boxSize={6} mb={2} />
      <Heading size="lg" color="blue.600">
        {value}{unit}
      </Heading>
      <Text fontSize="sm" color="gray.500">{label}</Text>
    </Box>
  );
};