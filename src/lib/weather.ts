import { Language, translations } from './translations';

export interface WeatherData {
  location: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfallChance: number;
  aqi: number; // 1-5 or 0-500 scale, let's use standard AQI (0 - 500)
  conditions: string;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  advisories: {
    irrigation: string;
    fertilizer: string;
    harvest: string;
    diseaseRisk: string;
  };
  environmentalRisk: {
    level: 'Low' | 'Medium' | 'High';
    description: string;
    alerts: string[];
    sustainabilityTips: string[];
  };
  irrigationSchedule: {
    day: string;
    needed: boolean;
    amountMm: number;
    tip: string;
  }[];
}

export class WeatherService {
  
  static async getInsights(
    location: string,
    lang: Language,
    apiKey?: string
  ): Promise<WeatherData> {
    
    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate location-specific mock data
    const locationSeed = location.toLowerCase();
    
    let baseTemp = 28;
    let baseHumid = 65;
    let baseRain = 20;
    let baseAqi = 75;
    let conditions = "Partly Cloudy";

    if (locationSeed.includes("hyderabad") || locationSeed.includes("telangana")) {
      baseTemp = 32;
      baseHumid = 55;
      baseRain = 10;
      baseAqi = 110;
      conditions = "Hazy Sunshine";
    } else if (locationSeed.includes("delhi") || locationSeed.includes("noida")) {
      baseTemp = 35;
      baseHumid = 45;
      baseRain = 5;
      baseAqi = 280; // High pollution
      conditions = "Smoky/Dusty";
    } else if (locationSeed.includes("mumbai") || locationSeed.includes("kerala") || locationSeed.includes("coast")) {
      baseTemp = 27;
      baseHumid = 85;
      baseRain = 75;
      baseAqi = 45;
      conditions = "Heavy Rain Showers";
    } else if (locationSeed.includes("bangalore") || locationSeed.includes("bengaluru")) {
      baseTemp = 24;
      baseHumid = 60;
      baseRain = 35;
      baseAqi = 60;
      conditions = "Overcast Cool Breeze";
    }

    // Add some random offsets so dashboard ticks
    const temp = parseFloat((baseTemp + (Math.random() * 4 - 2)).toFixed(1));
    const humidity = Math.max(10, Math.min(100, Math.round(baseHumid + (Math.random() * 10 - 5))));
    const windSpeed = parseFloat((12 + Math.random() * 8).toFixed(1));
    const rainfallChance = Math.max(0, Math.min(100, Math.round(baseRain + (Math.random() * 15 - 7))));
    const aqi = Math.max(10, Math.round(baseAqi + (Math.random() * 20 - 10)));

    // Pollution sub-metrics
    const pm25 = Math.round(aqi * 0.45);
    const pm10 = Math.round(aqi * 0.75);
    const co = parseFloat((aqi * 0.008).toFixed(2));
    const no2 = parseFloat((aqi * 0.12).toFixed(1));

    // Dynamic Advisories
    let irrigation = "Soil moisture is stable. Schedule normal light irrigation in the evening.";
    let fertilizer = "Weather is calm. Ideal conditions for applying foliar fertilizer spray.";
    let harvest = "Sunny dry days ahead. Perfect window to plan and execute crop harvesting.";
    let diseaseRisk = "Low disease risk indicators present. Keep monitor foliage daily.";

    if (humidity > 80 && temp > 25) {
      diseaseRisk = "HIGH ALERT: High humidity and temperature create optimal conditions for Downy Mildew and fungal blights. Inspect leaf undersides daily and apply organic preventatives.";
    } else if (temp > 38) {
      diseaseRisk = "MODERATE: Extreme heat may cause sunscald. Keep soil moist to protect root vascular health.";
    }

    if (rainfallChance > 60) {
      irrigation = "SUSPEND IRRIGATION: Heavy rain is expected. Let natural precipitation water the fields to avoid root flooding and water wastage.";
      fertilizer = "AVOID SPRAYING: High probability of rain will wash off any applied chemical or organic spray. Postpone application.";
      harvest = "DELAY HARVEST: Wet crops are highly susceptible to post-harvest mold and storage decay. Wait for a dry day window.";
    } else if (humidity < 40 && rainfallChance < 15) {
      irrigation = "INCREASE WATERING: Dry air and high transpiration rates detected. Increase watering by 20% to prevent crop stress.";
    }

    // Environmental Risk Level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let riskDesc = "Environmental parameters are within safe sustainable thresholds.";
    let alerts: string[] = [];
    const sustainabilityTips = [
      "Collect and recycle greywater for home gardening purposes.",
      "Practice straw mulching to decrease soil water evaporation by up to 35%.",
      "Adopt solar-powered pumps for low-carbon field irrigation."
    ];

    if (aqi > 200) {
      riskLevel = 'High';
      riskDesc = "SEVERE AIR POLLUTION: High levels of PM2.5 and PM10 particles. Stagnant air is trapping pollutants.";
      alerts.push("Hazardous air index for rural workers. Wear protective N95 masks during field operations.");
      alerts.push("Acid rain potential if showers occur. Avoid outdoor chemical blending.");
      sustainabilityTips.push("Plant broad-leaf evergreen trees (like Neem, Peepal) around fields to act as dust barriers.");
    } else if (aqi > 100) {
      riskLevel = 'Medium';
      riskDesc = "MODERATE AIR QUALITY: Moderate particle concentration. Sensitive individuals might experience respiratory irritation.";
      alerts.push("Moderate smog visible. Spray crops in early morning hours before sun exposure intensifies ozone.");
    }

    if (temp > 35 && humidity < 30) {
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
      alerts.push("HEAT STRESS / WILDFIRE RISK: Extremely dry and hot air. Evapotranspiration is extremely high.");
      sustainabilityTips.push("Construct windbreaks/hedges to reduce dry wind exposure to young plants.");
    }

    // Weekly Smart Irrigation Schedule
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    // Shift days starting from today
    const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon
    const orderedDays: string[] = [];
    for (let i = 0; i < 7; i++) {
      const idx = (todayIndex + i) % 7;
      orderedDays.push(days[idx === 0 ? 6 : idx - 1]);
    }

    const irrigationSchedule = orderedDays.map((day, index) => {
      // Logic for irrigation necessity
      let needed = true;
      let amountMm = 12;
      let tip = "Normal drip cycle";

      if (rainfallChance > 65 && index < 2) {
        needed = false;
        amountMm = 0;
        tip = "Skip: High rainfall expected";
      } else if (index === 3 || index === 6) {
        needed = false;
        amountMm = 0;
        tip = "Scheduled soil dry period";
      } else if (temp > 33) {
        amountMm = 18;
        tip = "Increase: High heat transpiration";
      }

      return { day, needed, amountMm, tip };
    });

    // Translate advisories if Telugu/Hindi is selected
    if (lang === 'te') {
      irrigation = rainfallChance > 60 
        ? "నీటిపారుదల ఆపండి: వర్షం పడే అవకాశం ఉంది. నీరు నిల్వ ఉండకుండా చూడండి." 
        : "నేల తేమ స్థిరంగా ఉంది. సాయంత్రం సాధారణ నీటిపారుదల షెడ్యూల్ చేయండి.";
      fertilizer = rainfallChance > 60 
        ? "ఎరువులు వేయకండి: వర్షం కారణంగా ఎరువులు కొట్టుకుపోయే అవకాశం ఉంది. వాయిదా వేయండి." 
        : "వాతావరణం ప్రశాంతంగా ఉంది. ఎరువులు చల్లడానికి ఇది అనుకూలమైన సమయం.";
      harvest = rainfallChance > 60 
        ? "కోత వాయిదా వేయండి: తడి పంటకు బూజు పట్టే అవకాశం ఉంది. పొడి వాతావరణం కోసం వేచి ఉండండి." 
        : "ఎండగా ఉండే రోజులు. పంట కోతలకు సరైన సమయం.";
      diseaseRisk = humidity > 80 
        ? "అధిక హెచ్చరిక: ఉష్ణోగ్రత మరియు తేమ ఎక్కువగా ఉండడం వల్ల శిలీంధ్ర వ్యాధులు వ్యాపించే అవకాశం ఉంది." 
        : "తక్కువ వ్యాధి ప్రమాదం ఉంది. ఆకులను పర్యవేక్షించండి.";
    } else if (lang === 'hi') {
      irrigation = rainfallChance > 60 
        ? "सिंचाई रोकें: भारी बारिश की उम्मीद है। जलभराव से बचने के लिए प्राकृतिक वर्षा का उपयोग करें।" 
        : "मिट्टी में नमी स्थिर है। शाम को हल्की सिंचाई निर्धारित करें।";
      fertilizer = rainfallChance > 60 
        ? "छिड़काव से बचें: बारिश के कारण उर्वरक/कीटनाशक धुल सकते हैं। छिड़काव स्थगित करें।" 
        : "मौसम शांत है। उर्वरक छिड़काव के लिए आदर्श परिस्थितियां हैं।";
      harvest = rainfallChance > 60 
        ? "कटाई टालें: गीली फसलों में फफूंद लगने का खतरा रहता है। सूखे दिनों की प्रतीक्षा करें।" 
        : "धूप खिली रहने की संभावना है। फसल कटाई की योजना बनाने का सही समय।";
      diseaseRisk = humidity > 80 
        ? "उच्च चेतावनी: अधिक नमी के कारण फंगल संक्रमण और लेट ब्लाइट फैलने की अनुकूल परिस्थितियाँ हैं।" 
        : "कम रोग जोखिम संकेतक। पत्तियों की दैनिक निगरानी करें।";
    }

    return {
      location,
      temp,
      humidity,
      windSpeed,
      rainfallChance,
      aqi,
      conditions,
      pm25,
      pm10,
      co,
      no2,
      advisories: {
        irrigation,
        fertilizer,
        harvest,
        diseaseRisk
      },
      environmentalRisk: {
        level: riskLevel,
        description: riskDesc,
        alerts,
        sustainabilityTips
      },
      irrigationSchedule
    };
  }
}
