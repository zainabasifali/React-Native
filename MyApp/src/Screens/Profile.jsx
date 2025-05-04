import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const Posts = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/posts/userPosts/${user.id}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    const renderPosts = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.posts}>
                {item.postPicture && (
                    <Image source={{ uri: `http://10.0.2.2:3000/uploads/${item.postPicture}` }} style={styles.postImg} />
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            renderItem={renderPosts}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    );
};

const Services = ({ user }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/posts/userServices/${user.id}`);
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchServices();
        }
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchServices();
        setRefreshing(false);
    };

    const renderServices = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.sales}>
                {item.postPicture && (
                    <Image source={{ uri: `http://10.0.2.2:3000/uploads/${item.postPicture}` }} style={styles.salesImg} />
                )}
                <View style={{ textAlign: 'center' }}>
                    <Text style={styles.salesHeading} numberOfLines={1} ellipsizeMode="tail">{item.title} </Text>
                    <Text style={styles.salesDesc}>{item.prize} Rs</Text>
                    <TouchableOpacity style={styles.button} onPress={() => alert('Contact Zainab Asif at:\n 03783747565748\n ')}>
                        <Text style={styles.buttonText}>Contact Now!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <FlatList
            data={services}
            renderItem={renderServices}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    );
};

const Profile = ({ user, navigation }) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [profileData, setProfileData] = useState({});

    const [routes] = useState([
        { key: 'first', title: 'Posts' },
        { key: 'second', title: 'Services' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <Posts user={user} />;
            case 'second':
                return <Services user={user} />;
            default:
                return null;
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/user/profile/${user.id}`);
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    return (
        <View style={styles.View}>
            <View style={styles.container}>
                {profileData.profilePicture && (
                    <Image source={{ uri: `http://10.0.2.2:3000/uploads/${profileData.profilePicture}` }} style={styles.profileImg} />
                )}
                <Text style={styles.bioHeading}>{profileData.name}</Text>
                <Text style={styles.bioPara}>{profileData.profession}</Text>
                <View style={styles.followInfo}>
                    <Text style={styles.followText}><Text style={styles.followCount}>{profileData.postCount}</Text> Creations  </Text>
                    <Text style={styles.followText}><Text style={styles.followCount}>{profileData.follower_count}</Text> Followers  </Text>
                    <Text style={styles.followText}><Text style={styles.followCount}>{profileData.following_count}</Text> Following  </Text>
                </View>
                {user && profileData.id === user.id ? (
                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.profileButton} onPress={() => alert('Explore Pressed!')}>
                        <Text style={styles.buttonText}>Follow</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: '#47787F' }}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        tabStyle={{ height: -10, fontSize: 30 }}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    View: {
        flex: 1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImg: {
        height: 200,
        width: '100%',
        borderRadius: 20
    },
    bioHeading: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    },
    bioPara: {
        fontSize: 20,
        color: 'grey'
    },
    followInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 10
    },
    posts: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginTop: 10,
        marginBottom: 10
    },
    sales: {
        flexDirection: 'row',
        gap: 20,
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '90%',
        padding: 20,
        margin: 20,
    },
    salesImg: {
        borderRadius: 10,
        height: 150,
        width: 150
    },
    salesHeading: {
        fontSize: 28,
        width: 170,
    },
    salesDesc: {
        fontSize: 20,
        marginTop: 10
    },
    followText: {
        width: 100,
        fontSize: 20,
        color: 'grey'
    },
    followCount:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black'
    },

    postImg: {
        height: 170,
        width: '90%',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,

    },
    button: {
        backgroundColor: '#47787F',
        height: 50,
        border: 1,
        width: 160,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        align: 'center',
    },
    profileButton: {
        backgroundColor: '#47787F',
        height: 50,
        border: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 20,
        width: 400
    },
})
export default Profile;

