"use client";

import { Box, VStack, HStack, Heading, Text, Grid, GridItem } from "@chakra-ui/react";
import { BsThermometer, BsDropletHalf, BsWind, BsCloudRain } from "react-icons/bs";
import { WeatherIcon } from "../../atoms";
import { WeatherMetric } from "../../molecules";
import { WeatherData } from "../../../types/weather";

interface WeatherDisplayProps {
  weather: WeatherData;
}

export const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const windSpeedKmh = (weather.wind?.speed || 0) * 3.6;

  return (
    <Box bg="blue.50" borderRadius="xl" p={6} w="full">
      <VStack spacing={6}>
        <HStack spacing={4} justify="center">
          <WeatherIcon
            icon={weather.weather[0].icon}
            alt={weather.weather[0].description}
          />
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.800">
              {weather.name}
            </Heading>
            <Text color="gray.600" fontSize="md">
              {weather.weather[0].description}
            </Text>
          </VStack>
        </HStack>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
          <GridItem>
            <WeatherMetric
              icon={BsThermometer}
              iconColor="red.500"
              value={Math.round(weather.main.temp)}
              unit="℃"
              label="気温"
            />
          </GridItem>
          <GridItem>
            <WeatherMetric
              icon={BsThermometer}
              iconColor="orange.500"
              value={Math.round(weather.main.feels_like)}
              unit="℃"
              label="体感温度"
            />
          </GridItem>
          <GridItem>
            <WeatherMetric
              icon={BsDropletHalf}
              iconColor="blue.500"
              value={weather.main.humidity}
              unit="%"
              label="湿度"
            />
          </GridItem>
          <GridItem>
            <WeatherMetric
              icon={BsWind}
              iconColor="gray.500"
              value={Math.round(windSpeedKmh)}
              unit="km/h"
              label="風速"
            />
          </GridItem>
          {weather.pop !== undefined && (
            <GridItem colSpan={2}>
              <WeatherMetric
                icon={BsCloudRain}
                iconColor="blue.600"
                value={weather.pop}
                unit="%"
                label="降水確率"
              />
            </GridItem>
          )}
        </Grid>
      </VStack>
    </Box>
  );
};