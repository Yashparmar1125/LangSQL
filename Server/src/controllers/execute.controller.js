import executeQuery from "../utils/worker.util.js";
import Connection from "../models/connection.model.js";
import { decryptData } from "../services/aes.encryption.js";
import QueryHistory from "../models/queeryhistory.model.js";
import axios from "axios";
import {
  generateSQLWithOpenRouter,
  refineAndValidateSQLWithLLM,
} from "../services/openrouter.service.js";
import DatabaseMetadata from "../models/databasemetadata.model.js";
import { extractMetadata } from "../services/metadata.service.js";

const ddlRegex = /^\s*(CREATE|ALTER|DROP|TRUNCATE|RENAME|COMMENT)\s+/i;

export const executeDBQuery = async (req, res) => {
  try {
    const { query, connectionId, dialect } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }
    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "connectionId is required",
      });
    }
    const userId = req.user.userId;

    const connection = await Connection.findOne({
      userId,
      _id: connectionId,
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    let decryptedConnection;
    try {
      decryptedConnection = decryptData(connection.connectionData, userId);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or outdated connection data. Please re-connect your database.",
      });
    }

    const body = {
      dbType: String(decryptedConnection.type || "").toLowerCase(),
      username: decryptedConnection.username,
      password: decryptedConnection.password,
      host: decryptedConnection.host,
      port: Number(decryptedConnection.port),
      database: decryptedConnection.database,
      query: query,
    };

    const result = await executeQuery(body);

    // Convert execution time from string (e.g., "3ms") to number (milliseconds)
    const executionTimeStr = result?.data?.metadata?.executionTime || "0ms";
    const responseTime =
      parseInt(String(executionTimeStr).replace(/[^0-9]/g, "")) || 0;

    // if (ddlRegex.test(query)) {
    //   const metadata = await extractMetadata(decryptedConnection);
    //   const newMetaData = await DatabaseMetadata.findOne({
    //     userId,
    //     connectionId: connectionId,
    //   });

    //   if (newMetaData) {
    //     newMetaData.tables = metadata.tables;
    //     await newMetaData.save();
    //   }
    // }

    // Create query history entry
    await QueryHistory.create({
      userId,
      query,
      status: result.success ? "success" : "failed",
      dbName: decryptedConnection.database,
      error: result.success ? "" : result.message || "Query execution failed",
      response: result.data,
      responseTime: String(responseTime),
      rows: String(result?.data?.metadata?.rowCount ?? 0),
      affectedRows: String(result?.data?.metadata?.affectedRows ?? 0),
    });

    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.success
        ? "Query executed successfully"
        : "Query execution failed",
      data: result.data,
      ...(result.success
        ? {}
        : { error: result.message || `Unknown error (dbType=${body.dbType})` }),
    });
  } catch (error) {
    // Log error for debugging but send safe message to client
    console.error("Query execution error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while executing the query",
    });
  }
};

export const generateQuery = async (req, res) => {
  try {
    const { message, database, dialect } = req.body;
    console.log(req.body);
    const userId = req.user.userId;

    const metaData = await DatabaseMetadata.findOne({
      userId,
      connectionId: database,
    });

    if (!metaData) {
      return res.status(404).json({
        success: false,
        message: "Database metadata not found",
      });
    }

    const cleanedMetaData = {
      db_name: metaData.db_name,
      tables: metaData.tables,
    };
    console.log(cleanedMetaData);

    if (dialect === "trino" || dialect === "spark") {
      const result = await generateSQLWithOpenRouter(req.body, cleanedMetaData);
      const data = { sql_query: result.data?.query };

      return res.status(result.success ? 200 : 500).json({
        success: result.success,
        message: result.success
          ? "Query generated successfully"
          : result.message || "Failed to generate query",
        data,
      });
    }

    let sqlQuery = null;
    let originalDrfQuery = null;
    let wasModified = false;
    let confidenceScore = 0.95;

    // 1. First attempt generation directly via OpenRouter (fast, high-throughput, never OOMs)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const openRouterRes = await generateSQLWithOpenRouter(req.body, cleanedMetaData);
        if (openRouterRes.success && openRouterRes.data?.query) {
          return res.status(200).json({
            success: true,
            message: "Query generated successfully",
            data: {
              sql_query: openRouterRes.data.query,
              was_modified: false,
              confidence_score: 0.98,
            },
          });
        }
      } catch (orErr) {
        console.warn("OpenRouter direct generation error, trying DRF:", orErr.message);
      }
    }

    // 2. Fallback to DRF PyTorch model if OpenRouter is unavailable
    const token = process.env.DRF_SERVICE_TOKEN;
    const host = process.env.DRF_SERVER_HOST;

    if (token && host) {
      try {
        const response = await axios.post(
          `${host}api/generate-sql/`,
          {
            user_id: userId,
            question: message,
            connectionId: database,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );
        originalDrfQuery = response.data?.sql_query;

        if (originalDrfQuery) {
          const refinedResult = await refineAndValidateSQLWithLLM({
            rawQuery: originalDrfQuery,
            question: message,
            dialect: dialect || "mysql",
            metadata: cleanedMetaData,
          });

          sqlQuery = refinedResult.sql_query;
          wasModified = refinedResult.was_modified;
          confidenceScore = refinedResult.confidence_score;
        }
      } catch (drfErr) {
        console.error("DRF fallback error:", drfErr.message);
      }
    }

    if (!sqlQuery) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate query across available AI models. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Query generated and verified successfully",
      data: {
        sql_query: sqlQuery,
        original_drf_query: originalDrfQuery,
        was_modified: wasModified,
        confidence_score: confidenceScore,
      },
    });
  } catch (error) {
    console.error("Query generation error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating the query",
    });
  }
};
