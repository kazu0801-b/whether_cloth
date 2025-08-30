"use client";

import { HStack, Heading, Icon, Box } from "@chakra-ui/react";
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
  onSettingsClick
}: HeaderProps) => {
  return (
    <HStack w="full" justify="space-between" minH="40px">
      {/* 左側：ホームボタン（天気表示時のみ） */}
      <Box>
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
      <Heading 
        size="xl" 
        textAlign="center" 
        color="gray.800"
        display="flex"
        alignItems="center"
        gap={3}
        flex="1"
      >
        <Icon as={MdOutlineWbSunny} color="orange.400" />
        天気に応じた服装提案アプリ
        <Icon as={MdOutlineCheckroom} color="blue.400" />
      </Heading>

      {/* 右側：設定ボタン */}
      <Box>
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