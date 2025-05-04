import { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity, Alert } from 'react-native';
import Home from './src/Screens/Home'
import Profile from './src/Screens/Profile'
import Main from "./src/Screens/Main";
import Login from "./src/Screens/login"
import AddPost from './src/Screens/AddPost';
import SignUp from './src/Screens/signUp';
import EditProfile from './src/Screens/EditProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
    const [auth, setAuth] = useState(false)
    const [user, setUser] = useState(null);

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                { text: "Cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        const response = await fetch(`http://172.16.187.122:3000/api/user/delete/${user.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        if (response.ok) {
                            setAuth(false);
                        }
                    }
                }
            ]
        );
    }

    const TabStack = () => {
        return (
            <Tab.Navigator initialRouteName="Home" screenOptions={{
                tabBarStyle: { paddingTop: 5, height: 50 },
            }}>
                <Tab.Screen
                    name="Home"
                    children={(props) => <Home {...props} user={user} />}
                    options={{
                        title: 'Home', headerShown: false, tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (<Image source={require('./Images/home.png')}
                            style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }} />)
                    }} />
                <Tab.Screen
                    name="AddPost"
                    component={AddPost}
                    options={{
                        title: 'Add', headerShown: false, tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Image source={require('./Images/add.png')}
                                style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }} />)
                    }} />
                <Tab.Screen
                    name="Profile"
                    component={ProfileStack}
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('./Images/user.png')}
                                style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        tabLongPress: handleDeleteAccount,
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.navigate('Profile');
                        }
                    })}
                />
            </Tab.Navigator>
        )
    }
    const LoginStack = () => {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="SignUp"
                    options={{
                        gestureEnabled: true,
                    }}>
                    {props => <SignUp {...props} setAuth={setAuth} />}

                </Stack.Screen>
                <Stack.Screen name="Login"
                    options={{
                        gestureEnabled: true,
                    }}>
                    {props => <Login {...props} setAuth={setAuth} setUser={setUser} />}

                </Stack.Screen>
            </Stack.Navigator>
        )
    }
    const ProfileStack = () => {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Profile" >
                    {props => <Profile {...props} user={user} />}
                </Stack.Screen>
                <Stack.Screen name="EditProfile" >
                    {props => <EditProfile {...props} user={user} />}
                </Stack.Screen>
            </Stack.Navigator>
        );
    }
    return (
        <NavigationContainer>
            {auth ? (
                <TabStack />
            ) : (
                <LoginStack />
            )}

        </NavigationContainer>

    )
}

export default App;