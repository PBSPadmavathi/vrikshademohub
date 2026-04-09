import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * ApiStatus Component
 * 
 * Demonstrates:
 * 1. Usage of the centralized api utility.
 * 2. Proper handling of loading, success, and error states.
 * 3. Runtime verification of the configured API URL.
 */
export const ApiStatus: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Attempt to fetch agents from the backend
        const data = await api.fetchRinggAgents();
        setAgents(data || []);
      } catch (err: any) {
        console.error("Connection check failed:", err);
        setError(err.message || "Failed to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-card shadow-sm max-w-md mx-auto my-8">
      <h3 className="text-lg font-semibold mb-2">Backend Connection Status</h3>
      
      {loading && (
        <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
          <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
          <span>Verifying API connection...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
          <strong>Connection Failed:</strong> {error}
          <p className="mt-1 text-xs opacity-80">
            Ensure VITE_API_URL is correctly set in your environment (currently using build-time fallback).
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="p-3 bg-green-500/10 border border-green-500 text-green-600 rounded text-sm">
          <div className="flex items-center space-x-2 font-medium">
            <span>✅ Connected to API</span>
          </div>
          <p className="mt-1">
            Successfully retrieved {agents.length} agents from the backend.
          </p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t text-[10px] text-muted-foreground font-mono">
        Check browser console for detailed initialization logs.
      </div>
    </div>
  );
};
