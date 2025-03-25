import executeQuery from "../utils/worker.util.js";
import Connection from "../models/connection.model.js";
import { decryptData } from "../services/aes.encryption.js";
import QueryHistory from "../models/queeryhistory.model.js";

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
