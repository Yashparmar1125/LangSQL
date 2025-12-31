# LangSQL - AI-Powered SQL Assistant

<div align="center">
  <img src="Client/public/Logo-White.png" alt="LangSQL Logo" width="200"/>
  <p><em>Transform natural language into powerful SQL queries.</em></p>
</div>

## Overview

LangSQL is an advanced web application that leverages artificial intelligence to help developers generate, translate, and optimize SQL queries. It features a modern three-tier architecture with a React frontend and two specialized backend servers - one for query processing and another for AI-powered natural language understanding.

## Architecture

### 1. Frontend (React + JavaScript)
- Modern React 18 application with JavaScript
- Real-time query building and execution
- Interactive data visualization
- Responsive and accessible UI
- State management with Redux Toolkit

### 2. Node.js Backend (Query Processing)
- Express.js server for query processing
- Multiple database support
- Query optimization and execution
- Real-time WebSocket communication
- Authentication and authorization

### 3. Django Backend (AI Processing)
- Django REST Framework for AI services
- Natural Language Processing capabilities
- Query translation and optimization
- Schema generation and validation
- MongoDB integration for flexible data storage

## Key Features

### 1. Natural Language to SQL
- Convert natural language descriptions into optimized SQL queries
- Support for multiple SQL dialects (Trino, Spark SQL)
- Context-aware query generation
- Real-time query suggestions and auto-completion
- Universal Sentence Encoder for better understanding

### 2. Schema Management
- Generate database schemas from natural language descriptions
- Visual schema representation
- Schema validation and optimization
- Support for multiple database types
- MongoDB integration for flexible data storage

### 3. Query Building & Execution
- Intuitive query builder interface
- Real-time query execution
- Performance optimization suggestions
- Query history and favorites
- Export query results in various formats
- Interactive data visualization with Nivo charts

### 4. Advanced Features
- Dark/Light mode support
- Responsive design for all devices
- Real-time collaboration
- Query templates and snippets
- Database connection management
- Firebase integration for real-time features
- Email notifications via EmailJS

## Tech Stack

### Frontend
- React 18 with JavaScript
- Vite for build tooling
- TailwindCSS for styling
- Monaco Editor for code editing
- React Router for navigation
- Framer Motion for animations
- Headless UI for accessible components
- Lucide Icons for UI elements
- Redux Toolkit for state management
- Nivo and Chart.js for data visualization
- TensorFlow.js for client-side ML
- Firebase for real-time features

### Node.js Backend
- Node.js with Express
- TypeScript
- Multiple database support
- RESTful API architecture
- Authentication and authorization
- Real-time WebSocket communication
- Query optimization engine

### Django Backend
- Django 5.1.7
- Django REST Framework
- MongoDB with Djongo
- Hugging Face Transformers
- PyTorch for ML models
- Natural Language Processing tools
- Schema validation and generation

## Prerequisites

- Node.js 16.x or later
- Python 3.8 or later
- npm 7.x or later
- Git
- MongoDB (for Django backend)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Yashparmar1125/LangSQL-Inspiron-4.0.git
   cd LangSQL
   ```

2. Set up the Django backend:
   ```bash
   cd DRF-Server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python manage.py migrate
   python manage.py runserver
   ```

3. Set up the Node.js backend:
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

4. Set up the frontend:
   ```bash
   cd Client
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
LangSQL/
├── Client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Static assets (images, fonts)
│   │   ├── Firebase/          # Firebase configuration
│   │   ├── redux/             # Redux state management
│   │   ├── contexts/          # React contexts
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Application entry point
│   │   ├── App.css            # Main application styles
│   │   └── index.css          # Global styles
│   ├── public/                # Public static files
│   └── package.json           # Frontend dependencies
│
├── Server/                     # Node.js backend
│   ├── src/
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Route controllers
│   │   ├── workers/           # Background workers
│   │   ├── services/          # Business logic
│   │   ├── extractors/        # Data extraction logic
│   │   ├── databaseHandlers/  # Database interaction
│   │   ├── utils/             # Utility functions
│   │   ├── models/            # Data models
│   │   ├── middlewares/       # Express middlewares
│   │   ├── factories/         # Factory patterns
│   │   ├── config/            # Configuration files
│   │   ├── validators/        # Input validation
│   │   └── server.js          # Server entry point
│   └── package.json           # Backend dependencies
│
├── DRF-Server/                 # Django backend
│   ├── LangSQL/               # Django project
│   │   ├── RESTAPI/           # REST API endpoints
│   │   ├── LangSQL/           # Django project settings
│   │   └── manage.py          # Django management script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── docs/                      # Documentation
│   ├── MultipleDB.md         # Multiple database documentation
│   ├── AutoCompleteFeature.md # Autocomplete feature docs
│   ├── JDBC-Approach.md      # JDBC implementation docs
│   ├── ExtractorFactory.md   # Extractor factory pattern docs
│   ├── MetaData_Extraction.md # Metadata extraction docs
│   ├── Client-Server-DRF-Communication.md # Communication docs
│   ├── DataBase_Schema.md    # Database schema docs
│   ├── KnexUsage.md          # Knex.js usage docs
│   └── CoreFeature.md        # Core features documentation
│
├── .vscode/                   # VS Code configuration
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

## Development

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Node.js Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript files
- `npm start` - Start production server
- `npm run test` - Run tests

### Django Backend
- `python manage.py runserver` - Start development server
- `python manage.py migrate` - Apply database migrations
- `python manage.py test` - Run tests
- `python manage.py collectstatic` - Collect static files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [React Router](https://reactrouter.com/) for routing
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Hugging Face](https://huggingface.co/) for ML models
- [MongoDB](https://www.mongodb.com/) for database support
- All contributors who have helped shape this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">
  Made with ❤️ by the LangSQL Team
</div>
