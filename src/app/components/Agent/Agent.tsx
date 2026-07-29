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

/////

// Try it

// Deploy the Go server to your Hetzner box alongside Ollama, then:

// curl -X POST \
//   -H "Authorization: Bearer $TOKEN" \
//   'http://65.21.106.111:8080/agent/review?tz=Europe/Vilnius'

// Expect a 20–45 second wait (cold Ollama call), then something like:

// {
//   "mood": "amused",
//   "comments": [
//     "Four projects idle and one new task today. Consistent.",
//     "You did not journal yesterday. Just observing."
//   ]
// }

export const Agent = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [_agentData, setAgentData] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const _raw1 = await apiClient.get(
          "/agent/state?focus=freechat&tz=Europe/Vilnius",
        );
        const weatherResponse = await apiClient.post(
          "/agent/review?tz=Europe/Vilnius",
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
