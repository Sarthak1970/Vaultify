# Vaultify

Vaultify is a web application designed to provide anonymous and secure storage for user secrets. It allows users to submit, store, and retrieve their secrets in a safe and anonymous manner. Built using **Node.js**, **Express**, and **PostgreSQL**, Vaultify integrates **Google Authentication** to provide a seamless login and registration process. 
<img src="https://w7.pngwing.com/pngs/788/651/png-transparent-code-development-logo-nodejs-logos-icon-thumbnail.png" style="display: inline-block; width: 100px;" />
<img src="https://w7.pngwing.com/pngs/358/849/png-transparent-postgresql-database-logo-database-symbol-blue-text-logo-thumbnail.png" style="display: inline-block; width: 100px;" />



This project is an ideal solution for anyone looking to securely store and manage sensitive information anonymously, with the added advantage of using modern backend technologies.

---

## Features

- **Anonymous Secrets Storage**: Vaultify allows users to submit and store their secrets without revealing their identity. Secrets are stored securely and privately in the database.
- **Google Authentication**: Users can sign up or log in to the application using their Google account, making the authentication process smooth and efficient.
- **PostgreSQL Integration**: User data, including their secrets, is securely stored in a **PostgreSQL** database, ensuring high performance and reliability.
- **Session Management**: The app uses secure sessions to track users' logins, ensuring that their secrets are accessible only to them during an active session.
- **Easy-to-Use Interface**: Vaultify offers an intuitive web interface to submit and view secrets, ensuring a seamless user experience.

---

## Installation

To set up **Vaultify** locally, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **PostgreSQL** (local database setup or use a remote instance)

### Steps

1. **Clone the Repository**

   Clone the project repository to your local machine using the following command:

   ```bash
   git clone https://github.com/Sarthak1970/Vaultify.git

2. **Navigate to Repository**
      ```bash
   cd Vaultify

3. **Install Dependencies**

   Navigate to the project directory and install the required dependencies using npm:

   ```bash
   cd Vaultify
   npm install
   
4. **Set Up Environment Variables**

    Create a .env file in the root of the project and add the following environment variables:

   ```bash
   USER=<your_database_user>
    HOST=localhost
    DATABASE=<your_database_name>
    PASSWORD=<your_database_password>
    PORT=5432
    SESSION_SECRET=<your_session_secret>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>

5. **Set Up PostgreSQL Database**

    Make sure PostgreSQL is running, then create a database and a table for storing user data:
      ```bash
    CREATE DATABASE vaultify;
    \c vaultify
    CREATE TABLE users (
    email VARCHAR PRIMARY KEY,
    password VARCHAR,
    secret TEXT
    );
      
6. **Run the Application**

   Start the application by running the following command:
      ```bash
   npm start


 

## Technologies Used

- **Node.js**: A runtime environment to build scalable network applications using JavaScript.
- **Express**: A web application framework for Node.js that simplifies routing and middleware handling.
- **PostgreSQL**: A relational database system used to store user data and secrets securely.
- **Google Authentication**: OAuth2-based authentication method provided by Google to securely log users into the application.
- **bcrypt**: A password hashing library used to securely store user passwords.

---

## How It Works

1. **Authentication**: Users can authenticate through Google using OAuth2, making the sign-up and login process fast and secure. Once logged in, users are redirected to their profile page.
2. **Submit a Secret**: After logging in, users can submit their secret via a simple form. These secrets are then stored securely in the PostgreSQL database, associated with the user's account.
3. **Access Secrets**: Users can access their submitted secrets via their profile page. Secrets are displayed in a private, secure manner, ensuring only the authenticated user can view them.
4. **Logout**: Users can log out of the application, terminating the session and clearing all associated data.

---

## Usage

1. **Visit the Application**: Once set up locally or deployed, you can visit the application at `http://localhost:3000` or your deployed URL.
2. **Sign Up or Login**: Use the "Sign up with Google" option to log in or create a new account.
3. **Submit a Secret**: Navigate to the "Submit Secret" page and add your anonymous secret.
4. **View Your Secrets**: Access your stored secrets through the "Secrets" page.
5. **Logout**: Logout by clicking the logout button, ensuring your session is terminated securely.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- **Node.js** and **Express** communities for providing powerful tools to build fast and scalable applications.
- **PostgreSQL** for its reliability and robustness as a relational database system.
- **Google** for providing easy-to-use OAuth2 authentication via Google Sign-In.
- **bcrypt** for ensuring secure password hashing.

---

