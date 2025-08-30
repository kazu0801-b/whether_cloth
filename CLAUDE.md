# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese weather-based clothing suggestion app built with Next.js 15 and Chakra UI. The app fetches current location weather data and 5-day forecasts from OpenWeatherMap API to provide comprehensive clothing recommendations based on temperature, humidity, wind speed, and weather conditions.

## Key Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI Library**: Chakra UI v2 with Emotion for styling
- **Language**: TypeScript with strict typing
- **Icons**: react-icons (Bootstrap Icons and Material Design Icons)
- **External API**: OpenWeatherMap API for weather data
- **Geolocation**: Browser Geolocation API

### Core Application Structure
The app is a single-page application (`src/app/page.tsx`) with the following key components:
- Main weather display showing current conditions (temperature, humidity, wind speed)
- Clothing suggestion engine with 7 temperature ranges (30°C+ down to <5°C)
- Time-based forecasting with morning/afternoon/evening suggestions
- Weather-specific adjustments (rain, snow, clear skies)
- Environmental condition handling (high/low humidity, wind speed)

### Data Models
- `WeatherData`: Current weather from OpenWeatherMap current weather API
- `ForecastData`: 5-day forecast data with 3-hour intervals
- `OutfitSuggestion`: Categorized clothing recommendations (mainClothing, outerwear, accessories, footwear, tips)
- `TimeBasedClothingAdvice`: Time-slot specific weather and clothing data

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Lint code (Next.js ESLint config)
npm run lint
```

## Environment Setup

Required environment variable in `.env.local`:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

The app requires a free OpenWeatherMap API key from https://openweathermap.org/api

## Key Implementation Details

### Clothing Logic Engine
The clothing suggestion system (`getOutfitSuggestion` function) operates on:
- **7-tier temperature system**: Each 5°C range has specific clothing recommendations
- **Weather condition overlays**: Rain adds umbrellas/raincoats, snow adds winter gear
- **Environmental adjustments**: Humidity affects breathability recommendations, wind speed adds windbreakers
- **Multi-category output**: Separates suggestions into main clothing, outerwear, footwear, and accessories

### Time-Based Forecasting
- Fetches 5-day forecast and extracts today's hourly data
- Groups by morning (6-12), afternoon (12-18), evening (18-24) time slots
- Generates time-specific advice and clothing recommendations
- Provides daily temperature variance analysis

### UI/UX Patterns
- Chakra UI components with consistent color schemes per category (blue for basics, green for outerwear, etc.)
- Responsive grid layouts for weather metrics and time-based suggestions
- Badge-based visual representation of clothing items
- Icon integration from react-icons for visual cues

## Code Conventions

- Uses functional components with React hooks
- TypeScript interfaces for all data structures
- Console logging for debugging weather API responses
- Error boundaries with user-friendly Japanese error messages
- Japanese language throughout UI and suggestions