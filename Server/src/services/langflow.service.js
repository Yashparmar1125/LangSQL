import { LangflowClient } from "@datastax/langflow-client";

export const LangFlowService = async (body, metaData) => {
  try {
    const inputValue = {
      query: body.message,
      metadata: metaData,
      dialect: body.dialect,
    };
    const langflowId = process.env.LANGFLOW_ID;
    const flowId = process.env.FLOW_ID;
    const apiKey = process.env.LANGFLOW_API_KEY;

    const client = new LangflowClient({ langflowId, apiKey });
    const flow = client.flow(flowId);
    const result = await flow.run(JSON.stringify(inputValue));
    const data =
      result.outputs[0].outputs[0].results.message.data.text.match(/\{.*\}/s);
    console.log(data);

    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
