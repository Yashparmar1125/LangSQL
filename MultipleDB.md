To implement the scalable and maintainable approach for handling dynamic database connections in an **Express.js** API server project, we can follow a structured approach that utilizes **Factory Pattern**, **Dependency Injection**, and a database management system (e.g., Sequelize, Knex.js) for handling SQL dialects. Here's how you can organize and implement the solution within your project directory.

### **Project Structure**

Here’s a recommended structure for the Express.js API server:

```
langsql/
│
├── config/
│   ├── dbConfig.js                # Configuration for database connection
│   ├── dbConnectionFactory.js      # Factory class for database connection
│
├── models/
│   ├── userModel.js                # Example ORM model (Sequelize)
│
├── services/
│   ├── databaseService.js          # Service for query execution
│
├── routes/
│   ├── queryRoute.js               # Route to handle user queries
│
├── controllers/
│   ├── queryController.js          # Logic to handle user query requests
│
├── utils/
│   ├── errorHandler.js             # Utility for error handling
│
├── app.js                          # Express app setup
└── package.json
```

---

### **Step-by-Step Implementation**

#### 1. **Configure Database Connection**

In the `config/dbConfig.js`, you'll define the connection configurations for different databases. You can use `Sequelize`, `Knex.js`, or any other database client here. The example below uses `Sequelize` for MySQL and PostgreSQL.

**config/dbConfig.js**:
```javascript
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mysql_dbname',
    dialect: 'mysql',
  },
  postgres: {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'postgres_dbname',
    dialect: 'postgres',
  },
  // Add configurations for more DB types (MariaDB, SQLite, etc.)
};
```

#### 2. **Create a Database Connection Factory**

This factory will be responsible for dynamically creating database connections based on the user's selected database type. The factory will return instances of database classes that implement a common interface.

**config/dbConnectionFactory.js**:
```javascript
const { Sequelize } = require('sequelize');
const dbConfig = require('./dbConfig');

class Database {
  constructor() {
    if (this.constructor === Database) {
      throw new Error('Abstract class "Database" cannot be instantiated directly.');
    }
  }

  async connect() {
    throw new Error('Method "connect" must be implemented');
  }

  async executeQuery(query) {
    throw new Error('Method "executeQuery" must be implemented');
  }
}

class MySQLDatabase extends Database {
  constructor() {
    super();
    this.connection = new Sequelize(dbConfig.mysql);
  }

  async connect() {
    try {
      await this.connection.authenticate();
      console.log('MySQL Connection established');
    } catch (error) {
      console.error('MySQL Connection failed:', error);
    }
  }

  async executeQuery(query) {
    try {
      return await this.connection.query(query);
    } catch (error) {
      throw new Error('Error executing query:', error);
    }
  }
}

class PostgresDatabase extends Database {
  constructor() {
    super();
    this.connection = new Sequelize(dbConfig.postgres);
  }

  async connect() {
    try {
      await this.connection.authenticate();
      console.log('Postgres Connection established');
    } catch (error) {
      console.error('Postgres Connection failed:', error);
    }
  }

  async executeQuery(query) {
    try {
      return await this.connection.query(query);
    } catch (error) {
      throw new Error('Error executing query:', error);
    }
  }
}

// Database Factory Class
class DatabaseFactory {
  static getDatabaseConnection(dbType) {
    switch (dbType) {
      case 'mysql':
        return new MySQLDatabase();
      case 'postgres':
        return new PostgresDatabase();
      // Add more cases for other databases (e.g., MariaDB, SQLite)
      default:
        throw new Error('Unsupported database type');
    }
  }
}

module.exports = DatabaseFactory;
```

#### 3. **Create a Service to Handle Database Operations**

The `databaseService.js` will act as a middle layer between the controller and the database. This service will be responsible for receiving queries from the controller, executing them via the appropriate database connection, and returning the result.

**services/databaseService.js**:
```javascript
const DatabaseFactory = require('../config/dbConnectionFactory');

class DatabaseService {
  constructor(dbType) {
    this.dbType = dbType;
    this.database = DatabaseFactory.getDatabaseConnection(dbType);
  }

  async executeQuery(query) {
    try {
      await this.database.connect();
      const result = await this.database.executeQuery(query);
      return result;
    } catch (error) {
      throw new Error('Error executing query in database service:', error);
    }
  }
}

module.exports = DatabaseService;
```

#### 4. **Create a Controller for Handling API Logic**

In the `queryController.js`, you will handle incoming API requests. This controller will interact with the `DatabaseService` to execute the user’s SQL queries and send the response.

**controllers/queryController.js**:
```javascript
const DatabaseService = require('../services/databaseService');

class QueryController {
  static async executeQuery(req, res) {
    const { dbType, query } = req.body;  // dbType (e.g., 'mysql', 'postgres') and query are provided by the user

    if (!dbType || !query) {
      return res.status(400).json({ error: 'Database type and query are required' });
    }

    try {
      const dbService = new DatabaseService(dbType);
      const result = await dbService.executeQuery(query);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = QueryController;
```

#### 5. **Define Routes for API**

Define the routes in `queryRoute.js` to handle API requests. Here, we’ll add a route for executing queries.

**routes/queryRoute.js**:
```javascript
const express = require('express');
const router = express.Router();
const QueryController = require('../controllers/queryController');

router.post('/execute-query', QueryController.executeQuery);

module.exports = router;
```

#### 6. **Set Up Express Application**

Finally, configure the main Express app (`app.js`) and link all the routes.

**app.js**:
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const queryRoute = require('./routes/queryRoute');

const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Routes
app.use('/api', queryRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

### **How It Works**

1. **User Request**: When a user sends a POST request to `/api/execute-query` with the `dbType` (e.g., `mysql`, `postgres`) and `query` (SQL query string), the `QueryController` handles the request.
2. **Service Layer**: The controller passes the request data to the `DatabaseService`, which in turn uses the `DatabaseFactory` to get the appropriate database connection (e.g., `MySQLDatabase` or `PostgresDatabase`).
3. **Database Execution**: The database connection executes the query, and the result is sent back to the client.

---

### **Advantages of This Approach**
- **Extensible**: You can easily add new database types by creating new classes that extend the `Database` class and updating the factory method.
- **Separation of Concerns**: The controller handles only the request/response logic, the service layer handles database operations, and the factory class manages database creation. This modularity makes the code easier to maintain.
- **Scalable**: New databases or features can be added without significant changes to the core logic, following clean design principles like **DRY** (Don’t Repeat Yourself) and **SOLID**.

This approach allows for **dynamic switching** between multiple database types while maintaining a clean, modular architecture that's easy to scale as the number of supported databases grows.