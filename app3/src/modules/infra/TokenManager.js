import {AsyncStorage} from 'react-native';

export const TokenManager = {
    setToken: async token => {
        await AsyncStorage.setItem('token', token);
    },
    setProfile: async profile => {
        await AsyncStorage.setItem('profile', profile);
    },
    setName: async name => {
        await AsyncStorage.setItem('name', name);
    },
    /* setDoctorId: async id => {
        await AsyncStorage.setItem('doctors_id', id);
    }, */
    getToken: async () => {
        return await AsyncStorage.getItem('token');
    },
    getProfile: async () => {
        return await AsyncStorage.getItem('profile');
    },
    getName: async () => {
        return await AsyncStorage.getItem('name');
    },
    /* getDoctorId: async () => {
        return await AsyncStorage.getItem('doctors_id');
    }, */
    hasToken: async () => {
        const token = await TokenManager.getToken();
        return Boolean(true); //Boolean(token); //;
    }
};

export default {TokenManager}