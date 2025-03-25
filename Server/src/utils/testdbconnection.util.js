import { getDBHandler } from "../databaseHandlers/dbRegistry.js";

const testDatabaseConnection = async (dbConfig) => {
  const handler = getDBHandler(dbConfig.dbType);
  if (!handler) {
    return {
      success: false,
      message: `Database type '${dbConfig.dbType}' is not supported.`,
    };
  }
  const dbType = dbConfig.dbType;
  return await handler(dbConfig);
};

export default testDatabaseConnection;
