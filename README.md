# 🏀 Sportify: NBA Edition

Sportify: NBA Edition is a mobile app built with React Native that helps users follow NBA basketball games. The NBA is a top professional basketball league in the United States. With Sportify, users can see upcoming matches, check scores and team details, mark favorite games, manage a secure profile, and switch between light and dark themes. The app makes it easy for fans to stay updated on their favorite teams and games.

---

## 📱 Application Overview

**Sportify** allows users to:
- Browse upcoming NBA matches and fixtures
- View detailed match information including scores and team details
- Mark matches as favorites for quick access
- Manage user profile with authentication
- Toggle between light and dark themes

---

## ✅ Assignment Requirements Fulfilled

### 1. User Authentication 
- ✅ **Registration and Login Flow**: Complete user authentication system
- ✅ **React Hooks for Form Handling**: Using **Formik** for form state management
- ✅ **Input Validation**: Implemented with **Yup** schema validation
- ✅ **Successful Navigation**: Redirects to home screen after login
- ✅ **User Display**: Username visible in profile screen
- ✅ **Secure Storage**: Authentication tokens stored using **`expo-secure-store`**

### 2. Navigation Implementation 
- ✅ **Navigation Library**: Implemented with **Expo Router**
- ✅ **Navigation Types**: 
  - Stack Navigation for authentication flow
  - Bottom Tab Navigation (Home, Favorites, Profile)
  - Dynamic routing for match details

### 3. API Integration & Data Display 
- ✅ **API Integration**: Connected to **TheSportsDB API** for live NBA data
- ✅ **Dynamic Item List**: Displays upcoming NBA matches on home screen
- ✅ **Card Components**: Each match card contains:
  - Team logos/images
  - Match title (Team names)
  - Match status (date/time or score)
  - League information

### 4. State Management 
- ✅ **State Management Solution**: Implemented with **Redux Toolkit**
- ✅ **Redux Slices**: Separate slices for authentication, favorites, and matches
- ✅ **Global State**: Centralized state accessible across all components
- ✅ **Item Interaction**: Tapping a match opens detailed screen with full information

### 5. Favourites 
- ✅ **Mark as Favourite**: Heart icon to add/remove matches from favorites
- ✅ **Separate Screen**: Dedicated favorites tab to view saved matches
- ✅ **Data Persistence**: Favorites persisted using **Redux Persist** with AsyncStorage
- ✅ **Cross-Session Persistence**: Favorites remain after app restart

### 6. UI/UX Design & Responsiveness 
- ✅ **Consistent Styling**: Custom theme context for unified design
- ✅ **Feather Icons**: All icons implemented using Feather Icons library
- ✅ **Responsive Design**: Layouts adapt to various screen sizes
- ✅ **Clean UI**: Modern, intuitive interface following Material Design principles
- ✅ **Visual Feedback**: Loading states, error handling, and user feedback

### 7. Code Quality & Best Practices 
- ✅ **Feature-Based Commits**: Organized Git history with meaningful commit messages
- ✅ **Input Validations**: Comprehensive form validation with Yup
- ✅ **Modular Code**: Separated concerns (components, services, redux slices)
- ✅ **Reusable Components**: Generic components like MatchCard, themed buttons
- ✅ **TypeScript**: Full TypeScript implementation for type safety
- ✅ **Decoupled API Logic**: Separated API services (`authService.ts`, `sportsService.ts`)
- ✅ **Project Structure**: Clean, organized folder structure

### 8. Bonus Feature 
- ✅ **Dark Mode Toggle**: Switch between light and dark themes from Profile screen
- ✅ **Theme Persistence**: User's theme preference saved securely

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|:---------|:-----------|:--------|
| **Framework** | React Native (Expo) | Cross-platform mobile development |
| **Language** | TypeScript | Type safety and better developer experience |
| **Navigation** | Expo Router | File-based routing and navigation |
| **State Management** | Redux Toolkit | Centralized state management |
| **Data Persistence** | Redux Persist + AsyncStorage | Offline data storage |
| **Secure Storage** | expo-secure-store | Secure token storage |
| **Form Handling** | Formik | Form state management |
| **Validation** | Yup | Schema-based validation |
| **API Client** | Axios | HTTP requests |
| **Icons** | Feather Icons | Consistent iconography |
| **Styling** | StyleSheet + Theme Context | Responsive and themeable UI |

---

## 📂 Project Structure

