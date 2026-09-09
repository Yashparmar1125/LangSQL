import pkg from 'pg';
const { Client } = pkg;

const testPostgreSQLConnection = async ({ host, port, username, password, database, ssl }) => {
    try {
        const client = new Client({
            host,
            port,
            user: username,
            password,
            database,
            ssl: ssl !== undefined ? ssl : (host && !['localhost', '127.0.0.1'].includes(host) ? { rejectUnauthorized: false } : false)
        });
        await client.connect();
        await client.end();
        return { success: true, message: 'PostgreSQL connection successful' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default testPostgreSQLConnection;
