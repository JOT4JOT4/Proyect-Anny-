# University Curriculum App

This project is a full-stack application designed to manage university curricula. It consists of a backend built with NestJS and a frontend developed using React and Vite.

## Project Structure

```
university-curriculum-app
├── backend
│   ├── src
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── curriculum
│   │   │   ├── curriculum.controller.ts
│   │   │   ├── curriculum.module.ts
│   │   │   └── curriculum.service.ts
│   │   └── main.ts
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components
│   │   │   └── Curriculum.tsx
│   │   └── types
│   │       └── index.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd university-curriculum-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

#### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Start the backend server:
   ```
   npm run start
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

### API Endpoints

The backend provides several API endpoints for managing the curriculum. Refer to the backend README.md for detailed information on available routes and their usage.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.