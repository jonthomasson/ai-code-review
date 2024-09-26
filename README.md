# CodeAiReview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.4.

## Overview

The **CodeAiReview** project integrates Firebase authentication for signing in with GitHub, retrieves repository and pull request data from the GitHub API, and sends pull request file changes to a .NET Core API for AI-driven code review suggestions.

## Prerequisites

Before running the project, make sure you have the following:
- [Node.js](https://nodejs.org/)
- [Firebase Project](https://firebase.google.com/) with GitHub authentication enabled.
- [GitHub Developer Account](https://github.com/settings/developers) with a registered OAuth app.
- A running instance of the [.NET Core API](https://github.com/yourusername/code-review-api).

### Setting up Firebase GitHub Authentication

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable GitHub as a sign-in provider under **Authentication** > **Sign-in method**.
3. Register an OAuth app in GitHub, providing the Firebase callback URL.
4. Add the **GitHub Client ID** and **Client Secret** to Firebase.
5. Copy the firebaseConfig over from Firebase Console to your environment file like this:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5103/api',
  firebaseConfig: {
    
  }
};```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Firebase Authentication and GitHub Integration

### Firebase Authentication
The application uses Firebase for authentication, allowing users to sign in with their GitHub credentials. Once authenticated, the GitHub token is stored locally and used to interact with the GitHub API.

### GitHub Integration
After signing in, the user can select one of their repositories and pull requests, and view the file changes. The application retrieves this data using the GitHub API.

### AI Review API Interaction
The file changes from a pull request are sent to the backend .NET Core API, which is authenticated using the Firebase token. The API uses Azure's ChatGPT to provide code review suggestions and returns them to the client for display.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## API Configuration

In order to interact with the backend API, the client uses the Firebase authentication token. Ensure the .NET Core API is running locally or in the cloud and the URL is configured in the client code (`environment.ts`).

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7148/api/review'
};
