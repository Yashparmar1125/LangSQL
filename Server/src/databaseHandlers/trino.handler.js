import axios from "axios";

async function testTrinoConnection({ host, port }) {
  console.log("reached");

  try {
    const response = await axios.get(`http://${host}:${port}/v1/info`);

    if (response.status === 200) {
      return { success: true, message: "Trino is reachable" };
    } else {
      return {
        success: false,
        message: `Trino responded with status ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to connect to Trino",
      error: error.message,
    };
  }
}

export default testTrinoConnection;
