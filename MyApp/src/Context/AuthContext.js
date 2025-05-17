import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
    userToken: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('user_token');
            if (token) {
                setUserToken(token);
                setUser(user)
            }
            else
            { setUserToken(null)
                setUser(null)
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('http://192.168.100.8:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Login failed');
            }

            const data = await res.json();
            const token = data.token;
            const user = data.user;

            await AsyncStorage.setItem('user_token', token);
            await AsyncStorage.setItem('user_data', JSON.stringify(user));
            setUserToken(token);
            setUser(user);
        } catch (err) {
            throw new Error(err);
        }
    };

    const logout = async () => {
        try {
            const token = await AsyncStorage.getItem('user_token');

            const response = await fetch('http://192.168.100.8:3000/api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok || response.status === 400 || response.status === 401) {
                await AsyncStorage.removeItem('user_token');
                await AsyncStorage.removeItem('user_data');
                setUser(null);
                setUserToken(null);
            }
        } catch (error) {

        }
    };


    return (
        <AuthContext.Provider value={{ userToken, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};