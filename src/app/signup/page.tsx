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
import { signup } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
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
      const result = await signup({
        username,
        email,
        password,
      });

      setMessage(result);

      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("signup failed");
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
            <Heading size="lg">新規登録</Heading>
            <Text mt={2} color="gray.600" fontSize="sm">
              アカウントを作成してログイン機能を利用できます
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>ユーザー名</FormLabel>
                <Input
                  placeholder="testuser"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

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
                  placeholder="8文字以上を推奨"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
                loadingText="登録中..."
                w="full"
              >
                登録する
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
            すでにアカウントをお持ちの方は{" "}
            <Link as={NextLink} href="/login" color="blue.500" fontWeight="bold">
              ログイン
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