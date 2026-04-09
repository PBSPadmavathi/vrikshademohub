// Resolve the API URL: 
// 1. User specified environment variable
// 2. Production fallback (Railway)
// 3. Local development fallback
const API_BASE_URL = import.meta.env.VITE_API_URL 
  || "https://vrikshademohub-production.up.railway.app/api";

console.log("🚀 API Integration: Initializing with Base URL:", API_BASE_URL);

// Helper for consistent error handling and response parsing
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error [${response.status}]:`, errorText);
    throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
  }
  
  try {
    const data = await response.json();
    if (!data) throw new Error("API returned an empty response");
    return data;
  } catch (e) {
    console.error("❌ Failed to parse API response:", e);
    throw new Error("Malfomed API response");
  }
};

export interface CreateCallPayload {
  name: string;
  mobile: string;
  callFrom: string;
  useCaseId: string;
}

export const api = {
  async fetchCallHistory(useCaseId: string) {
    const response = await fetch(`${API_BASE_URL}/calls/history/${useCaseId}`);
    return handleResponse(response);
  },

  async initiateCall(payload: CreateCallPayload) {
    const response = await fetch(`${API_BASE_URL}/calls/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caller_name: payload.name,
        caller_number: payload.mobile,
        call_from_number: payload.callFrom,
        use_case_id: payload.useCaseId,
      }),
    });
    return handleResponse(response);
  },

  async fetchCallDetails(callId: string) {
    const response = await fetch(`${API_BASE_URL}/calls/${callId}`);
    return handleResponse(response);
  },
  
  async fetchRinggHistory(agentId?: string, agentNameFilter?: string) {
    let url = `${API_BASE_URL}/ringg/history`;
    const params = new URLSearchParams();
    if (agentId) params.append("agent_id", agentId);
    if (agentNameFilter) params.append("agent_name_filter", agentNameFilter);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  async fetchRinggAgents() {
    const response = await fetch(`${API_BASE_URL}/ringg/agents`);
    return handleResponse(response);
  },

  async fetchRinggNumbers() {
    const response = await fetch(`${API_BASE_URL}/ringg/numbers`);
    return handleResponse(response);
  },
};