```
sportify/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── index.tsx            # Home screen (matches list)
│   │   ├── favorites.tsx        # Favorites screen
│   │   └── profile.tsx          # Profile screen
│   ├── auth/                     # Authentication stack
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Register screen
│   ├── match/
│   │   └── [id].tsx             # Match details screen (dynamic route)
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/              # Reusable components
│   │   ├── MatchCard.tsx        # Match card component
│   │   └── ThemedButton.tsx     # Themed button component
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx     # Theme provider
│   ├── redux/                   # Redux store and slices
│   │   ├── store.ts             # Redux store configuration
│   │   ├── slices/
│   │   │   ├── authSlice.ts     # Authentication state
│   │   │   ├── favoritesSlice.ts # Favorites state
│   │   │   └── matchesSlice.ts   # Matches state
│   ├── services/                # API services
│   │   ├── authService.ts       # Authentication API
│   │   └── sportsService.ts     # Sports data API
│   └── types/                   # TypeScript type definitions
│       └── index.ts
├── assets/                       # Images and static files
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **pnpm** or **yarn**
- **Expo CLI** (installed globally or via npx)
- **Expo Go** app (for physical device testing)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rajeevansharan/Sportify-NBA.git
   cd SportifyNBA
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   Or with pnpm:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   npx expo start
   ```

4. **Run the app**:

   In the output, you'll find options to open the app in:
   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go) - Scan the QR code with your mobile device

---

## 🔐 Demo Credentials

For testing the application, use these credentials:

**Username**: `emilys`  
**Password**: `emilyspass`

> **Note**: These credentials work with the DummyJSON authentication API. If the app skips the login page (due to previous session), navigate to **Profile → Logout** to reset.

---

### Authentication Flow
- Login Screen with form validation
- Registration Screen with Yup validation

### Main Features
- Home Screen displaying NBA matches list
- Match Details Screen with full information
- Favorites Screen with saved matches
- Profile Screen with dark mode toggle

---

## 🔄 Key Features in Detail

### Authentication System
- Secure login and registration
- Form validation with real-time error messages
- Token-based authentication
- Persistent login sessions
- Logout functionality

### Match Browsing
- Dynamic list of upcoming NBA games
- Pull-to-refresh functionality
- Search and filter capabilities
- Real-time score updates

### Favorites Management
- One-tap favorite toggle
- Dedicated favorites view
- Persistent storage across sessions
- Visual feedback on favorite status

### Theme Support
- System-wide dark mode
- Smooth theme transitions
- Persistent theme preference
- Accessible color contrast

---

## 🧪 API Integration

### Authentication API
- **Endpoint**: [DummyJSON Auth](https://dummyjson.com/docs/auth)
- **Usage**: User login and registration

### Sports Data API
- **Endpoint**: [TheSportsDB](https://www.thesportsdb.com/api.php)
- **Usage**: NBA matches, teams, and scores
- **Example**: `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4387&s=2024-2025`

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react-native": "0.76.5",
    "react-redux": "^9.1.2",
    "@reduxjs/toolkit": "^2.0.0",
    "redux-persist": "^6.0.0",
    "expo-secure-store": "~14.0.0",
    "formik": "^2.4.5",
    "yup": "^1.3.3",
    "axios": "^1.6.0",
    "@expo/vector-icons": "^14.0.0"
  }
}
```

---

## ✨ Best Practices Implemented

1. **Code Organization**: Modular structure with clear separation of concerns
2. **Type Safety**: Full TypeScript implementation
3. **State Management**: Centralized Redux store with slice pattern
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Security**: Secure token storage using expo-secure-store
6. **Performance**: Optimized re-renders and lazy loading
7. **Accessibility**: Proper labels and accessible components
8. **Git Workflow**: Feature-based commits with clear messages
9. **Code Quality**: Consistent formatting and naming conventions
10. **Documentation**: Well-documented code and README

---

## 📝 Evaluation Criteria Coverage

| Criteria | Marks | Implementation |
|:---------|:------|:---------------|
| Authentication & Validation | 15 | ✅ Complete with Formik + Yup + Secure Storage |
| Navigation Implementation | 10 | ✅ Expo Router with Tab + Stack Navigation |
| API Integration & Data Display | 15 | ✅ TheSportsDB API with dynamic match cards |
| State Management | 15 | ✅ Redux Toolkit with persist |
| UI/UX Design & Responsiveness | 15 | ✅ Theme context + Feather Icons + Responsive |
| Code Quality & Best Practices | 20 | ✅ TypeScript + Modular + Documented |
| Demo Video | 5 | ✅ 2-minute core flow demonstration |
| Bonus Feature | 5 | ✅ Dark mode with persistence |
| **Total** | **100** | **All requirements met** |

---

## 📚 Learn More

To learn more about the technologies used:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [TheSportsDB API Documentation](https://www.thesportsdb.com/api.php)

---

## 🤝 Contributing

This is an academic project for assignment submission. However, suggestions and feedback are welcome!

---

## 📄 License

This project is developed for educational purposes as part of the IN3210 Mobile Applications Development course.

---

## 👨‍💻 Author

**Sharan Rajeevan**  
Index Number:224254J   
University of Moratuwa  
Faculty of Information Technology
