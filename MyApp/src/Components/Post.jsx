import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput } from 'react-native';

const Post = ({ postData }) => {
    const [liked, setLiked] = useState(false);
    return (
        <View style={styles.posts}>
            {postData.type !== 'Service' ? (<View style={styles.posterInfo}>
                <Image source={{ uri: `http://10.0.2.2:3000/uploads/${postData.profilePicture}` }} style={styles.profileImage} />
                <Text style={{ fontSize: 25, marginLeft: 10 }}>{postData.userName}</Text>
            </View>) : (
                <View style={styles.posterInfo}>
                    <Image source={{ uri: `http://10.0.2.2:3000/uploads/${postData.profilePicture}` }} style={styles.profileImage} />
                    <Text style={{ fontSize: 25, marginLeft: 10 }}>{postData.userName}</Text>
                    <Text style={styles.salesText}>For Sale</Text>
                </View>
            )}
            <Image source={{ uri: `http://10.0.2.2:3000/uploads/${postData.postPicture}` }} style={styles.postImage} />
            <Text style={styles.postText}>{postData.description}</Text>
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => setLiked(!liked)}>
                    <Image
                        source={liked
                            ? require('../../Images/heart.png')
                            : require('../../Images/icons8-heart-24.png')
                        }
                        style={styles.icon}
                    />

                </TouchableOpacity>
            </View>
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