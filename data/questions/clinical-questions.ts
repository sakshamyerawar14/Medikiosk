import { InterviewQuestion, ClinicalSection } from "@/types";

export interface LocalizedQuestion {
  key: string;
  section: ClinicalSection;
  text: {
    en: string;
    hi: string;
    mr: string;
    ta: string;
  };
  audioPrompt?: {
    en: string;
    hi: string;
    mr: string;
    ta: string;
  };
  options: {
    value: string;
    label: {
      en: string;
      hi: string;
      mr: string;
      ta: string;
    };
    icon?: string;
    isRedFlag?: boolean;
  }[];
}

export const CLINICAL_QUESTION_FLOW: LocalizedQuestion[] = [
  {
    key: "onset",
    section: "history_of_present_illness",
    text: {
      en: "When did your problem or symptoms start?",
      hi: "आपकी समस्या या लक्षण कब शुरू हुए?",
      mr: "तुमची समस्या किंवा लक्षणे कधी सुरू झाली?",
      ta: "உங்கள் பிரச்சனை எப்போது தொடங்கியது?",
    },
    audioPrompt: {
      en: "Please select or say when your symptoms started.",
      hi: "कृपया बताएं कि आपकी समस्या कब शुरू हुई थी।",
      mr: "कृपया सांगा की तुमची समस्या कधी सुरू झाली.",
      ta: "உங்கள் அறிகுறிகள் எப்போது தொடங்கின என்று சொல்லுங்கள்.",
    },
    options: [
      {
        value: "today",
        label: { en: "Today (< 24 hours)", hi: "आज (24 घंटे से कम)", mr: "आज (२४ तासांपेक्षा कमी)", ta: "இன்று" },
      },
      {
        value: "yesterday",
        label: { en: "Yesterday (1-2 days)", hi: "कल (1-2 दिन पहले)", mr: "काल (१-२ दिवसांपूर्वी)", ta: "நேற்று" },
      },
      {
        value: "few_days",
        label: { en: "Few days ago (3-7 days)", hi: "कुछ दिन पहले (3-7 दिन)", mr: "काही दिवसांपूर्वी (३-७ दिवस)", ta: "சில நாட்களுக்கு முன்" },
      },
      {
        value: "weeks",
        label: { en: "More than a week ago", hi: "एक सप्ताह से अधिक समय पहले", mr: "एका आठवड्यापेक्षा जास्त", ta: "ஒரு வாரத்திற்கு மேல்" },
      },
    ],
  },
  {
    key: "severity",
    section: "history_of_present_illness",
    text: {
      en: "How severe is your discomfort right now?",
      hi: "इस समय आपको कितनी गंभीर परेशानी महसूस हो रही है?",
      mr: "आता तुम्हाला किती तीव्र त्रास जाणवत आहे?",
      ta: "தற்போது உங்கள் வலி அல்லது அசௌகரியம் எவ்வளவு தீவிரமாக உள்ளது?",
    },
    audioPrompt: {
      en: "How bad is the pain or discomfort?",
      hi: "तकलीफ कितनी ज्यादा है?",
      mr: "त्रास किती तीव्र आहे?",
      ta: "அசௌகரியம் எவ்வளவு உள்ளது?",
    },
    options: [
      {
        value: "mild",
        label: { en: "Mild (Manageable)", hi: "हल्का (सहन करने योग्य)", mr: "सौम्य (सहन होण्यासारखा)", ta: "லேசானது" },
      },
      {
        value: "moderate",
        label: { en: "Moderate (Affects routine)", hi: "मध्यम (दिनचर्या प्रभावित)", mr: "मध्यम (दैनंदिन कामे कठीण)", ta: "மிதமானது" },
      },
      {
        value: "severe",
        label: { en: "Severe / Intense", hi: "गंभीर / तेज दर्द", mr: "तीव्र / खूप त्रास", ta: "கடுமையானது" },
        isRedFlag: true,
      },
      {
        value: "unbearable",
        label: { en: "Extremely Unbearable", hi: "असहनीय दर्द", mr: "असह्य वेदना", ta: "தாங்க முடியாதது" },
        isRedFlag: true,
      },
    ],
  },
  {
    key: "character_location",
    section: "history_of_present_illness",
    text: {
      en: "What type of sensation or pain are you feeling?",
      hi: "आपको किस प्रकार का दर्द या महसूस हो रहा है?",
      mr: "तुम्हाला कोणत्या प्रकारच्या वेदना किंवा त्रास जाणवतो आहे?",
      ta: "உங்களுக்கு எந்த வகையான வலி அல்லது உணர்வு ஏற்படுகிறது?",
    },
    audioPrompt: {
      en: "Tell us about the type of pain or sensation.",
      hi: "दर्द के प्रकार के बारे में बताएं।",
      mr: "वेदनेच्या स्वरूपाबद्दल सांगा.",
      ta: "வலியின் தன்மையை விவரிக்கவும்.",
    },
    options: [
      {
        value: "heaviness_pressure",
        label: { en: "Heavy pressure / Tightness", hi: "भारीपन या दबाव", mr: "जडपणा किंवा दाब", ta: "பாரமான உணர்வு" },
        isRedFlag: true,
      },
      {
        value: "sharp_throbbing",
        label: { en: "Sharp or Throbbing", hi: "तेज या चुभने वाला दर्द", mr: "तीक्ष्ण किंवा ठसठसणारे", ta: "கூர்மையான வலி" },
      },
      {
        value: "burning_acidity",
        label: { en: "Burning sensation / Heat", hi: "जलन या गर्मी", mr: "जळजळ किंवा उष्णता", ta: "எரிச்சல் உணர்வு" },
      },
      {
        value: "dull_ache",
        label: { en: "Dull continuous ache", hi: "हल्का लगातार मीठा दर्द", mr: "मंद पण सततची वेदना", ta: "தொடர் மந்தமான வலி" },
      },
    ],
  },
  {
    key: "associated_symptoms",
    section: "review_of_systems",
    text: {
      en: "Are you experiencing any of these associated symptoms?",
      hi: "क्या आपको इनमें से कोई अन्य लक्षण भी महसूस हो रहे हैं?",
      mr: "तुम्हाला यापैकी इतर कोणतीही लक्षणे जाणवत आहेत का?",
      ta: "இவற்றுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளதா?",
    },
    audioPrompt: {
      en: "Do you have shortness of breath, sweating, or dizziness?",
      hi: "क्या सांस फूलना, पसीना आना या चक्कर आना जैसे लक्षण हैं?",
      mr: "दम लागणे, घाम येणे किंवा चक्कर येणे असे काही आहे का?",
      ta: "மூச்சுத்திணறல் அல்லது வியர்த்தல் உள்ளதா?",
    },
    options: [
      {
        value: "shortness_of_breath",
        label: { en: "Shortness of breath / Difficulty breathing", hi: "सांस फूलना या सांस लेने में कठिनाई", mr: "दम लागणे / श्वास घेण्यास त्रास", ta: "மூச்சுத்திணறல்" },
        isRedFlag: true,
      },
      {
        value: "sweating_dizziness",
        label: { en: "Cold sweating or Dizziness", hi: "ठंडा पसीना या चक्कर आना", mr: "थंड घाम किंवा चक्कर येणे", ta: "குளிர்ந்த வியர்வை / மயக்கம்" },
        isRedFlag: true,
      },
      {
        value: "fever_chills",
        label: { en: "Fever or Chills", hi: "बुखार या कंपकंपी", mr: "ताप किंवा थंडी वाजणे", ta: "காய்ச்சல் அல்லது குளிர்" },
      },
      {
        value: "none_of_above",
        label: { en: "None of the above", hi: "इनमें से कोई नहीं", mr: "यापैकी काहीही नाही", ta: "எதுவும் இல்லை" },
      },
    ],
  },
  {
    key: "past_medical",
    section: "past_medical_history",
    text: {
      en: "Do you have any existing medical conditions or chronic illnesses?",
      hi: "क्या आपको पहले से कोई पुरानी बीमारी या समस्या है?",
      mr: "तुम्हाला आधीपासून काही दीर्घकालीन आजार किंवा त्रास आहे का?",
      ta: "உங்களுக்கு ஏற்கனவே ஏதேனும் நாள்பட்ட நோய்கள் உள்ளதா?",
    },
    audioPrompt: {
      en: "Please select any conditions you have like diabetes or high blood pressure.",
      hi: "कृपया बताएं कि क्या आपको बीपी, शुगर या अन्य कोई बीमारी है।",
      mr: "कृपया बीपी, मधुमेह किंवा इतर आजारांची नोंद करा.",
      ta: "உங்களுக்கு ரத்த அழுத்தம் அல்லது சர்க்கரை நோய் உள்ளதா?",
    },
    options: [
      {
        value: "hypertension",
        label: { en: "High Blood Pressure (Hypertension)", hi: "उच्च रक्तचाप (हाई बीपी)", mr: "उच्च रक्तदाब (हाय बीपी)", ta: "உயர் ரத்த அழுத்தம்" },
      },
      {
        value: "diabetes",
        label: { en: "Diabetes (Sugar)", hi: "मधुमेह (शुगर)", mr: "मधुमेह (डायबेटिस)", ta: "சர்க்கரை நோய்" },
      },
      {
        value: "heart_condition",
        label: { en: "Heart Disease / Previous Stent", hi: "हृदय रोग या पिछला स्टेंट", mr: "हृदयरोग / आधीची शस्त्रक्रिया", ta: "இதய நோய்" },
      },
      {
        value: "asthma_respiratory",
        label: { en: "Asthma / Respiratory Problem", hi: "दमा (अस्थमा) या सांस की बीमारी", mr: "दमा / श्वसनाचा त्रास", ta: "ஆஸ்துமா" },
      },
      {
        value: "none",
        label: { en: "No known chronic conditions", hi: "कोई ज्ञात पुरानी बीमारी नहीं", mr: "कोणताही जुना आजार नाही", ta: "எதுவும் இல்லை" },
      },
    ],
  },
  {
    key: "current_medications",
    section: "medication_history",
    text: {
      en: "Are you currently taking any regular daily medications?",
      hi: "क्या आप वर्तमान में कोई नियमित दवाइयां ले रहे हैं?",
      mr: "तुम्ही सध्या कोणतीही नियमित औषधे घेत आहात का?",
      ta: "நீங்கள் தற்போது ஏதேனும் வழக்கமான மருந்துகளை எடுத்துக்கொள்கிறீர்களா?",
    },
    audioPrompt: {
      en: "Do you take any regular tablets or syrups?",
      hi: "क्या आप रोजाना कोई दवा खाते हैं?",
      mr: "तुम्ही रोज काही औषधे घेता का?",
      ta: "தினசரி மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
    },
    options: [
      {
        value: "bp_sugar_meds",
        label: { en: "Yes, BP or Diabetes medicines", hi: "हाँ, बीपी या शुगर की दवाइयां", mr: "होय, बीपी किंवा मधुमेहाची औषधे", ta: "ஆம், பிபி அல்லது சர்க்கரை மருந்துகள்" },
      },
      {
        value: "cardiac_blood_thinner",
        label: { en: "Yes, Blood thinners / Heart tablets", hi: "हाँ, खून पतला करने वाली या दिल की दवा", mr: "होय, रक्त पातळ करणारी / हृदयाची औषधे", ta: "ஆம், இதய மருந்துகள்" },
      },
      {
        value: "ayush_herbal",
        label: { en: "Yes, Ayurvedic / Homeopathic medicines", hi: "हाँ, आयुर्वेदिक या होम्योपैथिक दवाएं", mr: "होय, आयुर्वेदिक किंवा होमिओपॅथिक औषधे", ta: "ஆம், ஆயுர்வேத மருந்துகள்" },
      },
      {
        value: "no_medications",
        label: { en: "No, taking no regular medicines", hi: "नहीं, कोई नियमित दवा नहीं ले रहे", mr: "नाही, नियमित औषध नाही", ta: "இல்லை, வழக்கமான மருந்துகள் இல்லை" },
      },
    ],
  },
  {
    key: "allergies",
    section: "allergy_history",
    text: {
      en: "Do you have known allergies to any medicines or foods?",
      hi: "क्या आपको किसी दवा या खाद्य पदार्थ से कोई एलर्जी है?",
      mr: "तुम्हाला कोणत्याही औषधाची किंवा अन्नाची ॲलर्जी आहे का?",
      ta: "உங்களுக்கு மருந்து அல்லது உணவு ஒவ்வாமை உள்ளதா?",
    },
    audioPrompt: {
      en: "Please inform us if you have any drug allergies.",
      hi: "कृपया बताएं कि क्या आपको किसी दवा से रिएक्शन होता है।",
      mr: "कृपया सांगा की तुम्हाला औषधांची काही ॲलर्जी आहे का.",
      ta: "மருந்து ஒவ்வாமை உள்ளதா?",
    },
    options: [
      {
        value: "penicillin_antibiotics",
        label: { en: "Penicillin / Antibiotic allergy", hi: "पेनिसिलिन या एंटीबायोटिक से एलर्जी", mr: "पेनिसिलिन / प्रतिजैविक ॲलर्जी", ta: "பெனிசிலின் ஒவ்வாமை" },
      },
      {
        value: "sulfa_drugs",
        label: { en: "Sulfa drugs allergy", hi: "सल्फा दवाओं से एलर्जी", mr: "सल्फा औषधांची ॲलर्जी", ta: "சல்ஃபா மருந்து ஒவ்வாமை" },
      },
      {
        value: "painkillers_nsaids",
        label: { en: "Painkillers (Aspirin / Brufen)", hi: "दर्द निवारक दवाओं से एलर्जी", mr: "वेदनानाशक औषधांची ॲलर्जी", ta: "வலி நிவாரணி ஒவ்வாமை" },
      },
      {
        value: "no_known_allergies",
        label: { en: "No known allergies (NKDA)", hi: "कोई ज्ञात एलर्जी नहीं है", mr: "कोणतीही ज्ञात ॲलर्जी नाही", ta: "எந்த ஒவ்வாமையும் இல்லை" },
      },
    ],
  }
];

