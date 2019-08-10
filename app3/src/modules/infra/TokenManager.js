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
    getToken: async () => {
        return await AsyncStorage.getItem('token');
    },
    getProfile: async () => {
        return await AsyncStorage.getItem('profile');
    },
    getName: async () => {
        return await AsyncStorage.getItem('name');
    },
    hasToken: async () => { 
        const token = await TokenManager.getToken();
        return Boolean(token); 
    }
};

export default {TokenManager}