import express from "express";
import testTrinoConnection from "../databaseHandlers/trino.handler.js"; // Import the connection function
import axios from "axios";

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
    dialect: "spark sql",
  };

  try {
    const response = await axios.post(
      "https://astra.datastax.com/api/v1/run/2acecdb5-1aa5-4e3a-a33f-9cb6f0cb720a?stream=false",
      {
        input_value: JSON.stringify(inputValue), // Ensure input is properly formatted
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "Prompt-TySGF": {},
          "Agent-1Peig": {},
          "ChatInput-fIIlR": {},
          "ChatOutput-b7VXk": {},
        },
      },
      {
        headers: {
          Authorization: `Bearer AstraCS:qsjyBjRGGGCHaRJGerriEupW:656afcc8a82c59579f7ad31604099f65068e0f5cc87721fd92851e48f132438cE`, // Use environment variables
          "Content-Type": "application/json",
          "x-api-key":
            "AstraCS:qsjyBjRGGGCHaRJGerriEupW:656afcc8a82c59579f7ad31604099f65068e0f5cc87721fd92851e48f132438cE",
        },
      }
    );

    console.log("API Response:", response.data);
    res.status(200).json(response.data); // Send response back to client
  } catch (error) {
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

export default router;
