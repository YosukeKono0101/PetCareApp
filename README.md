# PetCare App

## Purpose

PetCareApp is a comprehensive solution for managing your pets' health and wellness. The application offers features to track vaccinations, health logs, and general pet information, ensuring you have all the necessary data to care for your pets effectively.

## Contributing

We welcome contributions from the community to help improve the PetCare App. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature YourFeatureName).
3. Make your changes and commit them (git commit -am 'Add some feature').
4. Push to the branch (git push origin feature/YourFeatureName).
5. Create a new Pull Request.

## Features

- User Authentication (login and signup)
- Add, edit, and delete pet details
- Track health logs and vaccination records for pet
- View detailed information for each pet, health log, and vaccination record
- Switch between light and dark themes
- Customize font size for better accessibility

## Dependencies

The application relies on several key dependencies:

- **Node.js (version 12 or higher)**
- **React Native (version 0.63 or higher)**
- **Express.js**
- **react-native-picker-select**
- **@react-native-community/slider**
- **FontAwesome**

To install these dependencies, navigate to your project directory and run:

```
npm install
```

## Architecture

The application is divided into server and client parts.

The server side, in the server directory, includes:

- **controllers**: Handles requests related to authentication, pets, health logs, and vaccinations.
- **middlewares**: Contains authentication middleware.
- **routes**: Defines routes for various features.
- **config**: Holds configuration files, including database and Swagger settings.
- **app.js**: Initializes the Express application and sets up routes.
- **server.js**: Starts the server.
- **.env**: Stores environment variables.

The client side, in the client/src directory, includes:

- **context**: Manages application settings.
- **screens**: Contains screens for pets, health logsm vaccinations, authentication, about, and settings.
- **components**: Reusable UI components.
- **AppNavigator.js**: Configures navigation.
- **HomeScreen.js and LandingPageScreen.js**: Serve as home and landing page components.

This structure ensures maintainability and clear separation of concerns.

## Issue Reporting

If you encounter any issues or have any suggestions for improvement, please report them on the GitHub repository's issue tracker. When reporting issues, please provide detailed steps to reproduce the problem and any relevant error messages.

## API Documentation using Swagger

The API for PetCareApp is documented using Swagger. You can access the API documentation by visiting /api-docs on your local server. The Swagger documentation provides detailed information about the available endpoints, request parameters, and responses.
