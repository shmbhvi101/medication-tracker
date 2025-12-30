# MediTrack - Medication Tracking Application

A fully functional, modern medication tracking application built with MERN (MongoDB, Express, React, Node.js) stack. This app helps users manage medications, receive reminders, and track medication stock with an attractive UI.

## 🎯 Features

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

## 📁 Project Structure

```
medication-tracker/
├── server/
│   ├── models/
│   │   └── Medication.js          # MongoDB schema
│   ├── routes/
│   │   └── medications.js          # API endpoints
│   ├── server.js                   # Express server
│   ├── .env                        # Environment variables
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MedicationList.jsx  # Medications display
│   │   │   ├── AddMedication.jsx   # Form for add/edit
│   │   │   └── TodaySchedule.jsx   # Daily schedule view
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # All styling
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
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

Copy all backend files from the artifacts:
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

Copy all frontend files from the artifacts:
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

## 📊 Data Model

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

## 🎨 Design & UI Highlights

### Color Scheme
- **Primary**: Blue (#3b82f6) - Main actions
- **Secondary**: Green (#10b981) - Positive actions
- **Danger**: Red (#ef4444) - Warnings/deletions
- **Warning**: Orange (#f97316) - Low stock

### Key UI Components
1. **Medication Cards**: Display medication info with visual stock indicators
2. **Schedule Items**: Grouped by status (overdue, due soon, taken, skipped)
3. **Form**: Clean, intuitive form for medication entry
4. **Navbar**: Sticky navigation with 3 main views

## 💾 Local Storage & Persistence

- All data is persisted in MongoDB
- No browser storage dependencies
- Real-time sync between frontend and backend
- History tracked for all dose entries

## 🔄 Trade-offs & Design Decisions

### 1. **3-Screen Limitation**
- **Choice**: Medications List, Today's Schedule, Add/Edit Form
- **Rationale**: Minimal and focused on core user flows
- **Trade-off**: No separate edit screen, uses modal-like form

### 2. **Database Choice**
- **Choice**: MongoDB with Mongoose
- **Rationale**: Flexible schema for dose history, easy to scale
- **Trade-off**: Not suitable for complex relational queries

### 3. **Reminder System**
- **Choice**: Client-side scheduling with status tracking
- **Rationale**: Simple to implement without server-side jobs
- **Trade-off**: No mobile push notifications (can be added later)

### 4. **Stock Management**
- **Choice**: Manual refill with threshold alerts
- **Rationale**: Respects privacy and doesn't assume user workflow
- **Trade-off**: No automatic refill suggestions beyond threshold

### 5. **UI Framework**
- **Choice**: Pure CSS with Tailwind-like utility approach
- **Rationale**: Full control over styling and animations
- **Trade-off**: Larger CSS file than Tailwind would be

## 🧪 Testing the App

### Sample Workflow
1. **Create Medication**: Add "Aspirin 500mg" with 30 doses, daily at 09:00 and 18:00
2. **View Schedule**: Check "Today's Schedule" tab
3. **Mark Doses**: Click checkmark to mark doses as taken
4. **Check Stock**: Watch stock decrease automatically
5. **Low Stock Alert**: When stock ≤ 3, refill button appears
6. **History**: View dose history in medication details

## 🚀 Future Enhancements

- Push notifications for reminders
- Medication search and filtering
- Export history as PDF
- Multi-user support with authentication
- Recurring refill orders
- Integration with pharmacy APIs
- Dark mode toggle
- Voice-based commands

## 📝 Assumptions

1. Single user application (no authentication)
2. MongoDB running locally or accessible via connection string
3. 24-hour time format for scheduling
4. Low stock threshold fixed at 3 (can be made configurable)
5. Doses tracked by date, not absolute time windows
6. No timezone handling (all times in user's local timezone)

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

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Notes

- No authentication implemented (as per requirements)
- Input validation on backend
- Environment variables for sensitive data
- CORS enabled for localhost development

## 📄 License

MIT

## 👨‍💻 Author

Built as a technical challenge submission

---

## Quick Start (TL;DR)

```bash
# Backend
cd server && npm install && npm run dev

# Frontend (new terminal)
cd client && npm install && npm run dev

# Open http://localhost:5173
```

Enjoy MediTrack! 💊