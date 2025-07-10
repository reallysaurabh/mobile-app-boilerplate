# Mobile App Infrastructure Setup Guide

This guide will help you set up the backend infrastructure for your mobile app. The infrastructure is ready to use but **optional** - your base app will work without it until you need these features.

## 🏗️ Architecture Overview

- **Frontend**: Expo + React Native + TypeScript (your existing base app)
- **Authentication**: Supabase Auth (ready when needed)
- **Backend**: Expo API Routes (for future business logic)
- **Database**: Supabase PostgreSQL + Drizzle ORM (ready when needed)
- **File Storage**: Supabase Storage (ready when needed)
- **State Management**: Zustand + TanStack Query (ready when needed)
- **Validation**: Zod schemas
- **Build System**: EAS Build
- **Deployment**: EAS Submit

## 📋 Setup Checklist (Optional - for when you need backend features)

### 1. Supabase Setup (Only when you need backend)

1. **Create a Supabase project**: https://supabase.com/dashboard
2. **Get your credentials**:
   - Project URL
   - Anon key
   - Service role key (keep this secret!)
   - Database connection string

3. **Enable authentication providers** (when you add auth):
   - Go to Authentication > Providers
   - Enable Email provider
   - Enable Google provider (add OAuth credentials)

### 2. Environment Variables (Only when using backend)

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

### 3. Database Setup (Only when you need database)

```bash
# Generate database migrations
npm run db:generate

# Apply migrations to your Supabase database  
npm run db:migrate

# Optional: Open Drizzle Studio to manage your database
npm run db:studio
```

### 4. EAS CLI Setup (For building and publishing)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS in your project
eas build:configure
```

### 5. App Store Setup & Configuration

#### 📱 **iOS App Store Setup**

1. **Apple Developer Account**: 
   - Sign up at https://developer.apple.com
   - Cost: $99/year
   - Required for publishing to App Store

2. **Bundle Identifier** (`expo.ios.bundleIdentifier`):
   - Format: `com.yourcompany.yourappname`
   - Example: `com.johnsmith.appname`
   - Must be unique across all iOS apps
   - Register in Apple Developer Console > Certificates, Identifiers & Profiles > Identifiers

3. **App Store Connect Setup**:
   - Go to https://appstoreconnect.apple.com
   - Create new app with your bundle identifier
   - Fill app information, categories, pricing

#### 🤖 **Android Play Store Setup**

1. **Google Play Console Account**:
   - Sign up at https://play.google.com/console
   - One-time fee: $25
   - Required for publishing to Google Play Store

2. **Package Name** (`expo.android.package`):
   - Format: `com.yourcompany.yourappname` (same as iOS for consistency)
   - Must be unique across all Android apps
   - Cannot be changed after first upload to Play Store

3. **App Signing Setup**:
   - Google Play App Signing is recommended (managed by Google)
   - EAS Build automatically handles signing keys
   - Alternative: Upload your own signing keys

4. **Play Console App Setup**:
   - Create new app in Google Play Console
   - Fill app details, store listing, content rating
   - Set up app categories and target audience

#### 🔧 **App Configuration in `app.json`**

Update your app configuration:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourappname",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.yourappname",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

#### 📋 **App Store Requirements Checklist**

**iOS Requirements:**
- [ ] Apple Developer Account ($99/year)
- [ ] Unique Bundle Identifier
- [ ] App Store Connect app created
- [ ] App privacy policy (if collecting data)
- [ ] App screenshots (multiple sizes)
- [ ] App description and keywords
- [ ] Age rating completed

**Android Requirements:**
- [ ] Google Play Console Account ($25 one-time)
- [ ] Unique Package Name
- [ ] Play Console app created
- [ ] Content rating questionnaire completed
- [ ] Privacy policy (if collecting data)
- [ ] App screenshots (multiple sizes)
- [ ] Store listing completed
- [ ] Target SDK requirements met

## 🚀 Development Workflow

### Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Building for App Stores

```bash
# Development build (for testing on devices)
eas build --profile development --platform all

