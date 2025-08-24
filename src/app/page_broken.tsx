"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Wrap,
  WrapItem,
  Icon,
  Flex,
  Center,
  Image as ChakraImage
} from "@chakra-ui/react";
import { 
  BsWind, 
  BsThermometer,
  BsDropletHalf,
  BsEye,
  BsArrowRepeat,
  BsInfoCircle
} from "react-icons/bs";
import { 
  MdOutlineWbSunny,
  MdOutlineCheckroom,
  MdOutlineBackpack,
  MdTipsAndUpdates
} from "react-icons/md";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

interface OutfitSuggestion {
  mainClothing: string[];
  outerwear: string[];
  accessories: string[];
  footwear: string[];
  tips: string[];
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOutfitSuggestion = (weatherData: WeatherData): OutfitSuggestion => {
    const { temp, humidity } = weatherData.main;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind?.speed || 0;
    const windSpeedKmh = windSpeed * 3.6; // m/s to km/h

    const suggestion: OutfitSuggestion = {
      mainClothing: [],
      outerwear: [],
      accessories: [],
      footwear: [],
      tips: []
    };

    // 基本服装（気温ベース）
    if (temp >= 30) {
      suggestion.mainClothing = ["半袖Tシャツ", "ショートパンツ", "ワンピース"];
      suggestion.footwear = ["サンダル", "スニーカー"];
      suggestion.accessories = ["帽子", "サングラス"];
      suggestion.tips = ["熱中症に注意", "水分補給を忘れずに"];
    } else if (temp >= 25) {
      suggestion.mainClothing = ["半袖Tシャツ", "薄手のパンツ", "スカート"];
      suggestion.footwear = ["スニーカー", "パンプス"];
      suggestion.accessories = ["キャップ"];
      suggestion.tips = ["日焼け対策をお忘れなく"];
    } else if (temp >= 20) {
      suggestion.mainClothing = ["長袖シャツ", "カットソー"];
      suggestion.outerwear = ["カーディガン", "薄手のジャケット"];
      suggestion.footwear = ["スニーカー", "ローファー"];
      suggestion.tips = ["朝晩は涼しくなる可能性があります"];
    } else if (temp >= 15) {
      suggestion.mainClothing = ["長袖シャツ", "薄手のセーター"];
      suggestion.outerwear = ["ジャケット", "トレンチコート"];
      suggestion.footwear = ["革靴", "ブーツ"];
      suggestion.tips = ["羽織りものがあると安心です"];
    } else if (temp >= 10) {
      suggestion.mainClothing = ["厚手のシャツ", "セーター", "ニット"];
      suggestion.outerwear = ["コート", "厚手のジャケット"];
      suggestion.footwear = ["ブーツ", "革靴"];
      suggestion.accessories = ["マフラー"];
      suggestion.tips = ["しっかりとした防寒対策を"];
    } else if (temp >= 5) {
      suggestion.mainClothing = ["厚手のセーター", "タートルネック"];
      suggestion.outerwear = ["冬用コート", "ウールコート"];
      suggestion.accessories = ["マフラー", "手袋", "ニット帽"];
      suggestion.footwear = ["ブーツ", "防寒靴"];
      suggestion.tips = ["首・手首・足首を温めましょう"];
    } else {
      suggestion.mainClothing = ["厚手のインナー", "セーター", "フリース"];
      suggestion.outerwear = ["ダウンジャケット", "厚手のコート"];
      suggestion.accessories = ["厚手のマフラー", "手袋", "ニット帽"];
      suggestion.footwear = ["防寒ブーツ", "ムートンブーツ"];
      suggestion.tips = ["しっかりとした防寒対策が必要です", "カイロの使用もおすすめ"];
    }

    // 天気による調整
    if (weatherMain.includes('rain')) {
      suggestion.accessories.push("傘", "レインハット");
      suggestion.footwear = suggestion.footwear.map(item => 
        item.includes("サンダル") ? "防水シューズ" : `防水${item}`
      );
      suggestion.outerwear.push("レインコート");
      suggestion.tips.push("雨に濡れないよう注意してください");
    }

    if (weatherMain.includes('snow')) {
      suggestion.accessories.push("手袋", "ニット帽", "マフラー");
      suggestion.footwear = ["防雪ブーツ", "滑り止め付きブーツ"];
      suggestion.outerwear = ["ダウンジャケット", "防水コート"];
      suggestion.tips.push("路面の凍結に注意", "滑りにくい靴を選びましょう");
    }

    if (weatherMain.includes('clear') && temp >= 20) {
      suggestion.accessories.push("日焼け止め", "サングラス");
      suggestion.tips.push("紫外線対策をお忘れなく");
    }

    // 湿度による調整
    if (humidity >= 70) {
      suggestion.tips.push("湿度が高いため、通気性の良い服装がおすすめ");
      suggestion.mainClothing = suggestion.mainClothing.map(item => 
        `通気性の良い${item}`
      );
    } else if (humidity <= 30) {
      suggestion.tips.push("乾燥しているため保湿対策を", "のどが渇きやすいので水分補給を");
      suggestion.accessories.push("マスク", "保湿クリーム");
    }

    // 風速による調整
    if (windSpeedKmh >= 20) {
      suggestion.outerwear.push("ウィンドブレーカー", "フード付きジャケット");
      suggestion.tips.push("強風のため、傘が使いづらい可能性があります");
      suggestion.accessories = suggestion.accessories.filter(item => item !== "帽子");
      suggestion.tips.push("帽子は飛ばされる可能性があります");
    } else if (windSpeedKmh >= 10) {
      suggestion.tips.push("やや風が強いため、軽い羽織りものがあると安心");
    }

    return suggestion;
  };

