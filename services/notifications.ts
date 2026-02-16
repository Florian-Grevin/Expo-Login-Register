import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';


Notifications.setNotificationHandler({
    handleNotification : async() =>  ({
        shouldShowAlert : true,
        shouldPlaySound : true,
        shouldSetBadge : true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync(): Promise< 
    string | null 
> {
    let token : string | null = null;

    if(!Device.isDevice) {
        console.log('Les notifications push nécessitent un appareil physique');
        return null;
    }

    if(Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name : "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern : [0, 150, 80, 150, 80, 150, 200, 150, 80, 150, 80, 150],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if(existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if(finalStatus !== 'granted') {
        console.log('Permission notifications refusée');
        return null;
    }

    try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId,
        });
        token = pushToken.data;
        console.log("push token : ", token);
    } catch (error) {
        console.error("Erreur obtention push token", error);
    }
    return token;
}

export async function registerAndSavePushToken() : Promise<boolean> {
    const token = await registerForPushNotificationsAsync();

    if(token) {
        try {
            await api.savePushToken(token);
            return true;
        }
        catch (error) {
            console.error("Erreur sauvegarde push token",error);
            return false;
        }
    }

    return false;
}
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (notification: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

