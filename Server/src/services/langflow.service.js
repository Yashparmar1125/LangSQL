import { LangflowClient } from "@datastax/langflow-client";

export const LangFlowService = async (req, res) => {
  try {
    const { inputValue } = req.body;
    const langflowId = process.env.LANGFLOW_ID;
    const flowId = process.env.FLOW_ID;
    const apiKey = process.env.LANGFLOW_API_KEY;

    const client = new LangflowClient({ langflowId, apiKey });
    const flow = client.flow(flowId);
    const result = await flow.run(JSON.stringify(inputValue));

    return result;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server err" });
  }
};