  const getCurrentWeather = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error("APIキーが設定されていません");
    }

    console.log("Using API Key:", API_KEY); // デバッグ用
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;
    console.log("Request URL:", url); // デバッグ用
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("天気データの取得に失敗しました");
    }

    return response.json();
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報をサポートしていません");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weatherData = await getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(weatherData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "エラーが発生しました");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("位置情報の取得に失敗しました");
        setLoading(false);
      }
    );
  };

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
              <Heading 
                size="xl" 
                textAlign="center" 
                color="gray.800"
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Icon as={MdOutlineWbSunny} color="orange.400" />
                天気に応じた服装提案アプリ
                <Icon as={MdOutlineCheckroom} color="blue.400" />
              </Heading>

              {!weather && !loading && (
                <Center>
                  <Button
                    onClick={getLocation}
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<Icon as={BsEye} />}
                    _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                    transition="all 0.2s"
                  >
                    現在地の天気を取得
                  </Button>
                </Center>
              )}

              {loading && (
                <VStack spacing={4}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text color="gray.600" fontSize="lg">天気情報を取得中...</Text>
                </VStack>
              )}

              {error && (
                <VStack spacing={4}>
                  <Alert status="error" borderRadius="lg">
                    <Icon as={BsInfoCircle} color="red.500" mr={2} />
                    <Text>{error}</Text>
                  </Alert>
                  <Button
                    onClick={getLocation}
                    colorScheme="blue"
                    leftIcon={<Icon as={BsArrowRepeat} />}
                  >
                    再試行
                  </Button>
                </VStack>
              )}

              {weather && (() => {
                const outfitSuggestion = getOutfitSuggestion(weather);
                const windSpeedKmh = (weather.wind?.speed || 0) * 3.6;
                
                return (
                  <VStack spacing={8} w="full">
                    {/* 天気情報 */}
                    <Box bg="blue.50" borderRadius="xl" p={6} w="full">
                        <VStack spacing={6}>
                          <HStack spacing={4} justify="center">
                            <ChakraImage
                              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                              alt={weather.weather[0].description}
                              boxSize="80px"
                              borderRadius="lg"
                              bg="white"
                              p={2}
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
                              <Box bg="white" borderRadius="lg" shadow="sm" p={4} textAlign="center">
                                  <Icon as={BsThermometer} color="red.500" boxSize={6} mb={2} />
                                  <Heading size="lg" color="blue.600">
                                    {Math.round(weather.main.temp)}℃
                                  </Heading>
                                  <Text fontSize="sm" color="gray.500">気温</Text>
                              </Box>
                            </GridItem>
                            <GridItem>
                              <Box bg="white" borderRadius="lg" shadow="sm" p={4} textAlign="center">
                                  <Icon as={BsThermometer} color="orange.500" boxSize={6} mb={2} />
                                  <Heading size="lg" color="blue.600">
                                    {Math.round(weather.main.feels_like)}℃
                                  </Heading>
                                  <Text fontSize="sm" color="gray.500">体感温度</Text>
                              </Box>
                            </GridItem>
                            <GridItem>
                              <Box bg="white" borderRadius="lg" shadow="sm" p={4} textAlign="center">
                                  <Icon as={BsDropletHalf} color="blue.500" boxSize={6} mb={2} />
                                  <Heading size="lg" color="blue.600">
                                    {weather.main.humidity}%
                                  </Heading>
                                  <Text fontSize="sm" color="gray.500">湿度</Text>
                              </Box>
                            </GridItem>
                            <GridItem>
                              <Box bg="white" borderRadius="lg" shadow="sm" p={4} textAlign="center">
                                  <Icon as={BsWind} color="gray.500" boxSize={6} mb={2} />
                                  <Heading size="lg" color="blue.600">
                                    {Math.round(windSpeedKmh)}
                                  </Heading>
                                  <Text fontSize="sm" color="gray.500">風速(km/h)</Text>
                              </Box>
                            </GridItem>
                          </Grid>
                        </VStack>
                    </Box>

                    {/* 服装提案 */}
                    <Card w="full" bg="green.50" borderRadius="xl">
                      <CardBody>
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
                            {outfitSuggestion.mainClothing.length > 0 && (
                              <Box bg="white" borderRadius="lg" p={4} w="full">
                                  <HStack mb={3}>
                                    <Icon as={MdOutlineCheckroom} color="blue.500" />
                                    <Heading size="sm" color="gray.800">基本アイテム</Heading>
                                  </HStack>
                                  <Wrap>
                                    {outfitSuggestion.mainClothing.map((item, index) => (
                                      <WrapItem key={index}>
                                        <Badge colorScheme="blue" p={2} borderRadius="full">
                                          {item}
                                        </Badge>
                                      </WrapItem>
                                    ))}
                                  </Wrap>
                              </Box>
                            )}

                            {outfitSuggestion.outerwear.length > 0 && (
                              <Box bg="white" borderRadius="lg" p={4} w="full">
                                  <HStack mb={3}>
                                    <Text fontSize="lg">🧥</Text>
                                    <Heading size="sm" color="gray.800">アウター</Heading>
                                  </HStack>
                                  <Wrap>
                                    {outfitSuggestion.outerwear.map((item, index) => (
                                      <WrapItem key={index}>
                                        <Badge colorScheme="green" p={2} borderRadius="full">
                                          {item}
                                        </Badge>
                                      </WrapItem>
                                    ))}
                                  </Wrap>
                              </Box>
                            )}

                            {outfitSuggestion.footwear.length > 0 && (
                              <Box bg="white" borderRadius="lg" p={4} w="full">
                                  <HStack mb={3}>
                                    <Text fontSize="lg">👟</Text>
                                    <Heading size="sm" color="gray.800">履物</Heading>
                                  </HStack>
                                  <Wrap>
                                    {outfitSuggestion.footwear.map((item, index) => (
                                      <WrapItem key={index}>
                                        <Badge colorScheme="purple" p={2} borderRadius="full">
                                          {item}
                                        </Badge>
                                      </WrapItem>
                                    ))}
                                  </Wrap>
                              </Box>
                            )}

                            {outfitSuggestion.accessories.length > 0 && (
                              <Box bg="white" borderRadius="lg" p={4} w="full">
                                  <HStack mb={3}>
                                    <Icon as={MdOutlineBackpack} color="yellow.600" />
                                    <Heading size="sm" color="gray.800">アクセサリー・小物</Heading>
                                  </HStack>
                                  <Wrap>
                                    {outfitSuggestion.accessories.map((item, index) => (
                                      <WrapItem key={index}>
                                        <Badge colorScheme="yellow" p={2} borderRadius="full">
                                          {item}
                                        </Badge>
                                      </WrapItem>
                                    ))}
                                  </Wrap>
                              </Box>
                            )}

                            {outfitSuggestion.tips.length > 0 && (
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
                                    {outfitSuggestion.tips.map((tip, index) => (
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

                    <Center>
                      <Button
                        onClick={getLocation}
                        colorScheme="gray"
                        size="lg"
                        leftIcon={<Icon as={BsArrowRepeat} />}
                        _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                        transition="all 0.2s"
                      >
                        更新
                      </Button>
                    </Center>
                  </VStack>
                );
              })()}
            </VStack>
        </Box>
      </Container>
    </Box>
  );
}
