# 🗓️ Appointment Management System

This project is a lightweight web-based appointment management tool designed for institutions (e.g., clinics or therapy centers) where individual therapists schedule one-on-one meetings with participants.

## 🔍 Overview

The system allows:

- Creating participants with their name and email
- Scheduling appointments between a single participant and a therapist
- Viewing, listing, and deleting appointments and participants

## ✅ Key Features

- **Single Participant Per Appointment**: Each appointment is one-on-one, involving exactly one participant. This simplifies the scheduling logic and better reflects therapist–client interactions.
- **No Overlapping Appointments for a Participant**: A participant cannot have two overlapping appointments, ensuring schedule integrity.
- **Auto-Generated Titles and Descriptions**: Titles like `Meeting with John Doe` and descriptions like `Meeting with John Doe starts at 3:00 PM and ends at 4:00 PM` are auto-generated to minimize input errors and maintain consistency.
- **Upcoming Appointments Dashboard**: The homepage summarizes upcoming meetings and key stats.
- **Participant-First Scheduling**: Appointment creation is dependent on selecting an existing participant by email, aligning with real-world workflows where clients must be onboarded before meetings.

## 🔁 Appointment Flow Rationale

1. **Participant Created First**: Since each appointment is tied to an individual participant, users must first be added to the system with an email.
2. **Appointment Tied to Email**: When creating an appointment, the participant’s email is used to match the correct individual server-side.
3. **Auto Title & Description**: Reduces manual input for admins, and ensures all appointment records are easy to scan and understand.
4. **Prevent Overlaps**: Backend ensures that a participant cannot be double-booked during overlapping times.
5. **Simplified Backend API**: No editing functionality yet—appointments can only be created or deleted.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **State Management**: React Query
- **Backend**: REST API (Symfony, hosted on EC2)

**Live Frontend Domain** - http://51.20.183.50:5173/

## 📦 Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Ensure your `.env` or `api.ts` base URL points to the backend:

   ```ts
   const BASE_URL = "http://<your-backend-ip>:8000/api";
   ```
