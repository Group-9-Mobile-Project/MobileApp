# MobileApp Project

A student project for a mobile app, built with React Native, Expo Go, and Firebase Cloud Firestore.

## Features

**Authentication**
- User registration and login using Firebase Authentication
- Authenticated user data is stored in an AuthProvider and shared across the app

**Homepage**
- View all upcoming events in map and list views
- Filter upcoming events by:
    - Date
    - Activity type (walk or run)
- Displays the user's location on the map

**Create Event**
- Create and publish new walking or running events
- Mandatory fields are:
    - Event name
    - Date and start time
    - Start location
- Additional fields:
    - Description
    - Event type

**Profile Page**
- View the events you have:
    - Created
    - Joined
- View and edit personal information:
    - Name
    - Description
    - Birthdate
    - City
    - Hobbies
    - Interests
    - Pronouns

**Statistics**
- View statistics for your walks and runs:
    - Walks/runs in total
    - Distance traveled
    - Average speed
- Monthly and yearly overviews of activity data:
    - Amount of walks/runs
    - Distance
    - Average distance
    - Time spent
    - Average duration
    - Average speed
    - Steps
- View saved exercises:
    - Duration
    - Distance
    - Steps
    - Average speed
    - Map view of the route

**Tracker**
- Track your walks and runs

## Tech Stack
- Framework: Expo framework with React Native
- Language: TypeScript
- Styling: React Native StyleSheet and custom MD3 theme from react-native-paper
- Database: Firebase Cloud Firestore
- Authentication: Firebase Auth with initializeAuth and AsyncStorage

## Developed By
- Ville-Pekka Alavuotunki
- Tero Asilainen
- Kata Niva
