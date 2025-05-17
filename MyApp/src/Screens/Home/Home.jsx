import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect, useContext } from "react";
import Post from '../../Components/Post';
import Header from '../../Components/Header';
import useDelete from '../../hooks/useDelete';
import DeleteConfirmationModal from '../../Components/DeleteModalComponent';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../Context/AuthContext';

const Home = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, userToken } = useContext(AuthContext);

    const {
        deleteModalVisible,
        deleteData,
        triggerDelete,
        confirmDelete,
        cancelDelete,
    } = useDelete({
        baseUrl: `http://192.168.100.8:3000/api/categories/delete/`,
        onSuccess: () => { fetchCategories() },
    });
    const nav = useNavigation();
    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://192.168.100.8:3000/api/categories/allCategories`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    const fetchPosts = async (categoryId = null) => {
        try {
            const url = categoryId
                ? `http://192.168.100.8:3000/api/posts/categoryPosts/${categoryId}`
                : 'http://192.168.100.8:3000/api/posts/allPosts';

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }
    const renderCategories = ({ item }) => (
        <View>
            <View style={styles.category}>
                <TouchableOpacity onPress={() => { fetchPosts(item.id) }} onLongPress={() => { user?.role == 'admin' && (triggerDelete({ id: item.id, name: item.name, type: 'category' })) }}>
                    <Image source={{ uri: `http://192.168.100.8:3000/uploads/${item.picture}` }} style={styles.categoryImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { user.role == 'admin' && nav.navigate('UpdateCategory', { id: item.id }) }}>
                    <Text style={styles.categoryText} >{item?.name}</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
    const handleLikeToggle = () => {
        fetchPosts();
    };

    const renderPosts = ({ item }) => (
        <Post postData={item} navigation={navigation} handleLikeToggled={handleLikeToggle} />
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
        <View>
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
                            ListFooterComponent={
                                user?.role === 'admin' && <TouchableOpacity onPress={() => navigation.navigate('AddCategory')} style={styles.addCategoryButton}>
                                    <Text style={styles.addCategoryText}>+ Add</Text>
                                </TouchableOpacity>
                            }
                        />

                    </>
                }
                showsVerticalScrollIndicator={false}

            />
            <DeleteConfirmationModal
                visible={deleteModalVisible}
                itemName={deleteData.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </View>
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
    },
    addCategoryButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 9,
        marginTop: 10,
        backgroundColor: '#47787F',
        borderRadius: 10,
        height: 40
    },
    addCategoryText: {
        color: 'white',
        fontSize: 19
    }
})

export default Home