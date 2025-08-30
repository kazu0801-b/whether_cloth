"use client";

import { HStack, InputGroup, Text, Box } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { Input, Button } from "../../atoms";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchForm = ({
  value,
  onChange,
  onSubmit,
  placeholder = "例：新宿区, 横浜市, 札幌市, 大阪府堺市, 神奈川県川崎市, Shibuya, Kyoto",
  isLoading = false
}: SearchFormProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <Box w="full" maxW="400px">
      <Text mb={2} textAlign="center" color="gray.600" fontSize="sm">
        または都市名・県名・市区町村で検索
      </Text>
      <HStack>
        <InputGroup>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </InputGroup>
        <Button
          onClick={onSubmit}
          colorScheme="green"
          leftIcon={BsSearch}
          disabled={isLoading}
        >
          検索
        </Button>
      </HStack>
    </Box>
  );
};