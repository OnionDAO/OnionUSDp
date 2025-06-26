# Firebase Setup Guide for OnionUSD-P

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `onion-usd-p` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Save changes

## 3. Enable Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location close to your users
4. Click **Done**

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register app with nickname: "OnionUSD-P Web"
5. Copy the configuration object

## 5. Update Firebase Config

Replace the placeholder values in `src/firebase/config.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 6. Firestore Security Rules (Optional)

For production, update Firestore rules to secure user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Try creating a new account for both Corporation and Employee types
4. Verify that users are created in Firebase Authentication
5. Check that user profiles are stored in Firestore under the `users` collection

## Authentication Flow

### Corporation Signup:
- Email, Password, Company Name
- Creates user in Firebase Auth
- Stores profile in Firestore with `userType: 'corporation'`

### Employee Signup:
- Email, Password, Full Name, Corporation ID
- Creates user in Firebase Auth  
- Stores profile in Firestore with `userType: 'employee'`

### Login:
- Email and Password authentication
- Fetches user profile from Firestore
- Redirects to appropriate dashboard based on user type

## Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**: Make sure all files are saved and the dev server is restarted
2. **Firebase config errors**: Double-check that all config values are correctly copied
3. **Authentication fails**: Verify that Email/Password is enabled in Firebase Console
4. **Firestore permission denied**: Check that the database is in test mode or rules are configured correctly

### Firestore Connection Errors (Status 400):

If you see errors like "WebChannelConnection RPC 'Write' stream transport errored":

1. **Firestore not enabled**: 
   - Go to Firebase Console → Firestore Database → Create database
   - Choose "Start in test mode"
   - Select your preferred location

2. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Or clear all browser data for localhost

3. **Check Firestore Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // For testing only
       }
     }
   }
   ```

4. **Restart development server**:
   ```bash
   npm run dev
   ```

### Testing Users:

You can create test accounts:
- Corporation: `corp@test.com` / `password123`
- Employee: `emp@test.com` / `password123` (with any Corporation ID) 