// AYUSH-specific Clinical Question Flow
export const AYUSH_QUESTION_FLOW: LocalizedQuestion[] = [
  {
    key: "prakriti_agni",
    section: "prakriti",
    text: {
      en: "How is your appetite and digestion capacity (Agni)?",
      hi: "आपकी भूख और पाचन शक्ति (अग्नि) कैसी है?",
      mr: "तुमची भूक आणि पचनशक्ती (अग्नी) कशी आहे?",
      ta: "உங்கள் பசி மற்றும் செரிமான திறன் எப்படி உள்ளது?",
    },
    options: [
      {
        value: "sama_agni",
        label: { en: "Sama Agni (Regular & Normal)", hi: "सम अग्नि (नियमित व संतुलित)", mr: "सम अग्नी (नियमित व योग्य)", ta: "சம அக்னி" },
      },
      {
        value: "vishama_agni",
        label: { en: "Vishama Agni (Irregular / Gas & Bloating)", hi: "विषम अग्नि (अनियमित / वात / गैस)", mr: "विषम अग्नी (अनियमित / गॅस)", ta: "விஷம அக்னி" },
      },
      {
        value: "tikshna_agni",
        label: { en: "Tikshna Agni (Intense Hunger / Acidity)", hi: "तीक्ष्ण अग्नि (अत्यधिक भूख / पित्त / जलन)", mr: "तीक्ष्ण अग्नी (जास्त भूक / ॲसिडिटी)", ta: "தீக்ஷ்ண அக்னி" },
      },
      {
        value: "manda_agni",
        label: { en: "Manda Agni (Sluggish / Heaviness after food)", hi: "मन्द अग्नि (सुस्त पाचन / कफ / भारीपन)", mr: "मन्द अग्नी (मंद पचन / जडपणा)", ta: "மந்த அக்னி" },
      },
    ],
  },
  {
    key: "koshtha_bowel",
    section: "ahara_vihara",
    text: {
      en: "How is your bowel movement regularity (Koshtha)?",
      hi: "आपका पेट साफ होने की स्थिति (कोष्ठ) कैसी है?",
      mr: "तुमचे पोट साफ होण्याची प्रवृत्ती (कोष्ठ) कशी आहे?",
      ta: "உங்கள் குடல் இயக்கம் எப்படி உள்ளது?",
    },
    options: [
      {
        value: "krura_koshtha",
        label: { en: "Krura Koshtha (Hard stools / Constipation)", hi: "क्रूर कोष्ठ (कड़ा मल / कब्ज की समस्या)", mr: "क्रूर कोष्ठ (बद्धकोष्ठता / कडक शौच)", ta: "கடுமையான மலம்" },
      },
      {
        value: "mridu_koshtha",
        label: { en: "Mridu Koshtha (Easy / Tendency to loose motions)", hi: "मृदु कोष्ठ (आसानी से साफ / पतले दस्त की प्रवृत्ति)", mr: "मृदु कोष्ठ (लगेच पोट बिघडणे)", ta: "எளிதான மலம்" },
      },
      {
        value: "madhyama_koshtha",
        label: { en: "Madhyama Koshtha (Balanced once or twice daily)", hi: "मध्यम कोष्ठ (संतुलित दिन में 1-2 बार)", mr: "मध्यम कोष्ठ (संतुलित)", ta: "சீரான மலம்" },
      },
    ],
  },
  {
    key: "nidra_sleep",
    section: "ahara_vihara",
    text: {
      en: "How is the quality of your sleep (Nidra)?",
      hi: "आपकी नींद (निद्रा) की गुणवत्ता कैसी है?",
      mr: "तुमची झोप (निद्रा) कशी आहे?",
      ta: "உங்கள் தூக்கத்தின் தரம் எப்படி உள்ளது?",
    },
    options: [
      {
        value: "sound_sleep",
        label: { en: "Sound peaceful sleep (6-8 hours)", hi: "गहरी अच्छी नींद (6-8 घंटे)", mr: "शांत व गाढ झोप (६-८ तास)", ta: "ஆழ்ந்த தூக்கம்" },
      },
      {
        value: "disturbed_sleep",
        label: { en: "Disturbed / Frequent waking", hi: "टूटी-फूटी नींद / बार-बार जागना", mr: "अशांत झोप / वारंवार जागे होणे", ta: "கலைந்த தூக்கம்" },
      },
      {
        value: "excessive_sleep",
        label: { en: "Excessive sleepiness / Lethargy", hi: "अत्यधिक नींद या आलस्य", mr: "अतिझोप / सुस्ती", ta: "அதிக தூக்கம்" },
      },
    ],
  }
];
