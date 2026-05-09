"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { BsEye, BsArrowRepeat, BsGear } from "react-icons/bs";
import { 
  WeatherAppTemplate,
  Header,
  WeatherDisplay,
  ClothingSuggestion,
  TimeBasedClothingAdvice,
  SearchForm,
  Button,
  Input
} from "../components";
import { useWeatherLogic } from "../hooks/useWeatherLogic";
import { WeatherData, TimeBasedClothingAdvice as TimeBasedAdviceType } from "../types/weather";

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [timeBasedAdvice, setTimeBasedAdvice] = useState<TimeBasedAdviceType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [tempApiKey, setTempApiKey] = useState<string>("");
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    convertToJapaneseName,
    getOutfitSuggestion,
    getCurrentWeather,
    getWeatherByCity,
    getForecastData,
    getForecastByCity,
    generateTimeBasedClothingAdvice,
    getCurrentPrecipitationProbability,
  } = useWeatherLogic(apiKey);

  // ローカルストレージからAPIキーを読み込み
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openweather_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsFirstTime(false);
    } else {
      setIsFirstTime(true);
    }
  }, []);

  // APIキー設定関数
  const saveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast({
        title: "エラー",
        description: "APIキーを入力してください",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 簡易的なAPIキー形式チェック（英数字32文字）
    if (!/^[a-zA-Z0-9]{32}$/.test(tempApiKey.trim())) {
      toast({
        title: "エラー",
        description: "OpenWeatherMap APIキーは32文字の英数字である必要があります",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    localStorage.setItem('openweather_api_key', tempApiKey.trim());
    setApiKey(tempApiKey.trim());
    setIsFirstTime(false);
    onClose();
    setTempApiKey("");
    
    toast({
      title: "設定完了",
      description: "APIキーが正常に保存されました",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const openSettings = () => {
    setTempApiKey(apiKey);
    onOpen();
  };

  const resetToHome = () => {
    setWeather(null);
    setTimeBasedAdvice(null);
    setError(null);
    setCityName("");
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
          
          const weatherData = await getCurrentWeather(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log("現在の天気データ取得成功:", weatherData);
          
          // 予報データも取得
          try {
            const forecastData = await getForecastData(
              position.coords.latitude,
              position.coords.longitude
            );
            console.log("予報データ取得成功:", forecastData);
            
            // 現在時刻の降水確率を取得
            const currentPop = getCurrentPrecipitationProbability(forecastData);
            
            // 地名を日本語表記に変換し、降水確率を追加
            const convertedWeatherData = {
              ...weatherData,
              name: convertToJapaneseName(weatherData.name),
              pop: currentPop
            };
            
            setWeather(convertedWeatherData);
            
            // 時間帯別服装アドバイスを生成
            const advice = generateTimeBasedClothingAdvice(forecastData);
            setTimeBasedAdvice(advice);
          } catch (forecastErr) {
            console.error("予報データ取得エラー:", forecastErr);
            // 予報データの取得に失敗した場合は降水確率なしで表示
            const convertedWeatherData = {
              ...weatherData,
              name: convertToJapaneseName(weatherData.name)
            };
            setWeather(convertedWeatherData);
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
        
        let errorMessage = "位置情報の取得に失敗しました";
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "📍 位置情報の許可が必要です\n\n【スマートフォンの場合】\n1. アドレスバー左側の🔒マークをタップ\n2. 「位置情報」を「許可」に変更\n3. ページを更新してもう一度お試しください\n\n【PCの場合】\nアドレスバー左側の🔒アイコンをクリックして位置情報を許可してください。";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "位置情報が取得できませんでした。GPS機能やWi-Fi接続を確認するか、下記の都市名検索をお試しください。";
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

  const handleCitySearch = async () => {
    if (!cityName.trim()) {
      setError("都市名、県名、または市区町村名を入力してください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherData = await getWeatherByCity(cityName);
      console.log("都市別天気データ取得成功:", weatherData);
      
      // 予報データも取得
      try {
        const forecastData = await getForecastByCity(cityName);
        console.log("都市別予報データ取得成功:", forecastData);
        
        // 現在時刻の降水確率を取得
        const currentPop = getCurrentPrecipitationProbability(forecastData);
        
        // 地名を日本語表記に変換し、降水確率を追加
        const convertedWeatherData = {
          ...weatherData,
          name: convertToJapaneseName(weatherData.name),
          pop: currentPop
        };
        
        setWeather(convertedWeatherData);
        
        // 時間帯別服装アドバイスを生成
        const advice = generateTimeBasedClothingAdvice(forecastData);
        setTimeBasedAdvice(advice);
      } catch (forecastErr) {
        console.error("都市別予報データ取得エラー:", forecastErr);
        // 予報データの取得に失敗した場合は降水確率なしで表示
        const convertedWeatherData = {
          ...weatherData,
          name: convertToJapaneseName(weatherData.name)
        };
        setWeather(convertedWeatherData);
      }
    } catch (err) {
      console.error("都市別天気取得エラー:", err);
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const outfitSuggestion = weather ? getOutfitSuggestion(weather) : null;

  return (
    <WeatherAppTemplate>
      <VStack spacing={4} w="full">
        <Header
          showHomeButton={!!weather}
          onHomeClick={resetToHome}
          onSettingsClick={openSettings}
        />
      </VStack>

            <Center>
        <VStack spacing={2} mb={6}>
          <Text fontSize="sm" color="gray.600">
            アカウントメニュー
          </Text>

          <VStack spacing={2}>
            <Link href="/signup">新規登録</Link>
            <Link href="/login">ログイン</Link>
            <Link href="/me">マイページ</Link>
            <Link href="/logout">ログアウト</Link>
          </VStack>
        </VStack>
      </Center>
      
      {!weather && !loading && !isFirstTime && apiKey && (
        <VStack spacing={6}>
          <Center>
            <Button
              onClick={getLocation}
              colorScheme="blue"
              size="lg"
              leftIcon={BsEye}
            >
              現在地の天気を取得
            </Button>
          </Center>
          
          <SearchForm
            value={cityName}
            onChange={setCityName}
            onSubmit={handleCitySearch}
            isLoading={loading}
          />
        </VStack>
      )}

      {!weather && !loading && (isFirstTime || !apiKey) && (
        <VStack spacing={6}>
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">OpenWeatherMap APIキーが必要です</Text>
              <Text fontSize="sm">
                天気データを取得するために、OpenWeatherMapのAPIキーが必要です。
              </Text>
              <Text fontSize="sm">
                <strong>取得方法:</strong> <br />
                1. <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{color: "blue", textDecoration: "underline"}}>OpenWeatherMap</a>にアクセス<br />
                2. 無料アカウント作成<br />
                3. APIキーを取得<br />
                4. 下の「APIキーを設定」ボタンで登録
              </Text>
            </VStack>
          </Alert>
          <Button
            onClick={openSettings}
            colorScheme="green"
            size="lg"
            leftIcon={BsGear}
          >
            APIキーを設定
          </Button>
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
            leftIcon={BsArrowRepeat}
          >
            再試行
          </Button>
        </VStack>
      )}

      {weather && outfitSuggestion && (
        <VStack spacing={8} w="full">
          <WeatherDisplay weather={weather} />
          <ClothingSuggestion suggestion={outfitSuggestion} />
          {timeBasedAdvice && (
            <TimeBasedClothingAdvice advice={timeBasedAdvice} />
          )}
          <Center>
            <Button
              onClick={getLocation}
              colorScheme="blue"
              size="lg"
              leftIcon={BsArrowRepeat}
            >
              天気情報を更新
            </Button>
          </Center>
        </VStack>
      )}

      {/* APIキー設定モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>APIキー設定</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Text fontSize="sm">
                  OpenWeatherMap APIキーを設定してください。無料プランでも利用できます。
                </Text>
              </Alert>
              
              <FormControl>
                <FormLabel>OpenWeatherMap APIキー</FormLabel>
                <Input
                  type="password"
                  placeholder="32文字の英数字APIキーを入力"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
              </FormControl>
              
              <VStack align="start" spacing={1} fontSize="sm" color="gray.600" w="full">
                <Text><strong>APIキー取得方法:</strong></Text>
                <Text>1. <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{color: "blue", textDecoration: "underline"}}>OpenWeatherMap</a> にアクセス</Text>
                <Text>2. 「Sign Up」で無料アカウント作成</Text>
                <Text>3. ログイン後、「API keys」タブでキーを確認</Text>
                <Text>4. 32文字の英数字キーをコピーして上記に入力</Text>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="blue" onClick={saveApiKey} ml={3}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </WeatherAppTemplate>
  );
}