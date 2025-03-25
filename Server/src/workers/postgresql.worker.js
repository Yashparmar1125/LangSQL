import pkg from 'pg';
const { Client } = pkg;

const postgreSQLExecution = async ({ host, port, username, password, database ,query}) => {
    let client;
    try {
        client = new Client({ host, port, user: username, password, database });
        await client.connect();
        console.log("Connected to PostgreSQL");
        const result = await client.query(query);
        console.log("Query Result:", result.rows);
        return { success: true, message: 'PostgreSQL connection successful', data: result.rows };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (client) await client.end(); 
        console.log("Connection closed");
    }
};

export default postgreSQLExecution;

