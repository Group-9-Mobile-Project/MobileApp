import { useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const PROFILE_KEY = 'user_profile';

export function useProfile() {

    const saveProfile = useCallback(async (profile: any) => {
        try {
            await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
        } catch (e) {
            // handle error as needed
            throw e;
        }
    }, []);

    const getProfile = useCallback(async (): Promise<any | null> => {
        try {
            const data = await SecureStore.getItemAsync(PROFILE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (e) {
            // handle error as needed
            throw e;
        }
    }, []);

    return { saveProfile, getProfile };
}