import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../Context/AuthContext';

const Post = ({ postData, navigation, handleLikeToggled }) => {
    const [liked, setLiked] = useState(postData.likeId ? true : false);
    const { userToken, user } = useContext(AuthContext)


    const handleLikes = async (likeId) => {
        try {
            if (liked) {
                const response = await fetch(`http://192.168.100.8:3000/api/likes/deleteLike/${likeId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userToken}`,

                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setLiked(false);
                    navigation.navigate('Home')
                    if (handleLikeToggled) {
                        handleLikeToggled()
                    }
                } else {
                    console.error('Unlike failed:', data.message || 'Unknown error');
                }
            } else {
                const response = await fetch(`http://192.168.100.8:3000/api/likes/createLike`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId: postData.id }),
                });

                const data = await response.json();

                if (response.ok) {
                    setLiked(true);
                    navigation.navigate('Home')
                    handleLikeToggled()
                } else {
                    console.error('Like failed:', data.message || 'Unknown error');
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };


    return (
        <View style={styles.posts}>
            {postData.type !== 'Service' ? (
                <View style={styles.posterInfo}>
                    <Image source={{ uri: `http://192.168.100.8:3000/uploads/${postData.profilePicture}` }} style={styles.profileImage} />
                    <TouchableOpacity onPress={() => { { navigation.navigate('Profile', { userId: postData.user_id }) } }}>
                        <Text style={{ fontSize: 25, marginLeft: 10 }}>{postData.userName}</Text>
                    </TouchableOpacity>
                </View>) :
                (
                    <View style={styles.posterInfo}>
                        <Image source={{ uri: `http://192.168.100.8:3000/uploads/${postData.profilePicture}` }} style={styles.profileImage} />
                        <TouchableOpacity onPress={() => { navigation.navigate('Profile', { userId: postData.user_id }) }}>
                            <Text style={{ fontSize: 25, marginLeft: 10 }}>{postData.userName}</Text>
                        </TouchableOpacity>
                        <Text style={styles.salesText}>Service</Text>
                    </View>
                )}
            <Image source={{ uri: `http://192.168.100.8:3000/uploads/${postData.postPicture}` }} style={styles.postImage} />

            <Text style={styles.postText}>{postData.description}</Text>
            {postData.user_id !== user?.id &&
                <View style={{ width: '100%', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => { handleLikes(postData.likeId) }}>
                        <Image
                            source={postData.likeId
                                ? require('../../Images/heart.png')
                                : require('../../Images/icons8-heart-24.png')
                            }
                            style={styles.icon}
                        />

                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    posts: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 15
    },
    postText: {
        color: 'black',
        fontSize: 20,
        width: '100%',
        marginTop: 8
    },
    posterInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 10
    },
    postImage: {
        height: 200,
        width: '90%',
        borderRadius: 20
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 100
    },
    icon: {
        width: 40,
        height: 40,
    },
    salesText: {
        fontSize: 24,
        marginLeft: 90,
        color: '#47787F'
    }
})
export default Post