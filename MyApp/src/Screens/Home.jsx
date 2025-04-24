import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from "react";
import Post from '../Components/Post';

const Home = () => {
    return (
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home Talents</Text>
                <View style={styles.searchContainer}>
                    <Image source={require('../../Images/search.png')} style={styles.searchIcon} />
                    <TextInput style={styles.search} placeholder="Search..." placeholderTextColor="gray" />
                </View>
            </View>

            <Text style={styles.subHeading}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10 }}>
                <View style={styles.category}>
                    <Image source={require('../../Images/paint-palette.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Arts</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/coding.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Tech</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/illustration.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Design</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/bracelet.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Decor</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/cupcake.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Bakes</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/sewing-machine.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Stich</Text>
                </View>
                <View style={styles.category}>
                    <Image source={require('../../Images/fast-food.png')} style={styles.categoryImage} />
                    <Text style={styles.categoryText} >Foods</Text>
                </View>
            </ScrollView>

            <Post name = {'Zainab Asif'} Postimage = {require('../../Images/post1.jpg')} forSale = {false} Profileimage = {require('../../Images/profile1.jpg')}/>
            <Post name = {'Abass Ali'} Postimage = {require('../../Images/post2.jpg')} forSale = {true} Profileimage = {require('../../Images/profile2.jpg')}/>
            <Post  name = {'Adeeba Ali'} Postimage = {require('../../Images/post3.jpg')} forSale = {false} Profileimage = {require('../../Images/profile1.jpg')}/>
            <Post  name = {'Hur Ali'} Postimage = {require('../../Images/profile1.jpg')} forSale = {true} Profileimage = {require('../../Images/profile2.jpg')}/>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#47787F',
        height: 250,
        width: '100%',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 20
    },
    headerText: {
        fontSize: 40,
        color: 'white',
        fontStyle: 'cursive',
        marginTop: 50
    },
    subHeading: {
        fontSize: 30,
        paddingLeft: 10,
        marginTop: 25,
        marginBottom: 5
    },
    category: {
        width: 85,
    },
    categoryImage: {
        height: 40,
        width: 40
    },
    categoryText: {
        fontSize: 20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 9,
        marginTop: 20,
        width: 370,
    },
    searchIcon: {
        width: 30,
        height: 27,
        marginRight: 10,
        marginLeft: 10
    },
    search: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 20,
        color: 'black',
    }
})

export default Home