import QueryHistory from "../models/queeryhistory.model.js";
import PromptHistory from "../models/prompthistory.model.js";

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await QueryHistory.find({ userId }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ sucess: true, message: "History fetched successfully", history });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

export const getPromptHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await PromptHistory.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      sucess: true,
      message: "Prompt history fetched successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};
