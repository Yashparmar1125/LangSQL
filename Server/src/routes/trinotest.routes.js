import express from "express";
import testTrinoConnection from "../databaseHandlers/trino.handler.js"; // Import the connection function

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

export default router;
