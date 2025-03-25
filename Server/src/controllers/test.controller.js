import testDatabaseConnection from "../utils/testdbconnection.util.js";

const testConnection = async (req, res) => {
  try {
    const result = await testDatabaseConnection(req.body);
    return res.status(result.success ? 200 : 500).json({
    message: "success",
    success: true,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Connection Unsucess",sucess: false });
  }
};

export default testConnection;
