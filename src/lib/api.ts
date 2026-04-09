const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface CreateCallPayload {
  name: string;
  mobile: string;
  callFrom: string;
  useCaseId: string;
}

export const api = {
  async fetchCallHistory(useCaseId: string) {
    const response = await fetch(`${API_BASE_URL}/calls/history/${useCaseId}`);
    if (!response.ok) throw new Error("Failed to fetch call history");
    return response.json();
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
    if (!response.ok) throw new Error("Failed to initiate call");
    return response.json();
  },

  async fetchCallDetails(callId: string) {
    const response = await fetch(`${API_BASE_URL}/calls/${callId}`);
    if (!response.ok) throw new Error("Failed to fetch call details");
    return response.json();
  },
  
  async fetchRinggHistory(agentId?: string, agentNameFilter?: string) {
    let url = `${API_BASE_URL}/ringg/history`;
    const params = new URLSearchParams();
    if (agentId) params.append("agent_id", agentId);
    if (agentNameFilter) params.append("agent_name_filter", agentNameFilter);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Ringg history");
    return response.json();
  },

  async fetchRinggAgents() {
    const response = await fetch(`${API_BASE_URL}/ringg/agents`);
    if (!response.ok) throw new Error("Failed to fetch Ringg agents");
    return response.json();
  },

  async fetchRinggNumbers() {
    const response = await fetch(`${API_BASE_URL}/ringg/numbers`);
    if (!response.ok) throw new Error("Failed to fetch Ringg phone numbers");
    return response.json();
  },
};
