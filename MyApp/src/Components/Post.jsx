import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput } from 'react-native';

const Post = ({ name, Postimage, forSale, Profileimage }) => {
    const [liked, setLiked] = useState(false);
    return (
        <View style={styles.posts}>
            {/* if for sale then return this layout */}
            {forSale ? (<View style={styles.posterInfo}>
                <Image source={Profileimage} style={styles.profileImage} />
                <Text style={{ fontSize: 25, marginLeft: 10 }}>{name}</Text>
            </View>) : (
                // else without sale return this layout
                <View style={styles.posterInfo}>
                    <Image source={Profileimage} style={styles.profileImage} />
                    <Text style={{ fontSize: 25, marginLeft: 10 }}>{name}</Text>
                    <Text style={styles.salesText}>For Sale</Text>
                </View>
            )}
            <Image source={Postimage} style={styles.postImage} />
            <Text style={styles.postText}>Bringing colors to life, one brushstrokes at a time!</Text>
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