# 💕 DSA Progress Tracker

A beautiful, couple-themed web application for tracking LeetCode problem-solving progress together! Built with Next.js, Firebase, and lots of love ❤️

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)

## ✨ Features

- 📝 **Add Problems**: Log LeetCode problems with auto-fetch metadata from LeetCode API
- 📋 **List View**: Browse all problems with advanced filtering and sorting
- 📊 **Statistics**: Visualize progress with interactive charts (Recharts)
- 🏷️ **Tag Cloud**: Filter problems by topic tags
- 💬 **Comments**: Add notes and comments to each problem
- 🔥 **Streak Tracking**: Monitor consecutive days of problem-solving
- 👥 **User Comparison**: Track who's solving more problems
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 💾 **Export**: Download your data as CSV
- 🎨 **Beautiful UI**: Soft pink theme with smooth animations (Framer Motion)
- 🎉 **Celebrations**: Confetti animations when adding problems
- 🔐 **Secure**: PIN-based authentication for private access

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Firebase project set up
- Git installed

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dsa-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database → Create Database
   - Start in **Production mode** or **Test mode** (for development)
   - Choose a location
4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to create a web app
   - Copy the configuration object

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Shared PIN for access
NEXT_PUBLIC_SHARED_PIN=1234

# User Names (Customize these!)
NEXT_PUBLIC_USER1_NAME=Gaurav
NEXT_PUBLIC_USER2_NAME=Her Name
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
dsa-tracker/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Navbar & Footer
│   ├── page.tsx             # Dashboard/Home page
│   ├── globals.css          # Global styles
│   ├── login/               
│   │   └── page.tsx         # Login page (PIN authentication)
│   ├── add/                 
│   │   └── page.tsx         # Add new problem page
│   ├── list/                
│   │   └── page.tsx         # All problems list with filters
│   └── stats/               
│       └── page.tsx         # Detailed statistics page
├── components/              # Reusable React components
│   ├── Navbar.tsx           # Navigation bar with dark mode toggle
│   ├── Footer.tsx           # Footer component
│   ├── AuthGuard.tsx        # Protected route wrapper
│   ├── ProblemCard.tsx      # Problem display card with comments
│   ├── TagCloud.tsx         # Interactive tag cloud
│   └── StatsChart.tsx       # Charts component (Recharts)
├── lib/                     # Utility functions and configurations
│   ├── firebase.ts          # Firebase initialization
│   ├── types.ts             # TypeScript type definitions
│   ├── leetcode.ts          # LeetCode API integration
│   └── utils.ts             # Helper functions (streak, export, etc.)
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
├── .gitignore              
├── package.json            
├── tsconfig.json           
├── tailwind.config.ts      
└── README.md               
```

## 🔥 Firebase Firestore Structure

```
Collection: problems
Document: {
  id: string (auto-generated)
  title: string
  link: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  solvedBy: string
  notes: string
  createdAt: Timestamp
  comments: [
    {
      user: string
      text: string
      createdAt: Timestamp
    }
  ]
}
```

### Firestore Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /problems/{problem} {
      allow read: if true;
      allow write: if true; // In production, add authentication checks
    }
  }
}
```

## 🎨 Customization

### Change User Names

Edit `.env.local`:

```env
NEXT_PUBLIC_USER1_NAME=Your Name
NEXT_PUBLIC_USER2_NAME=Partner's Name
```

### Change PIN

Edit `.env.local`:

```env
NEXT_PUBLIC_SHARED_PIN=your_secure_pin
```

### Change Theme Colors

Edit `tailwind.config.ts` to customize the pink color palette or add your own colors.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

### Option 1: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

**Important**: Don't forget to add all environment variables in Vercel's project settings!

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Firebase** | Backend (Firestore Database) |
| **Framer Motion** | Smooth animations |
| **Recharts** | Interactive charts |
| **Lucide React** | Beautiful icons |
| **React Hot Toast** | Toast notifications |
| **Canvas Confetti** | Celebration animations |
| **Vercel** | Hosting and deployment |

## 🎯 Features Breakdown

### Auto-Fetch LeetCode Metadata

The app uses LeetCode's GraphQL API to automatically fetch:
- Problem title
- Difficulty level
- Topic tags

Just paste the LeetCode URL and click "Auto-Fill"!

### Streak Calculation

Tracks consecutive days with at least one problem solved. The streak breaks if you skip more than one day.

### CSV Export

Export all your problems data with:
- Title, Link, Difficulty
- Tags, Solved By, Notes
- Date solved

### Comments System

Each problem has its own comment thread where both users can:
- Add comments
- View comment history
- See who wrote what

## 🐛 Troubleshooting

### Firebase Connection Issues

- Verify all Firebase environment variables are correct
- Check Firebase console for any errors
- Ensure Firestore is enabled in your Firebase project

### LeetCode API Not Working

- Check if the problem URL is in the correct format: `https://leetcode.com/problems/problem-name/`
- LeetCode may rate-limit requests; try again after a few seconds
- You can still manually enter problem details if auto-fetch fails

### Build Errors

```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📝 License

This project is open source and available for personal use.

## 💝 Made With Love

Created for couples who code together! 💕

---

## 🤝 Contributing

Feel free to fork this project and customize it for your own use! If you have suggestions or improvements, contributions are welcome.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding Together! 🚀❤️**
