# 🏀 Sportify: NBA Edition

A cross-platform mobile application built with **React Native (Expo)**, focusing on tracking NBA fixtures, scores, and managing a personalized list of favorite matches

## 📱 Features Showcase

This application is built with a strong focus on modularity, robust state management, and modern UI/UX standards.

### ✅ Core Features (Assignment Requirements)

| Feature | Implementation | Assignment Criteria Fulfilled |
|:--------|:---------------|:------------------------------|
| **User Authentication** | Registration and Login flows with **Formik** and **Yup** for validation. | Authentication & Validation (15 Marks) |
| **Secure Token Storage** | Authentication tokens are stored using **`expo-secure-store`** (best security practice). | Authentication & Validation (Tip) |
| **Navigation** | Uses **Expo Router** for stack navigation and a **Bottom Tab Navigator** (Home, Favorites, Profile). | Navigation Implementation (10 Marks) |
| **Home Screen** | Dynamic list of upcoming NBA matches fetched from **TheSportsDB API**. | API Integration & Data Display (15 Marks) |
| **Data Display** | Match cards (`MatchCard.tsx`) display teams (Title), status (Score/Date), and league info. | Home Screen (Card Content) |
| **Favorites** | Users can mark and unmark matches as favorites using a heart/star icon. | Favourites (Key Requirement) |
| **Persistence** | Favorite match IDs are persisted across sessions using **Redux Persist** and AsyncStorage. | Favourites (Persist Data) |
| **Details Screen** | Tapping a match card opens a detailed screen showing scores and extensive match information. | Item Interaction |
| **Styling & Icons** | Consistent, dynamic styling managed via a Theme Context, using **Feather Icons** throughout. | Styling and UI (15 Marks) |

### 🎁 Bonus Feature (5 Marks)

* **Dark Mode Toggle**: A switch is provided on the Profile screen to instantly toggle between light and dark themes. The preference is persisted securely.

---

## 🛠 Tech Stack and Best Practices

| Category | Tool / Library | Best Practice Implemented |
|:---------|:---------------|:--------------------------|
| **Framework** | React Native (Expo) & TypeScript | Industry Standard, Decoupled/Testable Code |
| **State Management** | **Redux Toolkit** & React-Redux | Centralized State Management (15 Marks) |
| **Validation** | Formik & **Yup** | Proper Validations, React Hooks |
| **Data Handling** | Axios & TheSportsDB API | Decoupled API Service (`sportsService.ts`) |
| **Security** | `expo-secure-store` | Storing auth state according to best security practices. |
| **UI/Theming** | Custom Theme Context | Consistent UI/UX Design & Responsiveness |

## 📂 Project Structure

The project adheres to a clean, modular structure:

```
sportify/
├── app/                          # Expo Router Screens & Navigation
│   ├── (tabs)/                   # Bottom Tab Screens (Home, Favs, Profile)
│   ├── auth/                     # Authentication Stack (Login, Register)
│   └── match/[id].tsx            # Dynamic Match Details Screen
├── src/
│   ├── components/              # Reusable UI (MatchCard.tsx)
│   ├── redux/                   # Redux Store, Slices (Auth, Favorites, Matches)
│   ├── services/                # API Logic Decoupling (authService, sportsService)
│   └── contexts/                # Theme Context
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* pnpm (recommended) or npm/yarn
* Expo CLI

### Installation

1. Clone the repository and navigate into the folder:

   ```bash
   git clone [Your Repository URL Here]
   cd Sportify-NBA-Edition
   ```

2. Install all required dependencies:

   ```bash
   pnpm install
   ```

   Or if you're using npm:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   pnpm start
   ```

   Or with Expo CLI:

   ```bash
   npx expo start
   ```

4. In the output, you'll find options to open the app in a:

   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

5. Scan the QR code with the **Expo Go** app on your mobile device.

### 🔐 Demo Credentials

Use these credentials to test the core application flow immediately:

* **Username**: `emilys`
* **Password**: `emilyspass`

> **Note**: If the app skips the login page (due to a previous successful login), navigate to **Profile > Logout** to reset the authentication state.

---

## 📖 Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [React Native documentation](https://reactnative.dev/): Learn about React Native components and APIs.
- [Redux Toolkit documentation](https://redux-toolkit.js.org/): Learn about state management with Redux.

## 🤝 Join the community

Join our community of developers creating universal apps:

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

## 📝 Assignment Information

**Course**: IN3210 Mobile Applications Development  
**Assignment**: Assignment 2  
**Project**: Sportify: NBA 

This project demonstrates proficiency in:
- Cross-platform mobile development with React Native
- State management with Redux Toolkit
- API integration and data handling
- User authentication and secure storage
- Modern UI/UX design principles
- Navigation patterns in mobile applications