import express from "express";
import testTrinoConnection from "../databaseHandlers/trino.handler.js"; // Import the connection function
import axios from "axios";
import { LangflowClient } from "@datastax/langflow-client";

const router = express.Router();
// Route to check Trino connection
router.get("/testtrino", async (req, res) => {
  try {
    const { host, port } = req.query; // Get host & port from query params
    if (!host || !port) {
      return res
        .status(400)
        .json({ success: false, message: "Host and port are required" });
    }
    const result = await testTrinoConnection({ host, port });
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
});

router.post("/", async (req, res) => {
  let inputValue = {
    query:
      "Retrieve the names and emails of users along with the total number of orders they have placed.",
    metadata: {
      databases: {
        flask_db: {
          tables: {
            users: ["id", "name", "email"],
            orders: ["order_id", "user_id", "amount"],
          },
        },
        analytics_db: {
          tables: {
            events: ["event_id", "event_name", "timestamp"],
          },
        },
      },
    },
    dialect: "mysql",
  };

  try {
    const payload = {
      input_value: JSON.stringify(inputValue),
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-dOH3m": {},
        "Prompt-cMcHL": {},
        "GoogleGenerativeAIModel-3V8H5": {},
        "ChatOutput-XCd37": {},
      },
    };

    const response = await axios.post(
      "https://api.langflow.astra.datastax.com/lf/ab147fa5-088c-429d-88aa-465c74c8b303/api/v1/run/2acecdb5-1aa5-4e3a-a33f-9cb6f0cb720a?stream=false",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer AstraCS:hxjebPiZnvMpQSQaZLPdDfzi:a3040aa24372c28a4c2e275a61b89e5e09957e4a64fd3f824c865ff9c1085651`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error calling Langflow API:",
      error.response?.data || error.message
    );

    if (error.response) {
      // API responded with an error (4xx or 5xx)
      console.error("API Error:", error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // Request made but no response received
      console.error("No response from API:", error.request);
      res.status(500).json({ error: "No response from API" });
    } else {
      // Other errors
      console.error("Request Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.post("/client", async (req, res) => {
  try {
    let inputValue = {
      query:
        "Show me the list of users along with their orders and the events they attended.",
      metadata: {
        databases: {
          flask_db: {
            tables: {
              users: ["id", "name", "email"],
              orders: ["order_id", "user_id", "amount"],
            },
          },
          analytics_db: {
            tables: {
              events: ["event_id", "event_name", "timestamp"],
            },
          },
        },
      },
      dialect: "trino",
    };
    const langflowId = "ab147fa5-088c-429d-88aa-465c74c8b303";
    const flowId = "2acecdb5-1aa5-4e3a-a33f-9cb6f0cb720a";
    const apiKey =
      "AstraCS:hxjebPiZnvMpQSQaZLPdDfzi:a3040aa24372c28a4c2e275a61b89e5e09957e4a64fd3f824c865ff9c1085651";

    const client = new LangflowClient({ langflowId, apiKey });
    const flow = client.flow(flowId);
    const result = await flow.run(JSON.stringify(inputValue));

    return res.status(200).json({ sucess: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server err" });
  }
});

export default router;
