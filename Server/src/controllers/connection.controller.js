import Connection from "../models/connection.model.js";
import DatabaseMetadata from "../models/databasemetadata.model.js";
import { extractMetadata } from "../services/metadata.service.js";

import { decryptData } from "../services/aes.encryption.js";
// Create a new connection
export const createConnection = async (req, res) => {
  const { connectionData } = req.body;
  const userId = req.user.userId;

  try {
    const decryptedData = decryptData(connectionData, userId);
    const metaDetailes = {
      host: decryptedData.host,
      port: decryptedData.port,
      user: decryptedData.username,
      password: decryptedData.password,
      database: decryptedData.database,
      db_type: decryptedData.type,
    };
    const metadata = await extractMetadata(metaDetailes);

    if (!metadata) {
      return res.status(500).json({
        sucess: false,
        message: "Connection failed. Please check your credentials",
      });
    }
    const connection = new Connection({
      connectionData,
      status: "connected",
      lastConnected: new Date(),
      userId,
      metadata,
    });
    await connection.save();
    const metaData = new DatabaseMetadata({
      userId: userId,
      connectionId: connection._id,
      db_name: metadata.db_name,
      tables: metadata.tables,
    });
    await metaData.save();
    res.status(201).json({
      sucess: true,
      message: "Connection created successfully",
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// Get all connections
export const getConnection = async (req, res) => {
  try {
    const userId = req.user.userId;
    const connections = await Connection.find({ userId });
    res.status(200).json({
      sucess: true,
      message: "Connections fetched successfully",
      data: { connections },
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// Update a connection
export const updateConnection = async (req, res) => {
  const { connectionData } = req.body;
  const userId = req.user.userId;

  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { connectionData, userId },
      { new: true }
    );
    res.status(200).json({
      sucess: true,
      message: "Connection updated successfully",
      connection,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// Delete a connection
export const deleteConnection = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Connection.findByIdAndDelete(req.params.id, { userId });
    res
      .status(200)
      .json({ sucess: true, message: "Connection deleted successfully" });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

export const getMetadata=async(req,res)=>{
  try {
    const userId=req.user.userId;
    const connectionId=req.params.id;
    const metadata=await DatabaseMetadata.findOne({userId,connectionId});
    if(!metadata){
      return res.status(404).json({sucess:false,message:"Metadata not found"});
    }
    res.status(200).json({sucess:true,message:"Metadata fetched successfully",metadata});
  } catch (error) {
    res.status(500).json({sucess:false,message:error.message});
  }
}
