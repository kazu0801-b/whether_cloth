export interface WeatherData {
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
  pop?: number; // Probability of precipitation (0-100%) - from forecast data
}

export interface OutfitSuggestion {
  mainClothing: string[];
  outerwear: string[];
  accessories: string[];
  footwear: string[];
  tips: string[];
}

export interface TimeSlotWeather {
  temp: number;
  weather: string;
  weatherMain: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation (0-100%)
}

export interface ForecastData {
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
    pop: number; // Probability of precipitation (0-1)
    dt_txt: string;
  }>;
  city: {
    name: string;
  };
}

export interface TimeBasedClothingAdvice {
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