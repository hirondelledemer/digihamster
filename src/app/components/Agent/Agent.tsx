"use client";
import apiClient from "@/app/utils/api-client";
import { useEffect, useState } from "react";

// # Freechat — no extras needed
//   curl -H "Authorization: Bearer $TOKEN" \
//     'http://localhost:8080/agent/state?focus=freechat&tz=Europe/Vilnius'

//   # Planning
//   curl -H "Authorization: Bearer $TOKEN" \
//     'http://localhost:8080/agent/state?focus=planning&tz=Europe/Vilnius'

//   # Simulate a "27 tasks in 24 hours" burst
//   curl -H "Authorization: Bearer $TOKEN" \
//     'http://localhost:8080/agent/state?focus=task_burst&count=27&window=24h&tz=Europe/Vilnius'

//   # Project-created
//   curl -H "Authorization: Bearer $TOKEN" \
//     'http://localhost:8080/agent/state?focus=project_created&project_id=42&tz=Europe/Vilnius'

export const Agent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [_agentData, setAgentData] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const weatherResponse = await apiClient.get(
          "/agent/state?focus=freechat&tz=Europe/Vilnius",
        );
        setAgentData(weatherResponse.data);
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return "loading...";
  }

  return null;
};
