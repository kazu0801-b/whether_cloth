"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email,
        password,
      });

      localStorage.setItem("authToken", result.token);

      setMessage(result.message);

      router.push("/me");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      <Box
        w="full"
        maxW="420px"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">ログイン</Heading>
            <Text mt={2} color="gray.600" fontSize="sm">
              登録済みのメールアドレスでログインしてください
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>パスワード</FormLabel>
                <Input
                  type="password"
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="ログイン中..."
                w="full"
              >
                ログインする
              </Button>
            </VStack>
          </form>

          {message && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              {message}
            </Alert>
          )}

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Text textAlign="center" fontSize="sm" color="gray.600">
            アカウントをお持ちでない方は{" "}
            <Link as={NextLink} href="/signup" color="blue.500" fontWeight="bold">
              新規登録
            </Link>
          </Text>

          <Text textAlign="center" fontSize="sm">
            <Link as={NextLink} href="/" color="gray.500">
              トップページへ戻る
            </Link>
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}