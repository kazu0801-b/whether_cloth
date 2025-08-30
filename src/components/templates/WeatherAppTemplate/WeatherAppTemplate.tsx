"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface WeatherAppTemplateProps {
  children: ReactNode;
}

export const WeatherAppTemplate = ({ children }: WeatherAppTemplateProps) => {
  const bgGradient = "linear(to-b, blue.400, blue.600)";

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="2xl" centerContent>
        <Box bg="white" shadow="2xl" borderRadius="xl" p={8} w="full">
          <VStack spacing={8}>
            {children}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};