"use client";

import { useCallback } from "react";
import { WeatherData, OutfitSuggestion, ForecastData, TimeSlotWeather, TimeBasedClothingAdvice } from "../types/weather";


export const useWeatherLogic = (apiKey: string) => {
  // 英語地名を日本語表記に変換する関数
  const convertToJapaneseName = useCallback((englishName: string): string => {
    // 英語→日本語の地名変換マッピング
    const nameConversionMap: { [key: string]: string } = {
      // 東京23区
      'Suginami': '杉並区',
      'Setagaya': '世田谷区',
      'Shinjuku': '新宿区',
      'Shibuya': '渋谷区',
      'Toshima': '豊島区',
      'Shinagawa': '品川区',
      'Minato': '港区',
      'Chuo': '中央区',
      'Chiyoda': '千代田区',
      'Bunkyo': '文京区',
      'Taito': '台東区',
      'Sumida': '墨田区',
      'Koto': '江東区',
      'Ota': '大田区',
      'Meguro': '目黒区',
      'Nakano': '中野区',
      'Kita': '北区',
      'Arakawa': '荒川区',
      'Itabashi': '板橋区',
      'Nerima': '練馬区',
      'Adachi': '足立区',
      'Katsushika': '葛飾区',
      'Edogawa': '江戸川区',
      
      // 主要都市
      'Tokyo': '東京都',
      'Osaka': '大阪府',
      'Kyoto': '京都府',
      'Yokohama': '横浜市',
      'Sapporo': '札幌市',
      'Kobe': '神戸市',
      'Fukuoka': '福岡市',
      'Kawasaki': '川崎市',
      'Saitama': 'さいたま市',
      'Kawagoe': '川越市',
      'Kawaguchi': '川口市',
      'Tokorozawa': '所沢市',
      'Kumagaya': '熊谷市',
      'Koshigaya': '越谷市',
      'Soka': '草加市',
      'Kasukabe': '春日部市',
      'Ageo': '上尾市',
      'Toda': '戸田市',
      'Asaka': '朝霞市',
      'Wako': '和光市',
      'Niiza': '新座市',
      'Shiki': '志木市',
      'Fujimi': '富士見市',
      'Fujimino': 'ふじみ野市',
      'Misato': '三郷市',
      'Yashio': '八潮市',
      'Yoshikawa': '吉川市',
      'Hasuda': '蓮田市',
      'Satte': '幸手市',
      'Shiraoka': '白岡市',
      'Kuki': '久喜市',
      'Kazo': '加須市',
      'Hanyu': '羽生市',
      'Konosu': '鴻巣市',
      'Okegawa': '桶川市',
      'Kitamoto': '北本市',
      'Tsurugashima': '鶴ヶ島市',
      'Sakado': '坂戸市',
      'Higashimatsuyama': '東松山市',
      'Sayama': '狭山市',
      'Iruma': '入間市',
      'Hanno': '飯能市',
      'Hidaka': '日高市',
      'Chichibu': '秩父市',
      'Honjo': '本庄市',
      'Fukaya': '深谷市',
      'Hiroshima': '広島市',
      'Sendai': '仙台市',
      'Chiba': '千葉市',
      'Kitakyushu': '北九州市',
      'Sakai': '堺市',
      'Niigata': '新潟市',
      'Hamamatsu': '浜松市',
      'Shizuoka': '静岡市',
      'Sagamihara': '相模原市',
      'Kumamoto': '熊本市',
      'Okayama': '岡山市',
      'Kanazawa': '金沢市',
      'Nagasaki': '長崎市',
      'Hakodate': '函館市',
      'Asahikawa': '旭川市',
      'Matsumoto': '松本市',
      'Naha': '那覇市',
      'Okinawa': '沖縄市',
    };

    // 東京23区の特別処理
    const tokyoWardNames = [
      'Suginami', 'Setagaya', 'Shinjuku', 'Shibuya', 'Toshima',
      'Shinagawa', 'Minato', 'Chuo', 'Chiyoda', 'Bunkyo',
      'Taito', 'Sumida', 'Koto', 'Ota', 'Meguro', 'Nakano',
      'Kita', 'Arakawa', 'Itabashi', 'Nerima', 'Adachi',
      'Katsushika', 'Edogawa'
    ];

    if (tokyoWardNames.includes(englishName)) {
      const wardName = nameConversionMap[englishName];
      return `東京都${wardName}`;
    }

    // 埼玉県市区町村の特別処理
    const saitamaCityNames = [
      'Saitama', 'Kawagoe', 'Kawaguchi', 'Tokorozawa', 'Kumagaya', 'Koshigaya', 
      'Soka', 'Kasukabe', 'Ageo', 'Toda', 'Asaka', 'Wako', 'Niiza', 'Shiki',
      'Fujimi', 'Fujimino', 'Misato', 'Yashio', 'Yoshikawa', 'Hasuda',
      'Satte', 'Shiraoka', 'Kuki', 'Kazo', 'Hanyu', 'Konosu', 'Okegawa',
      'Kitamoto', 'Tsurugashima', 'Sakado', 'Higashimatsuyama', 'Sayama',
      'Iruma', 'Hanno', 'Hidaka', 'Chichibu', 'Honjo', 'Fukaya'
    ];

    if (saitamaCityNames.includes(englishName)) {
      const cityName = nameConversionMap[englishName];
      return `埼玉県${cityName}`;
    }

    return nameConversionMap[englishName] || englishName;
  }, []);

  // 検索パターンを生成する関数
  const generateSearchPatterns = useCallback((query: string): string[] => {
    const trimmed = query.trim();
    const patterns: string[] = [];
    
    // 日本の都道府県パターンを検出
    const prefecturePatterns = [
      '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
      '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
      '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
      '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
      '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
      '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
      '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ];

    // 日本の主要都市・市区町村を県名付きで検索するためのマッピング
    const cityPrefectureMap: { [key: string]: string } = {
      // 北海道
      '札幌': '北海道',
      '札幌市': '北海道',
      '函館': '北海道',
      '函館市': '北海道',
      '旭川': '北海道',
      '旭川市': '北海道',
      '釧路': '北海道',
      '釧路市': '北海道',
      '苫小牧': '北海道',
      '苫小牧市': '北海道',
      
      // 東北地方
      '青森': '青森県',
      '青森市': '青森県',
      '八戸': '青森県',
      '八戸市': '青森県',
      '盛岡': '岩手県',
      '盛岡市': '岩手県',
      '仙台': '宮城県',
      '仙台市': '宮城県',
      '秋田': '秋田県',
      '秋田市': '秋田県',
      '山形': '山形県',
      '山形市': '山形県',
      '福島': '福島県',
      '福島市': '福島県',
      'いわき': '福島県',
      'いわき市': '福島県',
      '郡山': '福島県',
      '郡山市': '福島県',
      
      // 関東地方
      '水戸': '茨城県',
      '水戸市': '茨城県',
      'つくば': '茨城県',
      'つくば市': '茨城県',
      '宇都宮': '栃木県',
      '宇都宮市': '栃木県',
      '前橋': '群馬県',
      '前橋市': '群馬県',
      '高崎': '群馬県',
      '高崎市': '群馬県',
      'さいたま': '埼玉県',
      'さいたま市': '埼玉県',
      '川越': '埼玉県',
      '川越市': '埼玉県',
      '川口': '埼玉県',
      '川口市': '埼玉県',
      '所沢': '埼玉県',
      '所沢市': '埼玉県',
      '熊谷': '埼玉県',
      '熊谷市': '埼玉県',
      '越谷': '埼玉県',
      '越谷市': '埼玉県',
      '草加': '埼玉県',
      '草加市': '埼玉県',
      '春日部': '埼玉県',
      '春日部市': '埼玉県',
      '上尾': '埼玉県',
      '上尾市': '埼玉県',
      '戸田': '埼玉県',
      '戸田市': '埼玉県',
      '朝霞': '埼玉県',
      '朝霞市': '埼玉県',
      '和光': '埼玉県',
      '和光市': '埼玉県',
      '新座': '埼玉県',
      '新座市': '埼玉県',
      '志木': '埼玉県',
      '志木市': '埼玉県',
      '富士見': '埼玉県',
      '富士見市': '埼玉県',
      'ふじみ野': '埼玉県',
      'ふじみ野市': '埼玉県',
      '三郷': '埼玉県',
      '三郷市': '埼玉県',
      '八潮': '埼玉県',
      '八潮市': '埼玉県',
      '吉川': '埼玉県',
      '吉川市': '埼玉県',
      '蓮田': '埼玉県',
      '蓮田市': '埼玉県',
      '幸手': '埼玉県',
      '幸手市': '埼玉県',
      '白岡': '埼玉県',
      '白岡市': '埼玉県',
      '久喜': '埼玉県',
      '久喜市': '埼玉県',
      '加須': '埼玉県',
      '加須市': '埼玉県',
      '羽生': '埼玉県',
      '羽生市': '埼玉県',
      '鴻巣': '埼玉県',
      '鴻巣市': '埼玉県',
      '桶川': '埼玉県',
      '桶川市': '埼玉県',
      '北本': '埼玉県',
      '北本市': '埼玉県',
      '鶴ヶ島': '埼玉県',
      '鶴ヶ島市': '埼玉県',
      '坂戸': '埼玉県',
      '坂戸市': '埼玉県',
      '東松山': '埼玉県',
      '東松山市': '埼玉県',
      '狭山': '埼玉県',
      '狭山市': '埼玉県',
      '入間': '埼玉県',
      '入間市': '埼玉県',
      '飯能': '埼玉県',
      '飯能市': '埼玉県',
      '日高': '埼玉県',
      '日高市': '埼玉県',
      '秩父': '埼玉県',
      '秩父市': '埼玉県',
      '本庄': '埼玉県',
      '本庄市': '埼玉県',
      '深谷': '埼玉県',
      '深谷市': '埼玉県',
      '千葉': '千葉県',
      '千葉市': '千葉県',
      '船橋': '千葉県',
      '船橋市': '千葉県',
      '柏': '千葉県',
      '柏市': '千葉県',
      '市川': '千葉県',
      '市川市': '千葉県',
      '松戸': '千葉県',
      '松戸市': '千葉県',
      // 東京23区
      '新宿': '東京都',
      '新宿区': '東京都',
      '渋谷': '東京都',
      '渋谷区': '東京都',
      '池袋': '東京都',
      '豊島区': '東京都',
      '品川': '東京都',
      '品川区': '東京都',
      '港区': '東京都',
      '中央区': '東京都',
      '千代田区': '東京都',
      '文京区': '東京都',
      '台東区': '東京都',
      '墨田区': '東京都',
      '江東区': '東京都',
      '大田区': '東京都',
      '世田谷区': '東京都',
      '目黒区': '東京都',
      '中野区': '東京都',
      '杉並区': '東京都',
      '北区': '東京都',
      '荒川区': '東京都',
      '板橋区': '東京都',
      '練馬区': '東京都',
      '足立区': '東京都',
      '葛飾区': '東京都',
      '江戸川区': '東京都',
      // 東京都市部
      '八王子': '東京都',
      '八王子市': '東京都',
      '立川': '東京都',
      '立川市': '東京都',
      '武蔵野': '東京都',
      '武蔵野市': '東京都',
      '三鷹': '東京都',
      '三鷹市': '東京都',
      '府中': '東京都',
      '府中市': '東京都',
      '調布': '東京都',
      '調布市': '東京都',
      '町田': '東京都',
      '町田市': '東京都',
      // 神奈川県
      '横浜': '神奈川県',
      '横浜市': '神奈川県',
      '川崎': '神奈川県',
      '川崎市': '神奈川県',
      '相模原': '神奈川県',
      '相模原市': '神奈川県',
      '横須賀': '神奈川県',
      '横須賀市': '神奈川県',
      '藤沢': '神奈川県',
      '藤沢市': '神奈川県',
      '茅ヶ崎': '神奈川県',
      '茅ヶ崎市': '神奈川県',
      '平塚': '神奈川県',
      '平塚市': '神奈川県',
      
      // 中部地方
      '新潟': '新潟県',
      '新潟市': '新潟県',
      '長岡': '新潟県',
      '長岡市': '新潟県',
      '富山': '富山県',
      '富山市': '富山県',
      '金沢': '石川県',
      '金沢市': '石川県',
      '福井': '福井県',
      '福井市': '福井県',
      '甲府': '山梨県',
      '甲府市': '山梨県',
      '長野': '長野県',
      '長野市': '長野県',
      '松本': '長野県',
      '松本市': '長野県',
      '岐阜': '岐阜県',
      '岐阜市': '岐阜県',
      '静岡': '静岡県',
      '静岡市': '静岡県',
      '浜松': '静岡県',
      '浜松市': '静岡県',
      '沼津': '静岡県',
      '沼津市': '静岡県',
      '名古屋': '愛知県',
      '名古屋市': '愛知県',
      '豊田': '愛知県',
      '豊田市': '愛知県',
      '岡崎': '愛知県',
      '岡崎市': '愛知県',
      '一宮': '愛知県',
      '一宮市': '愛知県',
      '津': '三重県',
      '津市': '三重県',
      '四日市': '三重県',
      '四日市市': '三重県',
      
      // 近畿地方
      '大津': '滋賀県',
      '大津市': '滋賀県',
      '京都': '京都府',
      '京都市': '京都府',
      '大阪': '大阪府',
      '大阪市': '大阪府',
      '堺': '大阪府',
      '堺市': '大阪府',
      '東大阪': '大阪府',
      '東大阪市': '大阪府',
      '枚方': '大阪府',
      '枚方市': '大阪府',
      '豊中': '大阪府',
      '豊中市': '大阪府',
      '吹田': '大阪府',
      '吹田市': '大阪府',
      '神戸': '兵庫県',
      '神戸市': '兵庫県',
      '姫路': '兵庫県',
      '姫路市': '兵庫県',
      '西宮': '兵庫県',
      '西宮市': '兵庫県',
      '尼崎': '兵庫県',
      '尼崎市': '兵庫県',
      '明石': '兵庫県',
      '明石市': '兵庫県',
      '奈良': '奈良県',
      '奈良市': '奈良県',
      '橿原': '奈良県',
      '橿原市': '奈良県',
      '和歌山': '和歌山県',
      '和歌山市': '和歌山県',
      
      // 中国地方
      '鳥取': '鳥取県',
      '鳥取市': '鳥取県',
      '米子': '鳥取県',
      '米子市': '鳥取県',
      '松江': '島根県',
      '松江市': '島根県',
      '出雲': '島根県',
      '出雲市': '島根県',
      '岡山': '岡山県',
      '岡山市': '岡山県',
      '倉敷': '岡山県',
      '倉敷市': '岡山県',
      '広島': '広島県',
      '広島市': '広島県',
      '福山': '広島県',
      '福山市': '広島県',
      '呉': '広島県',
      '呉市': '広島県',
      '山口': '山口県',
      '山口市': '山口県',
      '下関': '山口県',
      '下関市': '山口県',
      '宇部': '山口県',
      '宇部市': '山口県',
      
      // 四国地方
      '徳島': '徳島県',
      '徳島市': '徳島県',
      '高松': '香川県',
      '高松市': '香川県',
      '松山': '愛媛県',
      '松山市': '愛媛県',
      '今治': '愛媛県',
      '今治市': '愛媛県',
      '高知': '高知県',
      '高知市': '高知県',
      
      // 九州・沖縄地方
      '福岡': '福岡県',
      '福岡市': '福岡県',
      '北九州': '福岡県',
      '北九州市': '福岡県',
      '久留米': '福岡県',
      '久留米市': '福岡県',
      '佐賀': '佐賀県',
      '佐賀市': '佐賀県',
      '長崎': '長崎県',
      '長崎市': '長崎県',
      '佐世保': '長崎県',
      '佐世保市': '長崎県',
      '熊本': '熊本県',
      '熊本市': '熊本県',
      '大分': '大分県',
      '大分市': '大分県',
      '別府': '大分県',
      '別府市': '大分県',
      '宮崎': '宮崎県',
      '宮崎市': '宮崎県',
      '都城': '宮崎県',
      '都城市': '宮崎県',
      '鹿児島': '鹿児島県',
      '鹿児島市': '鹿児島県',
      '那覇': '沖縄県',
      '那覇市': '沖縄県',
      '沖縄': '沖縄県',
      '沖縄市': '沖縄県',
      '浦添': '沖縄県',
      '浦添市': '沖縄県'
    };

    // 英語の場合
    if (/^[a-zA-Z\s,]+$/.test(trimmed)) {
      patterns.push(trimmed);
      if (!trimmed.includes(',')) {
        patterns.push(`${trimmed},JP`);
        patterns.push(`${trimmed},Japan`);
      }
      return patterns;
    }

    // 1. 入力された検索語をそのまま使用
    patterns.push(trimmed);

    // 2. 県名が含まれている場合
    if (prefecturePatterns.some(pref => trimmed.includes(pref))) {
      patterns.push(`${trimmed},JP`);
      // 「東京都」→「Tokyo」のような変換も試す
      const prefectureToEnglish: { [key: string]: string } = {
        '北海道': 'Hokkaido',
        '東京都': 'Tokyo',
        '大阪府': 'Osaka',
        '京都府': 'Kyoto',
        '神奈川県': 'Kanagawa',
        '愛知県': 'Aichi',
        '福岡県': 'Fukuoka',
        '沖縄県': 'Okinawa'
      };
      
      for (const [jp, en] of Object.entries(prefectureToEnglish)) {
        if (trimmed.includes(jp)) {
          patterns.push(en);
          patterns.push(`${en},JP`);
        }
      }
    }

    // 3. 東京23区の特別処理
    const tokyoWards = [
      '新宿区', '渋谷区', '豊島区', '品川区', '港区', '中央区', '千代田区',
      '文京区', '台東区', '墨田区', '江東区', '大田区', '世田谷区', '目黒区',
      '中野区', '杉並区', '北区', '荒川区', '板橋区', '練馬区', '足立区',
      '葛飾区', '江戸川区'
    ];
    
    if (tokyoWards.includes(trimmed)) {
      // 東京23区の場合は「東京都○○区」の形式を優先
      patterns.push(`東京都${trimmed},JP`);
      patterns.push(`東京都${trimmed}`);
      patterns.push(`${trimmed},東京都,JP`);
      patterns.push(`${trimmed},東京都`);
    }

    // 3.5. 埼玉県市区町村の特別処理
    const saitamaCities = [
      'さいたま市', '川越市', '川口市', '所沢市', '熊谷市', '越谷市', '草加市',
      '春日部市', '上尾市', '戸田市', '朝霞市', '和光市', '新座市', '志木市',
      '富士見市', 'ふじみ野市', '三郷市', '八潮市', '吉川市', '蓮田市',
      '幸手市', '白岡市', '久喜市', '加須市', '羽生市', '鴻巣市', '桶川市',
      '北本市', '鶴ヶ島市', '坂戸市', '東松山市', '狭山市', '入間市',
      '飯能市', '日高市', '秩父市', '本庄市', '深谷市',
      // 「市」なしバージョン
      'さいたま', '川越', '川口', '所沢', '熊谷', '越谷', '草加',
      '春日部', '上尾', '戸田', '朝霞', '和光', '新座', '志木',
      '富士見', 'ふじみ野', '三郷', '八潮', '吉川', '蓮田',
      '幸手', '白岡', '久喜', '加須', '羽生', '鴻巣', '桶川',
      '北本', '鶴ヶ島', '坂戸', '東松山', '狭山', '入間',
      '飯能', '日高', '秩父', '本庄', '深谷'
    ];
    
    if (saitamaCities.includes(trimmed)) {
      // 埼玉県市区町村の場合は「埼玉県○○市」の形式を優先
      const cityNameWithShi = trimmed.endsWith('市') ? trimmed : `${trimmed}市`;
      patterns.push(`埼玉県${cityNameWithShi},JP`);
      patterns.push(`埼玉県${cityNameWithShi}`);
      patterns.push(`${cityNameWithShi},埼玉県,JP`);
      patterns.push(`${cityNameWithShi},埼玉県`);
    }

    // 4. 都市名のマッピングがある場合
    const matchedPrefecture = cityPrefectureMap[trimmed];
    if (matchedPrefecture) {
      patterns.push(`${trimmed},${matchedPrefecture},JP`);
      patterns.push(`${trimmed},${matchedPrefecture}`);
    }

    // 5. 日本の検索として処理
    if (!patterns.some(p => p.includes(',JP'))) {
      patterns.push(`${trimmed},JP`);
    }

    // 6. 市区町村名の英語変換
    const cityToEnglish: { [key: string]: string } = {
      // 主要都市
      '東京': 'Tokyo',
      '大阪': 'Osaka',
      '京都': 'Kyoto',
      '札幌': 'Sapporo',
      '神戸': 'Kobe',
      '福岡': 'Fukuoka',
      '名古屋': 'Nagoya',
      '横浜': 'Yokohama',
      '那覇': 'Naha',
      '仙台': 'Sendai',
      '広島': 'Hiroshima',
      '北九州': 'Kitakyushu',
      '千葉': 'Chiba',
      'さいたま': 'Saitama',
      '川越': 'Kawagoe',
      '川口': 'Kawaguchi',
      '所沢': 'Tokorozawa',
      '熊谷': 'Kumagaya',
      '越谷': 'Koshigaya',
      '草加': 'Soka',
      '春日部': 'Kasukabe',
      '上尾': 'Ageo',
      '戸田': 'Toda',
      '朝霞': 'Asaka',
      '和光': 'Wako',
      '新座': 'Niiza',
      '志木': 'Shiki',
      '富士見': 'Fujimi',
      'ふじみ野': 'Fujimino',
      '三郷': 'Misato',
      '八潮': 'Yashio',
      '吉川': 'Yoshikawa',
      '蓮田': 'Hasuda',
      '幸手': 'Satte',
      '白岡': 'Shiraoka',
      '久喜': 'Kuki',
      '加須': 'Kazo',
      '羽生': 'Hanyu',
      '鴻巣': 'Konosu',
      '桶川': 'Okegawa',
      '北本': 'Kitamoto',
      '鶴ヶ島': 'Tsurugashima',
      '坂戸': 'Sakado',
      '東松山': 'Higashimatsuyama',
      '狭山': 'Sayama',
      '入間': 'Iruma',
      '飯能': 'Hanno',
      '日高': 'Hidaka',
      '秩父': 'Chichibu',
      '本庄': 'Honjo',
      '深谷': 'Fukaya',
      '川崎': 'Kawasaki',
      '相模原': 'Sagamihara',
      '浜松': 'Hamamatsu',
      '静岡': 'Shizuoka',
      '堺': 'Sakai',
      '新潟': 'Niigata',
      '熊本': 'Kumamoto',
      '岡山': 'Okayama',
      '金沢': 'Kanazawa',
      '長崎': 'Nagasaki',
      '函館': 'Hakodate',
      '旭川': 'Asahikawa',
      // 東京23区
      '新宿': 'Shinjuku',
      '新宿区': 'Shinjuku',
      '渋谷': 'Shibuya',
      '渋谷区': 'Shibuya',
      '池袋': 'Ikebukuro',
      '豊島区': 'Toshima',
      '品川': 'Shinagawa',
      '品川区': 'Shinagawa',
      '港区': 'Minato',
      '中央区': 'Chuo',
      '千代田区': 'Chiyoda',
      '文京区': 'Bunkyo',
      '台東区': 'Taito',
      '墨田区': 'Sumida',
      '江東区': 'Koto',
      '大田区': 'Ota',
      '世田谷区': 'Setagaya',
      '目黒区': 'Meguro',
      '中野区': 'Nakano',
      '杉並区': 'Suginami',
      '北区': 'Kita',
      '荒川区': 'Arakawa',
      '板橋区': 'Itabashi',
      '練馬区': 'Nerima',
      '足立区': 'Adachi',
      '葛飾区': 'Katsushika',
      '江戸川区': 'Edogawa',
      // 観光地・有名都市
      '軽井沢': 'Karuizawa',
      '箱根': 'Hakone',
      '熱海': 'Atami',
      '別府': 'Beppu',
      '松本': 'Matsumoto',
      '高山': 'Takayama',
      '富士': 'Fuji',
      '沖縄': 'Okinawa'
    };

    for (const [jp, en] of Object.entries(cityToEnglish)) {
      if (trimmed.includes(jp)) {
        patterns.push(en);
        patterns.push(`${en},JP`);
        // 東京23区の場合は東京都付きの英語パターンも追加
        if (tokyoWards.includes(jp)) {
          patterns.push(`${en},Tokyo,JP`);
          patterns.push(`${en},Tokyo`);
        }
        // 埼玉県市区町村の場合は埼玉県付きの英語パターンも追加
        if (saitamaCities.includes(jp) || saitamaCities.includes(`${jp}市`)) {
          patterns.push(`${en},Saitama,JP`);
          patterns.push(`${en},Saitama`);
        }
      }
    }

    // 重複を除去して返す
    return [...new Set(patterns)];
  }, []);

  const getOutfitSuggestion = useCallback((weatherData: WeatherData): OutfitSuggestion => {
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
  }, []);

  const getCurrentWeather = useCallback(async (lat: number, lon: number): Promise<WeatherData> => {
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    console.log("Using API Key:", apiKey.substring(0, 8) + "...");
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    console.log("Request URL:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("天気データの取得に失敗しました");
    }

    return response.json();
  }, [apiKey]);

  const getWeatherByCity = useCallback(async (cityName: string): Promise<WeatherData> => {
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const searchPatterns = generateSearchPatterns(cityName);
    console.log("検索パターン:", searchPatterns);
    
    let weatherData = null;

    // 複数のパターンを順番に試行
    for (const pattern of searchPatterns) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(pattern)}&appid=${apiKey}&units=metric&lang=ja`;
        console.log("検索試行:", pattern);
        
        const response = await fetch(url);
        
        if (response.ok) {
          weatherData = await response.json();
          console.log("検索成功:", pattern, weatherData);
          break;
        } else {
          console.log("検索失敗:", pattern, response.status);
        }
      } catch (fetchError) {
        console.log("検索エラー:", pattern, fetchError);
      }
    }

    if (!weatherData) {
      throw new Error(
        `「${cityName}」が見つかりませんでした。以下をお試しください：\n` +
        `• 市区町村名で入力（例：新宿区、横浜市、札幌市）\n` +
        `• 県名と市名を含める（例：神奈川県川崎市、大阪府堺市）\n` +
        `• 都道府県名のみ（例：東京都、大阪府、沖縄県）\n` +
        `• 英語で入力（例：Shibuya, Yokohama, Kyoto）`
      );
    }

    return weatherData;
  }, [apiKey, generateSearchPatterns]);

  const getForecastData = useCallback(async (lat: number, lon: number): Promise<ForecastData> => {
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    console.log("Forecast Request URL:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("予報データの取得に失敗しました");
    }

    return response.json();
  }, [apiKey]);

  const getForecastByCity = useCallback(async (cityName: string): Promise<ForecastData> => {
    if (!apiKey) {
      throw new Error("APIキーが設定されていません");
    }

    const searchPatterns = generateSearchPatterns(cityName);
    console.log("予報検索パターン:", searchPatterns);
    
    let forecastData = null;

    for (const pattern of searchPatterns) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(pattern)}&appid=${apiKey}&units=metric&lang=ja`;
        console.log("予報検索試行:", pattern);
        
        const response = await fetch(url);
        
        if (response.ok) {
          forecastData = await response.json();
          console.log("予報検索成功:", pattern);
          break;
        }
      } catch (fetchError) {
        console.log("予報検索エラー:", pattern, fetchError);
      }
    }

    if (!forecastData) {
      throw new Error(`「${cityName}」の予報データが見つかりませんでした`);
    }

    return forecastData;
  }, [apiKey, generateSearchPatterns]);

  const generateTimeBasedClothingAdvice = useCallback((forecastData: ForecastData): TimeBasedClothingAdvice => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // 今日と明日の予報データを取得（現在時刻によっては今日のデータが少ない可能性があるため）
    const todayStr = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const relevantForecasts = forecastData.list.filter(item => 
      item.dt_txt.startsWith(todayStr) || item.dt_txt.startsWith(tomorrowStr)
    );

    if (relevantForecasts.length === 0) {
      return {
        dayOverview: "予報データが利用できません"
      };
    }

    console.log("利用可能な予報データ:", relevantForecasts.map(f => ({
      time: f.dt_txt,
      temp: f.main.temp,
      weather: f.weather[0].description,
      pop: f.pop
    })));

    // 時間帯別に分類 (朝: 6-12, 昼: 12-18, 夜: 18-24)
    const timeSlots: { [key: string]: TimeSlotWeather } = {};

    relevantForecasts.forEach(forecast => {
      const forecastDate = new Date(forecast.dt * 1000);
      const hour = forecastDate.getHours();
      const isToday = forecast.dt_txt.startsWith(todayStr);
      
      // 今日の場合、現在時刻より未来のデータのみ使用
      if (isToday && hour < currentHour) {
        return;
      }

      const weather: TimeSlotWeather = {
        temp: Math.round(forecast.main.temp),
        weather: forecast.weather[0].description,
        weatherMain: forecast.weather[0].main,
        icon: forecast.weather[0].icon,
        humidity: forecast.main.humidity,
        windSpeed: forecast.wind.speed * 3.6, // m/s to km/h
        pop: Math.round((forecast.pop || 0) * 100) // 0-1 to 0-100%
      };

      console.log(`${forecast.dt_txt} (${hour}時) - 降水確率: ${forecast.pop} -> ${weather.pop}%`);

      // 朝の時間帯（6-12時）
      if (hour >= 6 && hour < 12) {
        if (!timeSlots.morning || isToday) {
          timeSlots.morning = weather;
        }
      }
      // 昼の時間帯（12-18時）
      else if (hour >= 12 && hour < 18) {
        if (!timeSlots.afternoon || isToday) {
          timeSlots.afternoon = weather;
        }
      }
      // 夜の時間帯（18-24時）
      else if (hour >= 18 && hour <= 23) {
        if (!timeSlots.evening || isToday) {
          timeSlots.evening = weather;
        }
      }
    });

    console.log("時間帯別データ:", timeSlots);

    // 各時間帯の服装提案を生成
    const advice: TimeBasedClothingAdvice = {
      dayOverview: ""
    };

    if (timeSlots.morning) {
      const mockWeatherData: WeatherData = {
        main: {
          temp: timeSlots.morning.temp,
          feels_like: timeSlots.morning.temp,
          humidity: timeSlots.morning.humidity
        },
        weather: [{
          main: timeSlots.morning.weatherMain,
          description: timeSlots.morning.weather,
          icon: timeSlots.morning.icon
        }],
        wind: { speed: timeSlots.morning.windSpeed / 3.6 },
        name: forecastData.city.name
      };

      const morningClothing = getOutfitSuggestion(mockWeatherData);
      
      // 降水確率による追加アドバイス
      if (timeSlots.morning.pop >= 30) {
        morningClothing.accessories.push("折りたたみ傘");
        morningClothing.tips.push(`降水確率${timeSlots.morning.pop}% - 傘をお忘れなく`);
      }
      if (timeSlots.morning.pop >= 60) {
        morningClothing.outerwear.push("レインコート");
      }

      advice.morning = {
        weather: timeSlots.morning,
        clothing: morningClothing,
        advice: `朝（6-12時）: ${timeSlots.morning.temp}°C、${timeSlots.morning.weather}、降水確率${timeSlots.morning.pop}%`
      };
    }

    if (timeSlots.afternoon) {
      const mockWeatherData: WeatherData = {
        main: {
          temp: timeSlots.afternoon.temp,
          feels_like: timeSlots.afternoon.temp,
          humidity: timeSlots.afternoon.humidity
        },
        weather: [{
          main: timeSlots.afternoon.weatherMain,
          description: timeSlots.afternoon.weather,
          icon: timeSlots.afternoon.icon
        }],
        wind: { speed: timeSlots.afternoon.windSpeed / 3.6 },
        name: forecastData.city.name
      };

      const afternoonClothing = getOutfitSuggestion(mockWeatherData);
      
      // 降水確率による追加アドバイス
      if (timeSlots.afternoon.pop >= 30) {
        afternoonClothing.accessories.push("折りたたみ傘");
        afternoonClothing.tips.push(`降水確率${timeSlots.afternoon.pop}% - 傘をお忘れなく`);
      }
      if (timeSlots.afternoon.pop >= 60) {
        afternoonClothing.outerwear.push("レインコート");
      }

      advice.afternoon = {
        weather: timeSlots.afternoon,
        clothing: afternoonClothing,
        advice: `昼（12-18時）: ${timeSlots.afternoon.temp}°C、${timeSlots.afternoon.weather}、降水確率${timeSlots.afternoon.pop}%`
      };
    }

    if (timeSlots.evening) {
      const mockWeatherData: WeatherData = {
        main: {
          temp: timeSlots.evening.temp,
          feels_like: timeSlots.evening.temp,
          humidity: timeSlots.evening.humidity
        },
        weather: [{
          main: timeSlots.evening.weatherMain,
          description: timeSlots.evening.weather,
          icon: timeSlots.evening.icon
        }],
        wind: { speed: timeSlots.evening.windSpeed / 3.6 },
        name: forecastData.city.name
      };

      const eveningClothing = getOutfitSuggestion(mockWeatherData);
      
      // 降水確率による追加アドバイス
      if (timeSlots.evening.pop >= 30) {
        eveningClothing.accessories.push("折りたたみ傘");
        eveningClothing.tips.push(`降水確率${timeSlots.evening.pop}% - 傘をお忘れなく`);
      }
      if (timeSlots.evening.pop >= 60) {
        eveningClothing.outerwear.push("レインコート");
      }

      advice.evening = {
        weather: timeSlots.evening,
        clothing: eveningClothing,
        advice: `夜（18-24時）: ${timeSlots.evening.temp}°C、${timeSlots.evening.weather}、降水確率${timeSlots.evening.pop}%`
      };
    }

    // 一日の概要を生成
    const availableSlots = Object.keys(timeSlots);
    if (availableSlots.length > 0) {
      const temps = Object.values(timeSlots).map((slot: TimeSlotWeather) => slot.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
      let overview = `予報気温：${minTemp}°C〜${maxTemp}°C`;
      if (maxTemp - minTemp >= 8) {
        overview += " （気温差が大きいため、重ね着で調節可能な服装がおすすめ）";
      }
      
      const timeSlotNames = {
        morning: "朝",
        afternoon: "昼", 
        evening: "夜"
      };
      
      const availableTimeNames = availableSlots.map(slot => timeSlotNames[slot as keyof typeof timeSlotNames]).join("・");
      overview += ` | 利用可能な時間帯: ${availableTimeNames}`;
      
      advice.dayOverview = overview;
    } else {
      advice.dayOverview = "予報データが十分に取得できませんでした";
    }

    return advice;
  }, [getOutfitSuggestion]);

  const getCurrentPrecipitationProbability = useCallback((forecastData: ForecastData): number => {
    const now = new Date();
    let closestForecast: (typeof forecastData.list)[0] | null = null;
    let minTimeDiff = Infinity;

    // 現在時刻に最も近い予報データを見つける
    for (const forecast of forecastData.list) {
      const forecastTime = new Date(forecast.dt * 1000);
      const timeDiff = Math.abs(forecastTime.getTime() - now.getTime());
      
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestForecast = forecast;
      }
    }

    if (closestForecast && 'pop' in closestForecast && closestForecast.pop !== undefined) {
      const pop = Math.round(closestForecast.pop * 100);
      console.log(`現在時刻に最も近い予報: ${closestForecast.dt_txt}, 降水確率: ${pop}%`);
      return pop;
    }

    return 0;
  }, []);

  return {
    convertToJapaneseName,
    getOutfitSuggestion,
    getCurrentWeather,
    getWeatherByCity,
    getForecastData,
    getForecastByCity,
    generateTimeBasedClothingAdvice,
    getCurrentPrecipitationProbability,
  };
};