import { useContext, useEffect } from 'react';
import { AuthContext } from './src/Context/AuthContext';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Toast from './src/Components/Toast';
import useToast from './src/hooks/useToast';
import Home from './src/Screens/Home/Home'
import Profile from './src/Screens/Profile/Profile'
import Main from "./src/Screens/Home/Main";
import Login from "./src/Screens/Auth/Login"
import AddPost from './src/Screens/Posts/AddPost';
import SignUp from './src/Screens/Auth/signUp';
import EditProfile from './src/Screens/Profile/EditProfile';
import DeleteConfirmationModal from './src/Components/DeleteModalComponent';
import PostDetails from './src/Screens/Posts/PostDetails';
import useDelete from './src/hooks/useDelete';
import AddCategory from './src/Screens/Category/AddCategory';
import UpdateCategory from './src/Screens/Category/UpdateCategory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
    const { userToken, user, logout } = useContext(AuthContext);
    const { toast, showToast, hideToast } = useToast();
    const {
        deleteModalVisible,
        deleteData,
        triggerDelete,
        confirmDelete,
        cancelDelete,
    } = useDelete({
        baseUrl: `http://192.168.100.8:3000/api/user/delete/`,
        onSuccess: ({ id, type }) => {
            if (type === 'user') {
                showToast("Account deleted Successfully", 'success');
                setTimeout(() => {
                    logout();
                }, 1000);

            }
        }
    });
    useEffect(() => {

    }, [userToken]);


    const TabStack = () => {
        return (
            <Tab.Navigator initialRouteName="Home" screenOptions={{
                tabBarStyle: { paddingTop: 5, height: 50 },
            }}>
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        title: 'Home', headerShown: false, tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (<Image source={require('./Images/home.png')}
                            style={{ height: 38, width: 35, tintColor: focused ? "black" : "gray" }} />)
                    }} />
                <Tab.Screen
                    name="AddPost"
                    component={AddPost}
                    options={{
                        title: 'Add', headerShown: false, tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Image source={require('./Images/add.png')}
                                style={{ height: 38, width: 35, tintColor: focused ? "black" : "gray" }} />)
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
                                style={{ height: 33, width: 35, tintColor: focused ? "black" : "gray" }}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        tabLongPress: () => triggerDelete({ id: user?.id, name: user?.name, type: 'user' }),
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
                    {props => <SignUp {...props} />}

                </Stack.Screen>
                <Stack.Screen name="Login"
                    options={{
                        gestureEnabled: true,
                    }}>
                    {props => <Login {...props} />}

                </Stack.Screen>
            </Stack.Navigator>
        )
    }
    const ProfileStack = () => {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Profile" component={Profile} initialParams={{ userId: user?.id }} />
                <Stack.Screen name="EditProfile" component={EditProfile} initialParams={{ userId: user?.id }} />
                <Stack.Screen name="PostDetails" component={PostDetails} />
            </Stack.Navigator>
        );
    }
    const HomeStack = () => {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="PostDetails" component={PostDetails} />
                <Stack.Screen name="AddCategory" component={AddCategory} />
                <Stack.Screen name="UpdateCategory" component={UpdateCategory} />
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            {userToken !== null ? (
                <TabStack />
            ) : (
                <LoginStack />
            )}
            <DeleteConfirmationModal
                visible={deleteModalVisible}
                itemName={deleteData.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onDismiss={hideToast}
            />
        </NavigationContainer>

    )
}

export default App;