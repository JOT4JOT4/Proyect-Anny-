# University Curriculum App

This project is a full-stack application designed to manage university curricula. It consists of a backend built with NestJS and a frontend developed using React and Vite.

## Backend

The backend is responsible for handling requests related to curriculum data. It provides a RESTful API for CRUD operations on curriculum items.

### Structure

- **src/**
  - **app.controller.ts**: Handles incoming requests and returns responses.
  - **app.module.ts**: The root module of the application, importing other modules.
  - **app.service.ts**: Contains business logic and data handling.
  - **curriculum/**
    - **curriculum.controller.ts**: Manages requests related to the curriculum.
    - **curriculum.module.ts**: Encapsulates curriculum-related components.
    - **curriculum.service.ts**: Logic for managing curriculum data.
  - **main.ts**: Entry point of the backend application.

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run start
   ```

## Frontend

The frontend provides a user interface for interacting with the curriculum data. It communicates with the backend API to display and manage curriculum information.

### Structure

- **src/**
  - **App.tsx**: Main component of the React application.
  - **main.tsx**: Entry point of the frontend application.
  - **components/**
    - **Curriculum.tsx**: Displays curriculum-related information.
  - **types/**
    - **index.ts**: TypeScript interfaces and types.

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.