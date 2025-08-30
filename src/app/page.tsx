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
  Image as ChakraImage,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { 
  BsWind, 
  BsThermometer,
  BsDropletHalf,
  BsEye,
  BsArrowRepeat,
  BsInfoCircle,
  BsSearch,
  BsHouseDoor
} from "react-icons/bs";
import { 
  MdOutlineWbSunny,
  MdOutlineCheckroom,
  MdOutlineBackpack,
  MdTipsAndUpdates,
  MdSchedule
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

interface ForecastData {
  list: Array<{
    dt: number;
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
  }>;
  city: {
    name: string;
  };
}

interface TimeSlotWeather {
  temp: number;
  weather: string;
  weatherMain: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface TimeBasedClothingAdvice {
  morning?: {
    weather: TimeSlotWeather;
    clothing: OutfitSuggestion;
    advice: string;
  };
  afternoon?: {
    weather: TimeSlotWeather;
    clothing: OutfitSuggestion;
    advice: string;
  };
  evening?: {
    weather: TimeSlotWeather;
    clothing: OutfitSuggestion;
    advice: string;
  };
  dayOverview: string;
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
  const [timeBasedAdvice, setTimeBasedAdvice] = useState<TimeBasedClothingAdvice | null>(null);
  const [cityName, setCityName] = useState("");

  const resetToHome = () => {
    setWeather(null);
    setTimeBasedAdvice(null);
    setError(null);
    setCityName("");
  };

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

  // 5日間予報データを取得
  const getForecastData = async (lat: number, lon: number): Promise<ForecastData> => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error("APIキーが設定されていません");
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;
    console.log("Forecast Request URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("予報データの取得に失敗しました");
    }

    return response.json();
  };

  // 今日の時間帯別データを抽出
  const getTodayHourlyData = (forecastData: ForecastData) => {
    const now = new Date();
    const today = now.toDateString();
    console.log("今日の日付:", today);
    
    const todayData = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      const itemDateString = itemDate.toDateString();
      console.log("予報データ:", itemDateString, "時間:", itemDate.getHours());
      return itemDateString === today || itemDateString === new Date(now.getTime() + 24*60*60*1000).toDateString();
    });
    
    console.log("フィルター後のデータ数:", todayData.length);
    return todayData;
  };

  // 朝・昼・夜の時間帯別天気データを抽出
  const getTimeBasedWeather = (hourlyData: ForecastData['list']) => {
    const timeSlots: {
      morning?: TimeSlotWeather;
      afternoon?: TimeSlotWeather;
      evening?: TimeSlotWeather;
    } = {};

    hourlyData.forEach(item => {
      const hour = new Date(item.dt * 1000).getHours();
      console.log(`時間: ${hour}時, 気温: ${item.main.temp}°C`);
      
      const weatherData: TimeSlotWeather = {
        temp: item.main.temp,
        weather: item.weather[0].description,
        weatherMain: item.weather[0].main.toLowerCase(),
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind?.speed || 0
      };

      if (hour >= 6 && hour < 12 && !timeSlots.morning) {
        console.log("朝の時間帯データを設定:", weatherData);
        timeSlots.morning = weatherData;
      } else if (hour >= 12 && hour < 18 && !timeSlots.afternoon) {
        console.log("昼の時間帯データを設定:", weatherData);
        timeSlots.afternoon = weatherData;
      } else if (hour >= 18 && hour < 24 && !timeSlots.evening) {
        console.log("夜の時間帯データを設定:", weatherData);
        timeSlots.evening = weatherData;
      }
    });

    return timeSlots;
  };

  // 時間帯特有のアドバイス生成
  const generateTimeSpecificAdvice = (timeSlot: string, temp: number, weatherType: string): string => {
    type AdviceMapType = {
      [key: string]: {
        cold?: string;
        warm?: string;
        hot?: string;
        comfortable?: string;
        rainy?: string;
        cool?: string;
      };
    };

    const adviceMap: AdviceMapType = {
      morning: {
        cold: '朝は冷え込みます。温かい服装で出かけましょう',
        warm: '朝から暖かいですが、日中さらに暑くなる可能性があります',
        rainy: '朝から雨模様。傘を忘れずに'
      },
      afternoon: {
        hot: '日中は暑くなります。熱中症対策を忘れずに',
        comfortable: '過ごしやすい気温です',
        rainy: '午後は雨が予想されます'
      },
      evening: {
        cool: '夜は冷え込みます。羽織るものを用意しましょう',
        warm: '夜も暖かく過ごしやすそうです',
        rainy: '夜まで雨が続きそうです'
      }
    };

    const slotAdvice = adviceMap[timeSlot];
    if (!slotAdvice) return '';

    // 温度と天気に基づいてアドバイスを選択
    if (weatherType.includes('rain')) {
      return slotAdvice.rainy || '';
    }
    if (temp > 25) {
      return slotAdvice.hot || slotAdvice.warm || '';
    }
    if (temp < 15) {
      return slotAdvice.cold || slotAdvice.cool || '';
    }
    return slotAdvice.comfortable || '';
  };

  // 1日全体の概要生成
  const generateDayOverview = (timeBasedWeather: Record<string, TimeSlotWeather | undefined>): string => {
    const temps = Object.values(timeBasedWeather)
      .filter((w): w is TimeSlotWeather => w !== undefined)
      .map(w => w.temp);
    
    if (temps.length === 0) return '';
    
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempDiff = maxTemp - minTemp;

    if (tempDiff > 10) {
      return `今日は朝晩と日中の気温差が${Math.round(tempDiff)}度あります。重ね着で調整できる服装がおすすめです。`;
    } else if (tempDiff > 5) {
      return `今日は適度な気温変化があります。軽い羽織りものがあると便利です。`;
    } else {
      return `今日は1日を通して安定した気温です。`;
    }
  };

  // 時間帯別服装提案の生成
  const generateTimeBasedClothingAdvice = (timeBasedWeather: Record<string, TimeSlotWeather | undefined>): TimeBasedClothingAdvice => {
    const advice: TimeBasedClothingAdvice = {
      dayOverview: generateDayOverview(timeBasedWeather)
    };

    // 各時間帯の服装提案
    Object.entries(timeBasedWeather).forEach(([timeSlot, weather]) => {
      if (weather && typeof weather === 'object' && 'temp' in weather) {
        const weatherData = weather as TimeSlotWeather;
        const mockWeatherData = {
          main: {
            temp: weatherData.temp,
            feels_like: weatherData.temp,
            humidity: weatherData.humidity
          },
          weather: [{
            main: weatherData.weatherMain,
            description: weatherData.weather,
            icon: weatherData.icon
          }],
          wind: {
            speed: weatherData.windSpeed
          },
          name: ''
        };

        const clothing = getOutfitSuggestion(mockWeatherData);
        const timeAdvice = generateTimeSpecificAdvice(timeSlot, weatherData.temp, weatherData.weatherMain);

        if (timeSlot === 'morning') {
          advice.morning = {
            weather: weatherData,
            clothing: clothing,
            advice: timeAdvice
          };
        } else if (timeSlot === 'afternoon') {
          advice.afternoon = {
            weather: weatherData,
            clothing: clothing,
            advice: timeAdvice
          };
        } else if (timeSlot === 'evening') {
          advice.evening = {
            weather: weatherData,
            clothing: clothing,
            advice: timeAdvice
          };
        }
      }
    });

    return advice;
  };

  const getCurrentWeather = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error("APIキーが設定されていません");
    }

    console.log("Using API Key:", API_KEY);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`;
    console.log("Request URL:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("天気データの取得に失敗しました");
    }

    return response.json();
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);

    // HTTPS要件チェック
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setError("位置情報の取得にはHTTPS接続が必要です。localhostまたはHTTPS環境でアクセスしてください。");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報をサポートしていません");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000 // 10分間キャッシュを許可
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log("位置情報取得成功:", position.coords.latitude, position.coords.longitude);
          
          // 現在の天気データを取得
          const weatherData = await getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log("現在の天気データ取得成功:", weatherData);
          setWeather(weatherData);

          // 予報データを取得して時間帯別提案を生成
          try {
            console.log("予報データを取得中...");
            const forecastData = await getForecastData(
              position.coords.latitude,
              position.coords.longitude
            );
            console.log("予報データ取得成功:", forecastData);
            
            const todayHourly = getTodayHourlyData(forecastData);
            console.log("今日の時間別データ:", todayHourly);
            
            const timeBasedWeather = getTimeBasedWeather(todayHourly);
            console.log("時間帯別天気:", timeBasedWeather);
            
            const timeBasedClothing = generateTimeBasedClothingAdvice(timeBasedWeather);
            console.log("時間帯別服装提案:", timeBasedClothing);
            
            setTimeBasedAdvice(timeBasedClothing);
          } catch (forecastError) {
            console.error("予報データの取得に失敗しました:", forecastError);
            // 予報データの取得に失敗しても現在の天気は表示する
          }
        } catch (err) {
          console.error("天気データ取得エラー:", err);
          setError(err instanceof Error ? err.message : "エラーが発生しました");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("位置情報取得エラー:", error);
        console.error("エラーコード:", error.code);
        console.error("エラーメッセージ:", error.message);
        console.error("エラー詳細:", {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        
        let errorMessage = "位置情報の取得に失敗しました";
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "位置情報の使用が拒否されました。ブラウザのアドレスバー左側の🔒アイコンをクリックして位置情報を許可してください。";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "位置情報が取得できませんでした。GPS機能やWi-Fi接続を確認するか、下記の手動入力をお試しください。";
            break;
          case 3: // TIMEOUT
            errorMessage = "位置情報の取得がタイムアウトしました。しばらく時間をおいて再試行してください。";
            break;
          default:
            errorMessage = `位置情報の取得に失敗しました（エラーコード: ${error.code}）`;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const getWeatherByCity = async () => {
    if (!cityName.trim()) {
      setError("都市名を入力してください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        throw new Error("APIキーが設定されていません");
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=ja`;
      console.log("City Weather Request URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("都市が見つかりませんでした。正しい都市名を入力してください。");
      }

      const weatherData = await response.json();
      console.log("都市別天気データ取得成功:", weatherData);
      setWeather(weatherData);

      // 予報データも取得
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=ja`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          const todayHourly = getTodayHourlyData(forecastData);
          const timeBasedWeather = getTimeBasedWeather(todayHourly);
          const timeBasedClothing = generateTimeBasedClothingAdvice(timeBasedWeather);
          setTimeBasedAdvice(timeBasedClothing);
        }
      } catch (forecastError) {
        console.error("予報データの取得に失敗しました:", forecastError);
      }
    } catch (err) {
      console.error("都市別天気取得エラー:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
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
              cursor={weather ? "pointer" : "default"}
              onClick={weather ? resetToHome : undefined}
              _hover={weather ? { color: "blue.600", transform: "scale(1.02)" } : {}}
              transition="all 0.2s"
              position="relative"
            >
              <Icon as={MdOutlineWbSunny} color="orange.400" />
              天気に応じた服装提案アプリ
              <Icon as={MdOutlineCheckroom} color="blue.400" />
              {weather && (
                <Icon 
                  as={BsHouseDoor} 
                  color="gray.500" 
                  boxSize={4}
                  position="absolute"
                  top="-8px"
                  right="-8px"
                />
              )}
            </Heading>

            {!weather && !loading && (
              <VStack spacing={6}>
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
                
                <Box w="full" maxW="400px">
                  <Text mb={2} textAlign="center" color="gray.600" fontSize="sm">
                    または都市名で検索
                  </Text>
                  <HStack>
                    <InputGroup>
                      <Input
                        placeholder="都市名を入力（例：Tokyo, 東京）"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && getWeatherByCity()}
                        bg="white"
                        borderColor="gray.300"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{ borderColor: "blue.500", shadow: "outline" }}
                      />
                    </InputGroup>
                    <Button
                      onClick={getWeatherByCity}
                      colorScheme="green"
                      leftIcon={<Icon as={BsSearch} />}
                      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                      transition="all 0.2s"
                    >
                      検索
                    </Button>
                  </HStack>
                </Box>
              </VStack>
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
                  <AlertIcon />
                  {error}
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
                  <Box bg="green.50" borderRadius="xl" p={6} w="full">
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

                  {/* 時間帯別服装提案 */}
                  {timeBasedAdvice && (
                    <Box bg="purple.50" borderRadius="xl" p={6} w="full">
                      <VStack spacing={6}>
                        <Heading 
                          size="lg" 
                          textAlign="center" 
                          color="gray.800"
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Icon as={MdSchedule} color="purple.500" />
                          時間帯別服装提案
                        </Heading>
                        
                        {/* 1日の概要 */}
                        {timeBasedAdvice.dayOverview && (
                          <Alert 
                            status="info" 
                            borderRadius="lg" 
                            bg="blue.50" 
                            border="1px" 
                            borderColor="blue.200"
                          >
                            <Icon as={BsInfoCircle} color="blue.500" mr={2} />
                            <Text color="blue.800">{timeBasedAdvice.dayOverview}</Text>
                          </Alert>
                        )}

                        {/* 時間帯別詳細 */}
                        <Grid templateColumns="repeat(auto-fit, minmax(320px, 1fr))" gap={4} w="full">
                          {/* 朝 */}
                          {timeBasedAdvice.morning && (
                            <GridItem>
                              <Box bg="white" borderRadius="lg" p={5} h="full" shadow="md">
                                <VStack spacing={4} align="stretch">
                                  <HStack justify="space-between">
                                    <HStack>
                                      <Text fontSize="2xl">🌅</Text>
                                      <Heading size="md" color="orange.600">朝 (6:00-12:00)</Heading>
                                    </HStack>
                                    <Text fontSize="lg" fontWeight="bold" color="orange.600">
                                      {Math.round(timeBasedAdvice.morning.weather.temp)}°C
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <ChakraImage
                                      src={`https://openweathermap.org/img/wn/${timeBasedAdvice.morning.weather.icon}@2x.png`}
                                      alt={timeBasedAdvice.morning.weather.weather}
                                      boxSize="40px"
                                    />
                                    <Text fontSize="sm" color="gray.600">
                                      {timeBasedAdvice.morning.weather.weather}
                                    </Text>
                                  </HStack>

                                  <VStack spacing={3} align="stretch">
                                    {timeBasedAdvice.morning.clothing.mainClothing.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>基本アイテム</Text>
                                        <Wrap>
                                          {timeBasedAdvice.morning.clothing.mainClothing.map((item, idx) => (
                                            <Badge key={idx} colorScheme="blue" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.morning.clothing.outerwear.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>アウター</Text>
                                        <Wrap>
                                          {timeBasedAdvice.morning.clothing.outerwear.map((item, idx) => (
                                            <Badge key={idx} colorScheme="green" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.morning.clothing.accessories.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>小物</Text>
                                        <Wrap>
                                          {timeBasedAdvice.morning.clothing.accessories.map((item, idx) => (
                                            <Badge key={idx} colorScheme="yellow" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}
                                  </VStack>

                                  {timeBasedAdvice.morning.advice && (
                                    <Text fontSize="sm" color="gray.600" fontStyle="italic" bg="orange.50" p={2} borderRadius="md">
                                      {timeBasedAdvice.morning.advice}
                                    </Text>
                                  )}
                                </VStack>
                              </Box>
                            </GridItem>
                          )}

                          {/* 昼 */}
                          {timeBasedAdvice.afternoon && (
                            <GridItem>
                              <Box bg="white" borderRadius="lg" p={5} h="full" shadow="md">
                                <VStack spacing={4} align="stretch">
                                  <HStack justify="space-between">
                                    <HStack>
                                      <Text fontSize="2xl">☀️</Text>
                                      <Heading size="md" color="yellow.600">昼 (12:00-18:00)</Heading>
                                    </HStack>
                                    <Text fontSize="lg" fontWeight="bold" color="yellow.600">
                                      {Math.round(timeBasedAdvice.afternoon.weather.temp)}°C
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <ChakraImage
                                      src={`https://openweathermap.org/img/wn/${timeBasedAdvice.afternoon.weather.icon}@2x.png`}
                                      alt={timeBasedAdvice.afternoon.weather.weather}
                                      boxSize="40px"
                                    />
                                    <Text fontSize="sm" color="gray.600">
                                      {timeBasedAdvice.afternoon.weather.weather}
                                    </Text>
                                  </HStack>

                                  <VStack spacing={3} align="stretch">
                                    {timeBasedAdvice.afternoon.clothing.mainClothing.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>基本アイテム</Text>
                                        <Wrap>
                                          {timeBasedAdvice.afternoon.clothing.mainClothing.map((item, idx) => (
                                            <Badge key={idx} colorScheme="blue" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.afternoon.clothing.outerwear.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>アウター</Text>
                                        <Wrap>
                                          {timeBasedAdvice.afternoon.clothing.outerwear.map((item, idx) => (
                                            <Badge key={idx} colorScheme="green" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.afternoon.clothing.accessories.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>小物</Text>
                                        <Wrap>
                                          {timeBasedAdvice.afternoon.clothing.accessories.map((item, idx) => (
                                            <Badge key={idx} colorScheme="yellow" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}
                                  </VStack>

                                  {timeBasedAdvice.afternoon.advice && (
                                    <Text fontSize="sm" color="gray.600" fontStyle="italic" bg="yellow.50" p={2} borderRadius="md">
                                      {timeBasedAdvice.afternoon.advice}
                                    </Text>
                                  )}
                                </VStack>
                              </Box>
                            </GridItem>
                          )}

                          {/* 夜 */}
                          {timeBasedAdvice.evening && (
                            <GridItem>
                              <Box bg="white" borderRadius="lg" p={5} h="full" shadow="md">
                                <VStack spacing={4} align="stretch">
                                  <HStack justify="space-between">
                                    <HStack>
                                      <Text fontSize="2xl">🌙</Text>
                                      <Heading size="md" color="indigo.600">夜 (18:00-24:00)</Heading>
                                    </HStack>
                                    <Text fontSize="lg" fontWeight="bold" color="indigo.600">
                                      {Math.round(timeBasedAdvice.evening.weather.temp)}°C
                                    </Text>
                                  </HStack>
                                  
                                  <HStack>
                                    <ChakraImage
                                      src={`https://openweathermap.org/img/wn/${timeBasedAdvice.evening.weather.icon}@2x.png`}
                                      alt={timeBasedAdvice.evening.weather.weather}
                                      boxSize="40px"
                                    />
                                    <Text fontSize="sm" color="gray.600">
                                      {timeBasedAdvice.evening.weather.weather}
                                    </Text>
                                  </HStack>

                                  <VStack spacing={3} align="stretch">
                                    {timeBasedAdvice.evening.clothing.mainClothing.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>基本アイテム</Text>
                                        <Wrap>
                                          {timeBasedAdvice.evening.clothing.mainClothing.map((item, idx) => (
                                            <Badge key={idx} colorScheme="blue" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.evening.clothing.outerwear.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>アウター</Text>
                                        <Wrap>
                                          {timeBasedAdvice.evening.clothing.outerwear.map((item, idx) => (
                                            <Badge key={idx} colorScheme="green" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}

                                    {timeBasedAdvice.evening.clothing.accessories.length > 0 && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="bold" mb={1}>小物</Text>
                                        <Wrap>
                                          {timeBasedAdvice.evening.clothing.accessories.map((item, idx) => (
                                            <Badge key={idx} colorScheme="yellow" fontSize="xs" p={1}>
                                              {item}
                                            </Badge>
                                          ))}
                                        </Wrap>
                                      </Box>
                                    )}
                                  </VStack>

                                  {timeBasedAdvice.evening.advice && (
                                    <Text fontSize="sm" color="gray.600" fontStyle="italic" bg="indigo.50" p={2} borderRadius="md">
                                      {timeBasedAdvice.evening.advice}
                                    </Text>
                                  )}
                                </VStack>
                              </Box>
                            </GridItem>
                          )}
                        </Grid>
                      </VStack>
                    </Box>
                  )}

                  <Center>
                    <HStack spacing={4}>
                      <Button
                        onClick={resetToHome}
                        colorScheme="blue"
                        variant="outline"
                        size="lg"
                        leftIcon={<Icon as={BsHouseDoor} />}
                        _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                        transition="all 0.2s"
                      >
                        トップページに戻る
                      </Button>
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
                    </HStack>
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