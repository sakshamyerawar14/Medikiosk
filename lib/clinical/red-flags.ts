import { SafetyFlag, HistoryAnswer, InputSource } from "@/types";
import { generateId } from "@/lib/utils";

export interface RedFlagRule {
  id: string;
  triggerConcepts: string[];
  triggerKeywords: string[];
  severity: "critical" | "high" | "medium";
  alertTitle: string;
  staffMessage: string;
  patientGuidance: {
    en: string;
    hi: string;
    mr: string;
    ta: string;
  };
}

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: "rf-cardiac",
    triggerConcepts: ["chest_pain", "chest_heaviness", "heaviness_pressure", "cardiac_discomfort"],
    triggerKeywords: ["chest pain", "chest pressure", "छाती में दर्द", "छाती में भारीपन", "छातीत दुखणे", "நெஞ்சு வலி", "heart pain", "crushing pain"],
    severity: "high",
    alertTitle: "Potential Cardiac Chest Discomfort",
    staffMessage: "Patient reports acute chest heaviness or discomfort. Recommend urgent ECG and clinician assessment.",
    patientGuidance: {
      en: "Potential urgent symptoms reported. Our hospital staff has been alerted. Please approach the nearest triage nurse.",
      hi: "संभावित आपातकालीन लक्षण दर्ज किए गए हैं। अस्पताल के नर्सिंग स्टाफ को सूचित कर दिया गया है। कृपया तुरंत triage काउंटर पर जाएं।",
      mr: "तातडीने लक्ष देण्यासारखी लक्षणे नोंदवली गेली आहेत. रुग्णालय कर्मचाऱ्यांना कळवले आहे. कृपया त्वरित triage काउंटरशी संपर्क साधा.",
      ta: "அவசர அறிகுறிகள் கண்டறியப்பட்டுள்ளன. மருத்துவமனை ஊழியர்களுக்கு தெரிவிக்கப்பட்டுள்ளது.",
    },
  },
  {
    id: "rf-dyspnea",
    triggerConcepts: ["shortness_of_breath", "respiratory_distress", "breathing_difficulty"],
    triggerKeywords: ["shortness of breath", "cannot breathe", "सांस फूलना", "दम लगना", "श्वास घेण्यास त्रास", "மூச்சுத்திணறல்", "gasping"],
    severity: "critical",
    alertTitle: "Acute Respiratory Distress / Dyspnea",
    staffMessage: "Patient reported severe difficulty breathing. Immediate oxygenation check and assessment required.",
    patientGuidance: {
      en: "Severe breathing difficulty detected. Please alert the OPD staff immediately.",
      hi: "सांस लेने में गंभीर कठिनाई के लक्षण हैं। कृपया तुरंत अस्पताल स्टाफ से संपर्क करें।",
      mr: "श्वास घेण्यास तीव्र त्रास नोंदवला गेला आहे. कृपया लगेच कर्मचाऱ्यांशी संपर्क साधा.",
      ta: "கடுமையான மூச்சுத்திணறல். உடனடியாக மருத்துவமனை ஊழியரை அணுகவும்.",
    },
  },
  {
    id: "rf-neurological",
    triggerConcepts: ["stroke", "facial_droop", "slurred_speech", "one_sided_weakness"],
    triggerKeywords: ["slurred speech", "facial droop", "arm weakness", "paralysis", "sudden loss of vision", "लकवा"],
    severity: "critical",
    alertTitle: "Suspected Acute Neurological Event / Stroke FAST Alert",
    staffMessage: "Acute neurological deficit symptoms reported. Immediate stroke protocol and emergency evaluation required.",
    patientGuidance: {
      en: "Neurological symptoms detected. Please alert hospital staff immediately for expedited emergency evaluation.",
      hi: "तंत्रिका तंत्र से जुड़े आपातकालीन लक्षण हैं। कृपया तुरंत स्टाफ से संपर्क करें।",
      mr: "तातडीच्या न्यूरोलॉजिकल तपासणीची गरज आहे. कृपया लगेच डॉक्टरांशी संपर्क साधा.",
      ta: "நரம்பியல் அவசர அறிகுறிகள். உடனே மருத்துவமனை ஊழியரை அணுகவும்.",
    },
  },
  {
    id: "rf-severe-pain",
    triggerConcepts: ["unbearable", "severe_agony"],
    triggerKeywords: ["unbearable pain", "10/10 pain", "असहनीय दर्द", "असह्य वेदना", "தாங்க முடியாத வலி"],
    severity: "medium",
    alertTitle: "Severe Acute Pain Reported",
    staffMessage: "Patient rates pain as severe/unbearable. Expedited queue assessment recommended.",
    patientGuidance: {
      en: "High severity pain reported. A clinical staff member can assist you with priority evaluation.",
      hi: "अत्यधिक तेज दर्द दर्ज किया गया है। नर्सिंग स्टाफ को प्राथमिकता के लिए सूचित किया जा रहा है।",
      mr: "तीव्र वेदनांची नोंद झाली आहे. कर्मचारी तुम्हाला प्राधान्याने तपासणीसाठी मदत करतील.",
      ta: "கடுமையான வலி பதிவு செய்யப்பட்டுள்ளது. ஊழியர்கள் உங்களுக்கு உதவுவார்கள்.",
    },
  },
];

// Common negation phrases across English and Indian regional languages
const NEGATION_PATTERNS = [
  /\bno\s+/i,
  /\bdenies\s+/i,
  /\bdenied\s+/i,
  /\bwithout\s+/i,
  /\bnot\s+experiencing\s+/i,
  /\bnever\s+/i,
  /नहीं\s+/i,
  /नाही\s+/i,
  /இல்லை\s+/i,
];

/**
 * Checks if a keyword occurrence in text is preceded by a negation
 */
function isNegated(fullText: string, keyword: string): boolean {
  const lowerText = fullText.toLowerCase();
  const kw = keyword.toLowerCase();
  const index = lowerText.indexOf(kw);

  if (index === -1) return false;

  // Inspect the preceding 25 characters
  const windowStart = Math.max(0, index - 25);
  const precedingSnippet = lowerText.substring(windowStart, index);

  return NEGATION_PATTERNS.some((pattern) => pattern.test(precedingSnippet));
}

export function evaluateRedFlags(answers: HistoryAnswer[], chiefComplaint?: string): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const combinedText = [
    chiefComplaint || "",
    ...answers.map((a) => `${a.clinicalConcept} ${a.answerText}`),
  ].join(" ").toLowerCase();

  for (const rule of RED_FLAG_RULES) {
    let triggered = false;

    // 1. Check clinical concept match in structured responses
    for (const concept of rule.triggerConcepts) {
      const match = answers.find(
        (a) =>
          (a.clinicalConcept.toLowerCase().includes(concept) ||
            a.answerText.toLowerCase().includes(concept)) &&
          !isNegated(a.answerText, concept)
      );
      if (match) {
        triggered = true;
        break;
      }
    }

    // 2. Check keyword match with negation filtering
    if (!triggered) {
      for (const kw of rule.triggerKeywords) {
        if (combinedText.includes(kw.toLowerCase())) {
          // If preceded by a negation (e.g. "no chest pain"), do NOT trigger
          if (!isNegated(combinedText, kw)) {
            triggered = true;
            break;
          }
        }
      }
    }

    if (triggered) {
      flags.push({
        id: `flag-${generateId()}`,
        alertType: rule.alertTitle,
        severity: rule.severity,
        message: rule.staffMessage,
        source: "touch",
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return flags;
}
