import Trino from 'trino-client';

const trinoExecution = async ({ host, port, user, catalog, schema }) => {
    let client;
    try {
        client = new Trino.Client({ 
            server: `${host}:${port}`, 
            user: user 
        });
        console.log("Connected to Trino");
        const result = await new Promise((resolve, reject) => {
            client.query({
                query: `SHOW TABLES FROM ${catalog}.${schema}`,
                success: (data) => resolve(data),
                error: (error) => reject(error)
            });
        });

        console.log("Query Result:", result);
        return { success: true, message: 'Trino connection successful', data: result };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        console.log("Closing Trino connection (stateless, no explicit disconnect needed)");
    }
};

export default trinoExecution;
