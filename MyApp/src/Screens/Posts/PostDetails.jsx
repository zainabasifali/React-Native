import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Post from '../../Components/Post';
import Header from '../../Components/Header';
import DeleteConfirmationModal from '../../Components/DeleteModalComponent';
import EditPostModal from './EditPost';
import useDelete from '../../hooks/useDelete';
import { AuthContext } from '../../Context/AuthContext';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const PostDetails = ({ route }) => {
    const { navigation, collection, userId } = route.params;
    const [posts, setPosts] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const { userToken, user } = useContext(AuthContext);
    const { toast, showToast, hideToast } = useToast();
    const {
        deleteModalVisible,
        deleteData,
        triggerDelete,
        confirmDelete,
        cancelDelete,
    } = useDelete({
        baseUrl: `http://192.168.100.8:3000/api/posts/delete/`,
        onSuccess: () => { fetchPosts(), navigation.navigate('Profile') },
    });

    const fetchPosts = async () => {
        try {
            const url = collection === 'Services'
                ? `http://192.168.100.8:3000/api/posts/userServices/${userId}`
                : `http://192.168.100.8:3000/api/posts/userPosts/${userId}`

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleEditPress = (post) => {
        setSelectedPost(post);
        setEditModalVisible(true);
    };

    const handleSaveEdit = async (updatedData) => {
        const res = fetch(`http://192.168.100.8:3000/api/posts/update/${selectedPost.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`
            },
            body: JSON.stringify(updatedData),
        }).then((res) => {
            if (res.ok) {
                showToast("Updated Post Successfully", 'success');
                fetchPosts();
                setEditModalVisible(false)
                setTimeout(() => {
                    navigation.navigate('Profile')
                }, 1000);
            }
            else {
                showToast("Error Updating Post", 'error');
            }
        })
    };

    const renderPosts = ({ item }) => (
        <View>
            <Post postData={item} navigation={navigation}/>
            {item.user_id == user?.id &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => triggerDelete({ id: item.id, name: item.title, type: 'post' })}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );

    useEffect(() => {
        fetchPosts();
        console.log(route.params)
    }, [userId]);


    return (
        <View style={{ flex: 1 }}>
            <Header
                navigation={navigation}
                textMain={"All Posts"}
                textSub={"Your Posts Your Changes"}
            />
            <FlatList
                data={posts}
                renderItem={renderPosts}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />

            <DeleteConfirmationModal
                visible={deleteModalVisible}
                itemName={deleteData.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <EditPostModal
                visible={editModalVisible}
                postData={selectedPost}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveEdit}
            />
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onDismiss={hideToast}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        // marginTop: 5,
    },
    editButton: {
        backgroundColor: '#47787F',
        width: 140,
        padding: 10,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        width: 140,
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
});

export default PostDetails;
