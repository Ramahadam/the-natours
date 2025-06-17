# Natours API

A Node.js RESTful API for managing tours, users, and bookings, built with Express and MongoDB.

## Features

- User authentication and authorization (JWT, password reset, roles)
- Tour CRUD operations
- User CRUD operations
- Data import/export scripts
- MVC architecture
- Static site rendering for overview and tour pages

## Project Structure

```
.
├── app.js
├── server.js
├── config.env
├── package.json
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── tourController.js
│   └── userController.js
├── models/
│   ├── tourModel.js
│   └── userModel.js
├── routes/
│   ├── tourRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
├── dev-data/
│   ├── data/
│   │   ├── import-dev-data.js
│   │   └── ...
│   └── templates/
├── public/
│   ├── overview.html
│   ├── tour.html
│   ├── css/
│   └── img/
└── ...
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Ramahadam/the-natours.git
   cd the-natours
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Copy `config.env` and update MongoDB credentials and other settings.

4. Import sample data (optional):
   ```sh
   node dev-data/data/import-dev-data.js --import
   ```

### Running the App

Start the development server:

```sh
npm run start
```

## API Endpoints

- `/api/v1/tours` - Tour routes
- `/api/v1/users` - User routes

See the controllers in [`controllers/`](controllers/) for more details.

## License

MIT
