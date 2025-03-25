import mysql from 'mysql2/promise';

const testMySQLConnection = async ({ host, port, username, password, database, query }) => {
    let connection;
    try {
        connection = await mysql.createConnection({ host, port, user: username, password, database });

        console.log("Connected to MySQL");
        const [rows] = await connection.execute(query);

        console.log("Query Result:", rows);

        return { success: true, message: 'MySQL connection successful', data: rows };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) await connection.end(); 
        console.log("Connection closed");
    }
};

export default testMySQLConnection;
