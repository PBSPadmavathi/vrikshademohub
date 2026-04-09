export interface CallRecording {
  id: string;
  title: string;
  category: string;
  duration: string;
  isBest: boolean;
  audioUrl: string;
}

export interface TranscriptEntry {
  speaker: "ai" | "user";
  text: string;
  timestamp: string;
}

export interface CallHistoryEntry {
  id: string;
  useCaseId: string;
  date: string;
  status: "completed" | "missed" | "in-progress" | "failed";
  duration: string;
  callerName: string;
  callerNumber: string;
  callFromNumber: string;
  summary: string;
  transcript: TranscriptEntry[];
  audioUrl: string;
}

export interface CallFromNumber {
  id: string;
  label: string;
  number: string;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  gradient: string;
  description: string;
  useCases: UseCase[];
}

export const callFromNumbers: CallFromNumber[] = [
  { id: "num-1", label: "Vriksha Main", number: "+91 98765 43210" },
  { id: "num-2", label: "Vriksha Support", number: "+91 87654 32109" },
  { id: "num-3", label: "Vriksha Sales", number: "+91 76543 21098" },
];

export const callHistory: CallHistoryEntry[] = [
  {
    id: "ch-1",
    useCaseId: "agri-1",
    date: "2026-04-05 14:30",
    status: "completed",
    duration: "3:45",
    callerName: "Rajesh Kumar",
    callerNumber: "+91 99887 76655",
    callFromNumber: "+91 98765 43210",
    summary: "Customer called regarding crop insurance claim for wheat damage due to unseasonal rain. AI agent verified policy details, guided through claim filing, and scheduled a field inspection for April 8th.",
    transcript: [
      { speaker: "ai", text: "Namaste! Welcome to Vriksha Agriculture Helpline. How can I assist you today?", timestamp: "0:00" },
      { speaker: "user", text: "Hi, I need to file a crop insurance claim. My wheat crop was damaged due to heavy rain last week.", timestamp: "0:05" },
      { speaker: "ai", text: "I'm sorry to hear about the crop damage. I can help you file a claim. Could you please provide your policy number?", timestamp: "0:12" },
      { speaker: "user", text: "Yes, it's AGR-2026-445512.", timestamp: "0:20" },
      { speaker: "ai", text: "Thank you. I've found your policy. It covers wheat crops in the Nashik district, valid until September 2026. Let me start the claim process. Can you describe the extent of the damage?", timestamp: "0:25" },
      { speaker: "user", text: "About 3 acres out of my 5-acre field are completely waterlogged. The wheat was almost ready for harvest.", timestamp: "0:38" },
      { speaker: "ai", text: "I understand. I've recorded 3 acres of damage due to waterlogging. I'll schedule a field inspection. The earliest available slot is April 8th between 10 AM and 2 PM. Does that work for you?", timestamp: "0:48" },
      { speaker: "user", text: "Yes, that works. Thank you.", timestamp: "1:02" },
      { speaker: "ai", text: "Your claim has been filed with reference number CLM-2026-8891. You'll receive an SMS confirmation shortly. Is there anything else I can help with?", timestamp: "1:08" },
      { speaker: "user", text: "No, that's all. Thank you very much.", timestamp: "1:22" },
      { speaker: "ai", text: "You're welcome, Rajesh ji. We hope for a swift resolution. Have a good day!", timestamp: "1:28" },
    ],
    audioUrl: "",
  },
  {
    id: "ch-2",
    useCaseId: "agri-1",
    date: "2026-04-04 10:15",
    status: "completed",
    duration: "2:18",
    callerName: "Sunita Devi",
    callerNumber: "+91 88776 65544",
    callFromNumber: "+91 98765 43210",
    summary: "Customer inquired about eligibility for Pradhan Mantri Fasal Bima Yojana. AI agent checked eligibility and provided enrollment guidance.",
    transcript: [
      { speaker: "ai", text: "Namaste! Vriksha Agriculture Helpline. How may I help you?", timestamp: "0:00" },
      { speaker: "user", text: "I want to know if I'm eligible for the government crop insurance scheme.", timestamp: "0:04" },
      { speaker: "ai", text: "Of course! I can check that for you. Are you a registered farmer with a valid Kisan credit card?", timestamp: "0:10" },
      { speaker: "user", text: "Yes, I have a Kisan card.", timestamp: "0:18" },
      { speaker: "ai", text: "Great! You are likely eligible for PMFBY. I'll need your Aadhaar number and landholding details to confirm. Would you like to proceed?", timestamp: "0:22" },
      { speaker: "user", text: "Yes, please go ahead.", timestamp: "0:32" },
    ],
    audioUrl: "",
  },
  {
    id: "ch-3",
    useCaseId: "agri-2",
    date: "2026-04-03 16:45",
    status: "missed",
    duration: "0:00",
    callerName: "Amit Patel",
    callerNumber: "+91 77665 54433",
    callFromNumber: "+91 87654 32109",
    summary: "Outbound call for weather advisory — customer did not answer.",
    transcript: [],
    audioUrl: "",
  },
  {
    id: "ch-4",
    useCaseId: "ins-1",
    date: "2026-04-05 11:00",
    status: "completed",
    duration: "4:12",
    callerName: "Priya Sharma",
    callerNumber: "+91 99001 12233",
    callFromNumber: "+91 76543 21098",
    summary: "Policy renewal reminder call. Customer confirmed renewal and updated nominee details. Payment link sent via SMS.",
    transcript: [
      { speaker: "ai", text: "Good morning! This is Vriksha AI calling from ABC Insurance. Am I speaking with Priya Sharma?", timestamp: "0:00" },
      { speaker: "user", text: "Yes, this is Priya.", timestamp: "0:05" },
      { speaker: "ai", text: "Hi Priya! I'm calling to remind you that your health insurance policy HLT-90234 is due for renewal on April 15th. The premium amount is ₹12,500. Would you like to renew?", timestamp: "0:08" },
      { speaker: "user", text: "Yes, I'd like to renew. But I need to update my nominee.", timestamp: "0:22" },
      { speaker: "ai", text: "Absolutely! I can help with that. Please share the new nominee's name and relationship.", timestamp: "0:28" },
      { speaker: "user", text: "My husband, Vikram Sharma.", timestamp: "0:35" },
      { speaker: "ai", text: "Done! I've updated the nominee to Vikram Sharma. I'm sending you a payment link via SMS. Once you complete the payment, your renewed policy document will be emailed within 24 hours.", timestamp: "0:40" },
      { speaker: "user", text: "Thank you so much!", timestamp: "0:55" },
    ],
    audioUrl: "",
  },
  {
    id: "ch-5",
    useCaseId: "hc-1",
    date: "2026-04-04 09:30",
    status: "completed",
    duration: "1:55",
    callerName: "Dr. Mehta's Clinic",
    callerNumber: "+91 88990 01122",
    callFromNumber: "+91 98765 43210",
    summary: "Automated appointment reminder sent to patient. Patient confirmed the appointment for April 6th at 3:30 PM.",
    transcript: [
      { speaker: "ai", text: "Hello! This is a reminder from Dr. Mehta's Clinic. You have an appointment scheduled for April 6th at 3:30 PM. Press 1 to confirm or 2 to reschedule.", timestamp: "0:00" },
      { speaker: "user", text: "1", timestamp: "0:12" },
      { speaker: "ai", text: "Thank you! Your appointment is confirmed. Please arrive 10 minutes early and bring your previous reports. See you on April 6th!", timestamp: "0:15" },
    ],
    audioUrl: "",
  },
  {
    id: "ch-6",
    useCaseId: "bank-1",
    date: "2026-04-05 08:00",
    status: "completed",
    duration: "1:30",
    callerName: "Vikram Singh",
    callerNumber: "+91 77889 90011",
    callFromNumber: "+91 87654 32109",
    summary: "EMI reminder call for home loan. Customer acknowledged and confirmed payment will be made by due date.",
    transcript: [
      { speaker: "ai", text: "Good morning, Vikram! This is Vriksha AI from XYZ Bank. Your home loan EMI of ₹28,500 is due on April 10th. Would you like me to send you the payment link?", timestamp: "0:00" },
      { speaker: "user", text: "Yes please, send the link.", timestamp: "0:10" },
      { speaker: "ai", text: "Done! The payment link has been sent to your registered mobile number. You can also pay via net banking or visit your nearest branch. Thank you!", timestamp: "0:15" },
    ],
    audioUrl: "",
  },
];

