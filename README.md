
MERN Stack Application - Admin User Login, Agent Management, and CSV Upload Distribution
This application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and implements basic functionality for admin user login, agent creation and management, as well as uploading and distributing lists from a CSV file.

Features
Admin User Login: Allows an admin user to log in securely using JWT authentication.
Agent Management: Enables the creation and management of agents with details like name, email, mobile number, and password.
CSV Upload & Distribution: Provides the ability to upload a CSV file, validates the format, and distributes the list items equally among agents.
Table of Contents
Installation
Configuration
Usage
Technologies Used
Features Overview
Project Structure
Running the Application
Video Demonstration
Contributing
License
Installation
1. Clone the Repository
bash
Copy
git clone https://github.com/abhi3108new/Agent-Management
cd your-repository-name
2. Install Backend Dependencies
Navigate to the backend directory and install required dependencies.

bash
Copy
cd backend
npm install
3. Install Frontend Dependencies
Navigate to the frontend directory and install required dependencies.

bash
Copy
cd frontend
npm install
Configuration
Create a .env file in the root of the backend directory and set the following variables:
bash
Copy
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your secret key for JWT>
PORT=5000
Ensure that MongoDB is running, or connect to an external MongoDB database.
Usage
Start the Backend Server
To start the backend server, run:

bash
Copy
cd backend
npm run dev
This will start the server on http://localhost:5000.

Start the Frontend Development Server
To start the frontend server, run:

bash
Copy
cd frontend
npm run dev
This will start the React app on http://localhost:3000.

Access the Application
Once both servers are running, you can access the app by navigating to http://localhost:3000 in your browser.

Technologies Used
MongoDB: Database to store user and agent data, as well as distributed task lists.
Express.js: Web framework for the backend.
Node.js: Runtime environment for the backend.
React.js: Frontend framework for building the user interface.
JWT (JSON Web Token): Used for user authentication.
Multer: For handling file uploads (CSV and other formats).
CSV Parsing Libraries: For validating and reading the uploaded CSV file (e.g., csv-parser, papaparse).
Features Overview
1. Admin User Login
Admin can log in using email and password.
Authenticated using JWT for secure session management.
On successful login, the admin is redirected to the dashboard.
On failure, an error message is displayed.
2. Agent Management
Admin can create agents by entering:
Name
Email
Mobile Number (with country code)
Password (hashed)
Agent details are saved in MongoDB and displayed in the admin dashboard.
3. Upload CSV and Distribute Tasks
Admin can upload a CSV file containing:
FirstName (Text)
Phone (Number)
Notes (Text)
CSV file is validated to ensure it follows the correct format.
Tasks are distributed equally among 5 agents.
If the number of items is not divisible by 5, the remaining tasks are distributed sequentially.
The distributed task lists are stored in the MongoDB database and displayed on the frontend.
Project Structure
bash
Copy
/
├── backend/                  # Backend code (Node.js + Express.js)
│   ├── controllers/           # Contains route handlers
│   ├── models/                # Mongoose models
│   ├── routes/                # API route definitions
│   ├── .env                  # Environment variables
│   └── server.js             # Main server file
│
├── frontend/                  # Frontend code (React.js)
│   ├── components/            # React components
│   ├── pages/                 # React pages
│   ├── public/                # Static files (images, etc.)
│   ├── src/                   # Source files
│   └── package.json           # Frontend dependencies and scripts
│
├── .gitignore                 # Git ignore file
├── README.md                  # Project README file
└── package.json               # Root package.json (with backend and frontend scripts)
Running the Application
Backend
Make sure the backend server is running (as explained in the usage section).
Navigate to http://localhost:5000 to access backend APIs.
Frontend
Ensure the frontend server is running.
Navigate to http://localhost:3000 to access the application.
Video Demonstration
A video demonstration of the application will be uploaded to Google Drive. You can view the demo by following this link.

Contributing
We welcome contributions! If you would like to contribute, please follow these steps:

Fork the repository.
Create a new branch.
Implement your feature or fix.
Submit a pull request with a description of the changes.
License
This project is licensed under the MIT License - see the LICENSE file for deta