# Preview build (for internal testing)
eas build --profile preview --platform all

# Production build (for app stores)
eas build --profile production --platform all

# Build for specific platform only
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Publishing to App Stores

```bash
# Submit to both app stores
eas submit --platform all

# Submit to specific stores
eas submit --platform ios
eas submit --platform android
```

### Testing & Distribution

```bash
# Create internal distribution build
eas build --profile preview

# Share with TestFlight (iOS) or Internal Testing (Android)
eas submit --platform ios --channel testflight
eas submit --platform android --channel internal
```

## 📁 Infrastructure Files (Ready for Future Use)

```
mobile-app-boilerplate/
├── app/                    # Your existing Expo Router app
│   ├── api/               # API routes (ready for backend logic)
│   │   ├── auth/          # Authentication endpoints
│   │   └── user/          # User management endpoints
│   ├── (tabs)/            # Your existing tab navigation
│   └── _layout.tsx        # Root layout (unchanged)
├── lib/                   # Backend infrastructure (ready to use)
│   ├── api/               # API client and hooks
│   ├── auth/              # Authentication logic
│   ├── db/                # Database schema and connection
│   ├── store/             # State management
│   └── supabase/          # Supabase client
├── components/            # Your existing components
├── env.example            # Environment variables template
├── eas.json              # Build configuration
└── assets/               # Your existing assets
```

## 🔧 What's Ready for You

### ✅ **Infrastructure Available (Optional to Use):**

1. **Database Setup**: Ready for when you need data persistence
   - User management schema
   - Migration system
   - Type-safe database operations

2. **Authentication System**: Ready for when you need user accounts
   - Supabase Auth integration
   - JWT token handling
   - User profile management

3. **API Layer**: Ready for backend business logic
   - Type-safe API client
   - React Query hooks for server state
   - Authentication middleware

4. **Build System**: Ready for app store deployment
   - EAS Build configuration
   - Multiple build profiles
   - App store submission setup

### ✅ **Your Base App**: Unchanged and Ready to Publish

Your existing tabs-based app will work exactly as before. The infrastructure is there when you need it, but doesn't interfere with your current app.

## 🚀 Publishing Your Base App (Step by Step)

### **Step 1: App Store Accounts**
- **iOS**: Apple Developer Account ($99/year)
- **Android**: Google Play Console ($25 one-time)

### **Step 2: Configure App Identifiers**
```bash
# Update app.json with your unique identifiers
"ios": { "bundleIdentifier": "com.yourcompany.yourappname" }
"android": { "package": "com.yourcompany.yourappname" }
```

### **Step 3: EAS Setup**
```bash
eas login
eas build:configure
```

### **Step 4: Build & Submit**
```bash
# Build for both platforms
eas build --profile production --platform all

# Submit to both stores
eas submit --platform all
```

## 🛠️ Adding Features Later

When you're ready to add features:

1. **Add Authentication**: 
   - Wrap your app with AuthProvider
   - Use the pre-built auth hooks

2. **Add Database**: 
   - Set up Supabase
   - Run migrations
   - Use the API hooks

3. **Add File Upload**:
   - Configure Supabase Storage
   - Use the upload utilities

4. **Add Business Logic**:
   - Create API routes in `app/api/`
   - Use the authentication middleware

## 🔒 Security Ready

- Environment variables configured properly
- Authentication token verification ready
- Database access secured through API routes
- All sensitive operations use server-side keys

## 📱 Platform-Specific Considerations

### **iOS Specific:**
- App Transport Security (HTTPS required)
- iOS 14+ Privacy Labels required
- App Store Review Guidelines compliance
- Human Interface Guidelines

### **Android Specific:**
- Target SDK 34+ required (2024)
- Play Store Data Safety requirements
- Material Design Guidelines
- Google Play Policies compliance

Your app is ready to publish on both iOS and Android now, and ready to scale later! 🎉 