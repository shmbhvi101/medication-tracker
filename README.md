# MediTrack - Medication Tracking Application

A fully functional, modern medication tracking application built with MERN (MongoDB, Express, React, Node.js) stack. This app helps users manage medications, receive reminders, and track medication stock with an attractive UI.

<img width="1318" height="654" alt="image" src="https://github.com/user-attachments/assets/ba18f20a-f531-4bf4-9b13-aa4a99a783eb" />
<img width="1283" height="653" alt="image" src="https://github.com/user-attachments/assets/c7ac0112-cdec-43c6-bd5f-6b0faafd9bb5" />
<img width="1282" height="653" alt="image" src="https://github.com/user-attachments/assets/8d296d16-7355-4cd8-ad58-10e6f4ee4ae4" />
<img width="1279" height="650" alt="image" src="https://github.com/user-attachments/assets/4590f40c-cae9-4304-8cc8-940681945cf8" />




## Features

### Core Functionality
- **Medication Management**: Add, edit, and delete medications with dosage and frequency
- **Reminder System**: Set multiple daily reminder times for each medication
- **Dose Tracking**: Mark doses as taken or skipped with persistent history
- **Stock Management**: Automatic stock reduction on dose intake, low-stock alerts
- **Today's Schedule**: Real-time view of all doses due today with status tracking

### UI Features
- **Beautiful Modern Design**: Gradient backgrounds, smooth animations, glassmorphism effects
- **Responsive Layout**: Fully responsive across desktop, tablet, and mobile devices
- **3-Screen Architecture**: Medications list, Today's schedule, and Add/Edit form
- **Real-time Updates**: All changes persist and update instantly
- **Visual Feedback**: Color-coded stock levels, status badges, and progress indicators

## Installation & Setup

### Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone or Create Project
```bash
mkdir medication-tracker
cd medication-tracker
```

### Step 2: Setup Backend

```bash
mkdir server
cd server
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/medication-tracker
PORT=5000
```

Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Copy all backend files:
- `server.js` → `server/server.js`
- `Medication.js` → `server/models/Medication.js`
- `medications.js` → `server/routes/medications.js`

### Step 3: Setup Frontend

```bash
cd ../
npm create vite@latest client -- --template react
cd client
npm install
npm install axios lucide-react
```

Copy all frontend files:
- `App.jsx` → `client/src/App.jsx`
- `App.css` → `client/src/App.css`
- `main.jsx` → `client/src/main.jsx`
- All component files → `client/src/components/`

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔧 API Endpoints

### Medications
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get single medication
- `POST /api/medications` - Create medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Dose Management
- `POST /api/medications/:id/dose` - Record a dose (taken/skipped)
- `POST /api/medications/:id/refill` - Refill medication stock

### Schedule
- `GET /api/medications/schedule/today` - Get today's schedule

## Data Model

### Medication Schema
```javascript
{
  name: String (required),
  dosage: String (optional),
  frequency: Number (1-7),
  times: [String] (HH:MM format),
  totalStock: Number (required),
  currentStock: Number,
  lowStockThreshold: Number (default: 3),
  dosesHistory: [{
    date: Date,
    time: String,
    status: 'taken' | 'skipped'
  }],
  lastRefill: Date,
  createdAt: Date
}
```

### Key UI Components
1. **Medication Cards**: Display medication info with visual stock indicators
2. **Schedule Items**: Grouped by status (overdue, due soon, taken, skipped)
3. **Form**: Clean, intuitive form for medication entry
4. **Navbar**: Sticky navigation with 3 main views

## Local Storage & Persistence

- All data is persisted in MongoDB
- No browser storage dependencies
- Real-time sync between frontend and backend
- History tracked for all dose entries

## 🧪 Testing the App

### Sample Workflow
1. **Create Medication**: Add "Aspirin 500mg" with 30 doses, daily at 09:00 and 18:00
2. **View Schedule**: Check "Today's Schedule" tab
3. **Mark Doses**: Click checkmark to mark doses as taken
4. **Check Stock**: Watch stock decrease automatically
5. **Low Stock Alert**: When stock ≤ 3, refill button appears
6. **History**: View dose history in medication details


## 🛠️ Dependencies

### Backend
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `cors`: Cross-origin requests
- `dotenv`: Environment variables

### Frontend
- `react`: UI library
- `lucide-react`: Icon library
- `axios`: HTTP client


## Security Notes

- Input validation on backend
- Environment variables for sensitive data
- CORS enabled for localhost development


## Quick Start (TL;DR)

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (new terminal)
cd client && npm install && npm run dev

# Open http://localhost:5173
```

Enjoy MediTrack! 💊
