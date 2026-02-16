import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
} from "react";
import * as Notifications from "expo-notifications";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import { Platform } from "react-native";


interface NotificationContextType {
    scheduleNotificationAsync: (
        request: Notifications.NotificationRequestInput
    ) => Promise<void>;
    cancelNotificationAsync: (identifier: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationContextType | undefined>(
    undefined
);

const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {

    useEffect(() => {

        const configureNotificationsAsync = async () => {
            const { granted } = await Notifications.requestPermissionsAsync();
            if (!granted) {
                return console.warn("Notification Permissions not granted!");
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('LiikkelleNotifications', {
                    name: 'Liikkeelle',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                    shouldShowBanner: true,
                    shouldShowList: false
                }),
            });
        };
        configureNotificationsAsync();


    }, []);


    const scheduleNotificationAsync = async (
        request: Notifications.NotificationRequestInput
    ) => {
        const notification = await Notifications.scheduleNotificationAsync(request);

        if (__DEV__) {
            console.log("Scheduling notification: ", request.identifier);
            const allNotis = Notifications.getAllScheduledNotificationsAsync();
            (await allNotis).forEach(note => console.log(note.trigger));
            console.log(notification);
        }

    };

    const cancelNotificationAsync = async (identifier: string) => {
        if (__DEV__) {
            console.log("Canceling notification: ", identifier);
        }
        await Notifications.cancelScheduledNotificationAsync(identifier);

        if (__DEV__) {
            const allNotis = Notifications.getAllScheduledNotificationsAsync();
            (await allNotis).forEach(note => console.log(note.trigger));
            console.log(allNotis);
        }
    };

    const value = { scheduleNotificationAsync, cancelNotificationAsync };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

const useNotifications = () => {
    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error(
            "useNotifications must be called from within a NotificationProvider!"
        );
    }

    return context;
};

export { useNotifications, NotificationsProvider };

