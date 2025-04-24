import { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Home from './src/Screens/Home'
import Profile from './src/Screens/Profile'
import Main from "./src/Screens/Main";
import Login from "./src/Screens/login"
import AddPost from './src/Screens/AddPost';
import SignUp from './src/Screens/signUp';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
    const [auth, setAuth] = useState(false)

    const TabStack = () => {
        return (
            <Tab.Navigator initialRouteName="Home" screenOptions={{
                tabBarStyle: { paddingTop: 5, height: 50 },
            }}>
                <Tab.Screen name="Home" component={Home} options={{ title: 'Home', headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (<Image source={require('./Images/home.png')} style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }} />) }} />
                <Tab.Screen name="AddPost" component={AddPost} initialParams={{ setAuth }} options={{ title: 'Add', headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (<Image source={require('./Images/add.png')} style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }} />) }} />
                <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile', headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (<Image source={require('./Images/user.png')} style={{ height: 40, width: 40, tintColor: focused ? "black" : "gray" }} />) }} />
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
                    {props => <Login {...props} setAuth={setAuth} />}

                </Stack.Screen>
            </Stack.Navigator>
        )
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