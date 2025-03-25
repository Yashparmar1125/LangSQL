import trinoClient from "trino-client"; 


async function testTrinoConnection({ host, port, user, catalog, schema }) {
    try {
        const client = new Client({
            host,
            port,
            user,
            catalog,
            schema
        });

        return new Promise((resolve, reject) => {
            client.query("SELECT 1", (error, data) => {
                if (error) {
                    reject({ success: false, message: "Trino connection failed", error });
                } else {
                    resolve({ success: true, message: "Trino connection successful", data });
                }
            });
        });
    } catch (error) {
        return { success: false, message: "Error in Trino handler", error };
    }
}

export default testTrinoConnection;
