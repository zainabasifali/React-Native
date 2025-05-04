import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput, FlatList, ActivityIndicator,RefreshControl } from 'react-native';
import React, { useState, useEffect } from "react";
import Post from '../Components/Post';
import Header from '../Components/Header';

const Home = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/categories/allCategories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    const fetchPosts = async (categoryId = null) => {
        setLoading(true);
        try {
            const url = categoryId 
            ? `http://10.0.2.2:3000/api/posts/categoryPosts/${categoryId}`
            : 'http://10.0.2.2:3000/api/posts/allPosts';

            const response = await fetch(url);
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } 
    }
    const renderCategories = ({ item }) => (
        <View style={styles.category}>
            <TouchableOpacity onPress={()=>{fetchPosts(item.id)}}>
            <Image source={{ uri: `http://10.0.2.2:3000/uploads/${item.picture}` }} style={styles.categoryImage} />
            </TouchableOpacity>
            <Text style={styles.categoryText} >{item.name}</Text>
        </View>
    );
    const renderPosts = ({ item }) => (
        <Post postData={item}/>
    )

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View>
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
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={
                <>
                    <Header textMain="Home Talents" navigation={navigation} />
                    <Text style={styles.subHeading}>Categories</Text>
                    <FlatList
                        data={categories}
                        renderItem={renderCategories}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                </>
            }
            showsVerticalScrollIndicator={false}
        />
    );
    
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
    }
})

export default Home