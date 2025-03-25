import postgreSQLExecution from "../workers/postgresql.worker.js";
import mySQLExecution from "../workers/mysql.worker.js";
import sparkExecution from "../workers/spark.worker.js";
import trinoExecution from "../workers/trino.worker.js";

export const executeQuery = async (req, res) => {
    const { type, host, port, username, password, database, query, url } = req.body;

    try {
        let result;
        
        switch (type) {
            case "postgres":
                result = await postgreSQLExecution({ host, port, username, password, database, query });
                break;
            case "mysql":
                result = await mySQLExecution({ host, port, username, password, database, query });
                break;
            case "spark":
                result = await sparkExecution({ url, user: username, password });
                break;
            case "trino":
                result = await trinoExecution({ host, port, username, password, database, query });
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid database type" });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
