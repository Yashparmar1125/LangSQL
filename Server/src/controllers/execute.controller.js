import executeQuery from "../utils/worker.util.js";

export const executeDBQuery = async (req, res) => {
  try {
    console.log(req.body);
    const result = await executeQuery(req.body);
    return res.status(result.success ? 200 : 500).json({
      message: "success",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
