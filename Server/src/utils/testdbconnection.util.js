import { getDBHandler } from "../databaseHandlers/dbRegistry.js";

const testDatabaseConnection = async (dbConfig) => {
  const handler = getDBHandler(dbConfig.dbType);
  console.log(handler);
  console.log(typeof handler);
  if (!handler) {
    return {
      success: false,
      message: `Database type '${dbConfig.dbType}' is not supported.`,
    };
  }
  return await handler(dbConfig);
};

export default testDatabaseConnection;
