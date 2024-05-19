# Automated Email Sequencer

`Automated Email Sequencer` is a `MERN Stack` web application that allows users to create and manage automated email sequences using a flowchart interface. This application uses `React Flow` for visualizing the flowchart, `Agenda` for email scheduling, and `Nodemailer` for sending emails.

## Features

- **Flowchart Interface**: Intuitive interface for creating email sequences.
- **Node Types**:
  - **Lead-Source**: Defines the recipient of the email sequence.
  - **Cold-Email**: Represents an email to be sent with a subject and content.
  - **Wait/Delay**: Adds a delay between emails.
- **Scheduling**: Automatically schedules and sends emails based on the flowchart.
- **Modal Forms**: Easy-to-use forms for adding and editing nodes.
- **Backend Integration**: Node and edge data are sent to the backend to start the email sequence process.

## Technologies Used

- **Frontend**:
  - React
  - React Flow
  - Axios
  - Modal from react-modal
- **Backend**:
  - Node.js
  - Express
  - Agenda
  - Nodemailer
  - MongoDB (via Mongoose)

## Installation

### Create .env

Create .env files for both frontend and backend separately and fill them as per .env.sample

### Install dependencies

```bash
# Backend

cd backend
npm install

# Frontend

cd frontend
npm install
```

### Start the Backend & Frontend

```bash
# Backend

cd backend
npm run dev

# Frontend

cd frontend
npm run dev
```

### Open the application

Open your browser and navigate to http://localhost:5173 to view the application.
