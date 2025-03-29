import executeQuery from "../utils/worker.util.js";
import Connection from "../models/connection.model.js";
import { decryptData } from "../services/aes.encryption.js";
import QueryHistory from "../models/queeryhistory.model.js";
import axios from "axios"; // Make sure this is only declared once
import { LangFlowService } from "../services/langflow.service.js";
import DatabaseMetadata from "../models/databasemetadata.model.js";

export const executeDBQuery = async (req, res) => {
  try {
    const { query, connectionId, dialect } = req.body;
    const userId = req.user.userId;
    const connection = await Connection.findOne({
      userId,
      _id: connectionId,
    });
    if (!connection) {
      return res
        .status(404)
        .json({ success: false, message: "Connection not found" });
    }

    const decryptedConnection = decryptData(connection.connectionData, userId);
    const body = {
      dbType: decryptedConnection.type,
      username: decryptedConnection.username,
      password: decryptedConnection.password,
      host: decryptedConnection.host,
      port: Number(decryptedConnection.port),
      database: decryptedConnection.database,
      query: query,
    };

    const result = await executeQuery(body);

    // Convert execution time from string (e.g., "3ms") to number (milliseconds)
    const executionTimeStr = result.data?.metadata?.executionTime || "0ms";
    const responseTime = parseInt(executionTimeStr.replace(/[^0-9]/g, ""));

    // Create query history entry
    const queryHistory = await QueryHistory.create({
      userId,
      query,
      status: result.success ? "success" : "failed",
      dbName: decryptedConnection.database,
      error: result.success ? "" : result.message || "Query execution failed",
      response: result.data,
      responseTime: responseTime,
      rows: Number(result.data?.metadata?.rowCount || 0),
      affectedRows: Number(result.data?.metadata?.affectedRows || 0),
    });

    return res.status(result.success ? 200 : 500).json({
      message: "success",
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateQuery = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.userId;
    const connection = body.database;
    const metaData = await DatabaseMetadata.findOne({
      userId,
      connectionId: connection,
    });

    if (body.dialect === "trino" || body.dialect === "spark") {
      const result = await LangFlowService(body, metaData);
      console.log(result);
      const data = {
        sql_query: result.data.query,
        
      };
      console.log(data);
      if (result.success) {
        return res
          .status(200)
          .json({ message: "success", success: true, data: data });
      } else {
        return res
          .status(500)
          .json({ message: "failed", success: false, data: data });
      }
    }

    // Retrieve the Bearer token from environment variables
    const token = process.env.DRF_SERVER_SERVICE_TOKEN;
    const host = process.env.DRF_SERVER_HOST;

    // Make the POST request with Authorization header
    const response = await axios.post(
      `${host}api/generate-sql/`,
      {
        user_id: req.user.userId, // Ensure `userId` exists and is correct
        question: body.message, // Ensure `message` is being passed correctly
        connectionId: body.database, // Make sure this is also passed
      },
      {
        headers: {
          Authorization: `${token}`, // Adding the Bearer token
          "Content-Type": "application/json", // Ensures proper content type
        },
      }
    );

    res
      .status(200)
      .json({ message: "success", success: true, data: response.data }); // Send the response back to the client
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