export function getCallHistoryForUseCase(useCaseId: string): CallHistoryEntry[] {
  return callHistory.filter((ch) => ch.useCaseId === useCaseId);
}

export function getUseCaseById(useCaseId: string): { useCase: UseCase; category: Category } | null {
  for (const cat of categories) {
    const uc = cat.useCases.find((u) => u.id === useCaseId);
    if (uc) return { useCase: uc, category: cat };
  }
  return null;
}

export const categories: Category[] = [
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "🌾",
    count: 4,
    color: "bg-primary/10 text-primary",
    gradient: "from-emerald-500/20 via-green-500/10 to-teal-500/5",
    description: "AI-powered voice agents for modern farming — from crop advisory to insurance claims.",
    useCases: [
      {
        id: "agri-1",
        title: "Crop Insurance Claims",
        description: "Automate crop insurance claim filing and status tracking via natural voice conversations with farmers in their local language.",
        icon: "🛡️",
      },
      {
        id: "agri-2",
        title: "Soil & Weather Advisory",
        description: "Deliver real-time soil health reports and weather forecasts through proactive outbound calls to farmers.",
        icon: "🌤️",
      },
      {
        id: "agri-3",
        title: "Fertilizer & Seed Recommendations",
        description: "Provide personalized fertilizer and seed recommendations based on crop type, season, and regional data.",
        icon: "🌱",
      },
      {
        id: "agri-4",
        title: "Mandi Price Updates",
        description: "Keep farmers informed about the latest market prices for their produce through scheduled voice calls.",
        icon: "📊",
      },
      {
        id: "agri-5",
        title: "Government Scheme Enrollment",
        description: "Guide farmers through eligibility checks and enrollment for government agricultural subsidies and schemes.",
        icon: "🏛️",
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "🛡️",
    count: 3,
    color: "bg-accent/10 text-accent-foreground",
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/5",
    description: "Streamline policy management, renewals, and claims with intelligent voice automation.",
    useCases: [
      {
        id: "ins-1",
        title: "Policy Renewal Reminders",
        description: "Proactively remind customers about upcoming policy renewals and guide them through the renewal process over the phone.",
        icon: "🔔",
      },
      {
        id: "ins-2",
        title: "Claim Status Follow-ups",
        description: "Provide real-time claim status updates and collect additional documentation requests through automated calls.",
        icon: "📋",
      },
      {
        id: "ins-3",
        title: "New Policy Onboarding",
        description: "Walk new customers through policy details, coverage options, and terms in a conversational, easy-to-understand format.",
        icon: "📄",
      },
      {
        id: "ins-4",
        title: "Premium Payment Reminders",
        description: "Send timely payment reminders and assist customers with payment options to reduce policy lapses.",
        icon: "💳",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    count: 5,
    color: "bg-destructive/10 text-destructive",
    gradient: "from-rose-500/20 via-pink-500/10 to-red-500/5",
    description: "Enhance patient engagement with automated appointment scheduling, follow-ups, and care coordination.",
    useCases: [
      {
        id: "hc-1",
        title: "Appointment Scheduling & Reminders",
        description: "Automate appointment booking, rescheduling, and reminder calls to reduce no-shows and improve clinic efficiency.",
        icon: "📅",
      },
      {
        id: "hc-2",
        title: "Prescription Refill Notifications",
        description: "Notify patients when prescriptions are due for refill and facilitate seamless reordering via voice.",
        icon: "💊",
      },
      {
        id: "hc-3",
        title: "Post-Discharge Follow-ups",
        description: "Conduct automated follow-up calls after hospital discharge to monitor recovery and detect early complications.",
        icon: "🩺",
      },
      {
        id: "hc-4",
        title: "Lab Results Communication",
        description: "Inform patients about their lab results and guide them on next steps, escalating to doctors when necessary.",
        icon: "🔬",
      },
      {
        id: "hc-5",
        title: "Insurance Verification",
        description: "Verify patient insurance coverage and eligibility before appointments to streamline billing and reduce claim denials.",
        icon: "✅",
      },
    ],
  },
  {
    id: "banking",
    name: "Banking & Finance",
    icon: "🏦",
    count: 3,
    color: "bg-secondary/10 text-secondary",
    gradient: "from-blue-500/20 via-indigo-500/10 to-violet-500/5",
    description: "Automate customer banking interactions — from loan inquiries to KYC updates and payment reminders.",
    useCases: [
      {
        id: "bank-1",
        title: "Loan EMI Reminders",
        description: "Send personalized EMI payment reminders with amount, due date, and convenient payment options via voice calls.",
        icon: "🏧",
      },
      {
        id: "bank-2",
        title: "KYC Update Campaigns",
        description: "Proactively reach out to customers for KYC document updates and guide them through the submission process.",
        icon: "🪪",
      },
      {
        id: "bank-3",
        title: "Account Balance & Mini Statements",
        description: "Provide instant account balance and recent transaction summaries through secure, authenticated voice calls.",
        icon: "💰",
      },
      {
        id: "bank-4",
        title: "Credit Card Offers & Upselling",
        description: "Deliver personalized credit card and financial product recommendations based on customer spending patterns.",
        icon: "💳",
      },
      {
        id: "bank-5",
        title: "Fraud Alert Notifications",
        description: "Instantly alert customers about suspicious transactions and verify legitimacy through interactive voice responses.",
        icon: "🚨",
      },
    ],
  },
  {
    id: "ringg",
    name: "Ringg.ai Live",
    icon: "📞",
    count: 3,
    color: "bg-primary/20 text-primary",
    gradient: "from-purple-500/20 via-blue-500/10 to-transparent",
    description: "Real-time calls and agents synced directly from your Ringg.ai account.",
    useCases: [
      {
        id: "ringg",
        title: "Live Call History",
        description: "View real transcripts, hear actual recordings, and track performance of your Ringg.ai agents.",
        icon: "🎙️",
      },
    ],
  },
];

export const recordings: CallRecording[] = [
  { id: "1", title: "Crop Insurance Inquiry", category: "agriculture", duration: "2:34", isBest: true, audioUrl: "" },
  { id: "2", title: "Soil Testing Schedule", category: "agriculture", duration: "1:48", isBest: false, audioUrl: "" },
  { id: "3", title: "Fertilizer Recommendation", category: "agriculture", duration: "3:12", isBest: false, audioUrl: "" },
  { id: "4", title: "Weather Advisory Call", category: "agriculture", duration: "1:55", isBest: true, audioUrl: "" },
  { id: "5", title: "Policy Renewal Reminder", category: "insurance", duration: "2:10", isBest: true, audioUrl: "" },
  { id: "6", title: "Claim Status Follow-up", category: "insurance", duration: "3:45", isBest: false, audioUrl: "" },
  { id: "7", title: "New Policy Explanation", category: "insurance", duration: "4:02", isBest: false, audioUrl: "" },
  { id: "8", title: "Appointment Reminder", category: "healthcare", duration: "1:22", isBest: true, audioUrl: "" },
  { id: "9", title: "Prescription Refill Call", category: "healthcare", duration: "2:05", isBest: false, audioUrl: "" },
  { id: "10", title: "Lab Results Notification", category: "healthcare", duration: "1:40", isBest: true, audioUrl: "" },
  { id: "11", title: "Follow-up Care Instructions", category: "healthcare", duration: "3:30", isBest: false, audioUrl: "" },
  { id: "12", title: "Insurance Verification", category: "healthcare", duration: "2:15", isBest: false, audioUrl: "" },
  { id: "13", title: "Loan EMI Reminder", category: "banking", duration: "1:35", isBest: true, audioUrl: "" },
  { id: "14", title: "Account Balance Inquiry", category: "banking", duration: "1:10", isBest: false, audioUrl: "" },
  { id: "15", title: "KYC Update Request", category: "banking", duration: "2:50", isBest: false, audioUrl: "" },
];
