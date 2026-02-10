import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import UpdateEventScreen from "../screens/UpdateEventScreen";
import BottomNavBar from "./BottomNavBar";
import { Ionicons } from "@expo/vector-icons";
import { RootTabParamList } from "../types/Navigation";
import EventInfoScreen from "../screens/EventInfoScreen";
import RecordEventScreen from "../screens/RecordEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import ExerciseDetailScreen from "../screens/ExerciseDetailScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      backBehavior="history"
    >
      <Tab.Screen
        name="Koti"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Uusi lenkki"
        component={CreateEventScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profiili"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Muokkaa tapahtumaa"
        component={UpdateEventScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Tapahtuman tiedot"
        component={EventInfoScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Tallenna tapahtuma"
        component={RecordEventScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Harjoituksen tiedot"
        component={ExerciseDetailScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}
