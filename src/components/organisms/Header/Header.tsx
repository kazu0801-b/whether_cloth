"use client";

import { HStack, Heading, Icon, Box, Text, VStack } from "@chakra-ui/react";
import { BsHouseDoor, BsGear } from "react-icons/bs";
import { MdOutlineWbSunny, MdOutlineCheckroom } from "react-icons/md";
import { Button } from "../../atoms";

interface HeaderProps {
  showHomeButton?: boolean;
  onHomeClick?: () => void;
  onSettingsClick?: () => void;
}

export const Header = ({
  showHomeButton = false,
  onHomeClick,
  onSettingsClick,
}: HeaderProps) => {
  return (
    <HStack
      w="full"
      justify="space-between"
      align="center"
      minH="40px"
      gap={{ base: 2, md: 4 }}
    >
      {/* 左側：ホームボタン（天気表示時のみ） */}
      <Box minW={{ base: "64px", md: "88px" }}>
        {showHomeButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHomeClick}
            leftIcon={BsHouseDoor}
            colorScheme="blue"
          >
            ホーム
          </Button>
        )}
      </Box>

      {/* 中央：タイトル */}
      <HStack
        as="header"
        flex="1"
        justify="center"
        align="center"
        spacing={{ base: 2, md: 3 }}
        minW={0}
      >
        <Icon
          as={MdOutlineWbSunny}
          color="orange.400"
          boxSize={{ base: 6, md: 9 }}
          flexShrink={0}
        />

        <Heading
          as="h1"
          textAlign="center"
          color="gray.800"
          fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
          lineHeight={{ base: "1.25", md: "1.2" }}
          letterSpacing="tight"
          wordBreak="keep-all"
          whiteSpace={{ base: "normal", md: "normal" }}
        >
          <VStack as="span" spacing={0} display="inline-flex">
            <Text as="span">天気に応じた服装</Text>
            <Text as="span">提案アプリ</Text>
          </VStack>
        </Heading>

        <Icon
          as={MdOutlineCheckroom}
          color="blue.400"
          boxSize={{ base: 6, md: 9 }}
          flexShrink={0}
        />
      </HStack>

      {/* 右側：設定ボタン */}
      <Box minW={{ base: "64px", md: "88px" }} textAlign="right">
        <Button
          variant="outline"
          size="sm"
          onClick={onSettingsClick}
          leftIcon={BsGear}
          colorScheme="gray"
        >
          設定
        </Button>
      </Box>
    </HStack>
  );
};