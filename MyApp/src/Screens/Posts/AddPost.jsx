import React from 'react'
import { Text, View, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet } from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const AddPost = ({ navigation }) => {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({ title: '', description: '', image: '', prize: '', categoryId: '' });
    const [error, setError] = useState({ titleError: '' });
    const { userToken, user } = useContext(AuthContext);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

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
    const handleSubmit = async () => {
        if (!formData.title || !formData.description || error.titleError) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('prize', formData.prize ? formData.prize : null);
        form.append('categoryId', formData.categoryId);

        if (formData.image) {
            form.append('postPicture', {
                uri: formData.image,
                type: 'image/jpeg',
                name: `${Date.now()}_post.jpg`,
            });
        }
        fetch('http://192.168.100.8:3000/api/posts/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userToken}`
            },
            body: form
        })

            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setFormData({ title: '', description: '', image: '', prize: '', categoryId: '' });
                    showToast("Added Post Successfully", 'success');
                    setTimeout(() => {
                        navigation.navigate('Home')
                    }, 1000);
                } else {
                    showToast(data.message, 'error');
                }
            })
            .catch(err => {
                showToast('Something went wrong. Please try again later', 'error');
            });


    };
    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets) {
                setFormData(prev => ({ ...prev, image: response.assets[0].uri }));
            }
        });
    };

    return (
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.headerText}>Create Post</Text>
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>
                        Post
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 30 }}>
                <Image source={{ uri: `http://192.168.100.8:3000/uploads/${user?.image}` }} style={styles.profileImage} />
                <Text style={{ fontSize: 25, marginLeft: 10 }}>{user?.name}</Text>
            </View>
            <View style={{ marginBottom: 20, marginTop: -10 }}>
                {formData.image ? (
                    <Image
                        style={styles.imagePreview}
                        source={
                            formData.image.startsWith('file')
                                ? { uri: formData.image }
                                : { uri: `http://192.168.100.8:3000/uploads/${formData?.image}` }
                        }
                    />
                ) : (
                    <Image
                        style={styles.imagePreview}
                        source={require('../../../Images/post.jpeg')}
                    />
                )}
                <TouchableOpacity onPress={selectImage} style={styles.chooseImageButton}>
                    <Text style={styles.chooseImageText}>
                        Choose Post Picture
                    </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setFormData(prev => ({ ...prev, title: text }));
                        const titleRegex = /^[a-zA-Z ]{2,}$/;
                        setError(prev => ({ ...prev, titleError: titleRegex.test(text) ? '' : 'Invalid title' }));
                    }}
                    placeholder="Post Title"
                    value={formData.title}
                />
                {error.titleError ? <Text style={styles.errorText}>{error.titleError}</Text> : null}

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setFormData(prev => ({ ...prev, description: text }));
                    }}
                    placeholder="Post Description"
                    value={formData.description}

                />

                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        setFormData(prev => ({ ...prev, prize: text }));
                    }}
                    placeholder="Add prize if its a service"
                    value={formData.prize}

                />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.categoryId}
                        style={styles.picker}
                        onValueChange={(value) =>
                            setFormData(prev => ({ ...prev, categoryId: value }))
                        }
                        dropdownIconColor="#47787F"
                    >
                        <Picker.Item label="Select a category..." value="" color="#999" />
                        {categories.map((category) => (
                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                        ))}
                    </Picker>
                </View>
                <Toast
                    message={toast.message}
                    type={toast.type}
                    visible={toast.visible}
                    onDismiss={hideToast}
                />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        paddingTop: 35,
        marginTop:-20,
        backgroundColor: '#47787F',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerText: {
        fontSize: 27,
        marginTop: 13,
        color: '#fff',
        textAlign: 'center'
    },
    headerButton: {
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        padding: 8,
        width: 130,
        marginTop: 20,
        fontSize: 20,
        backgroundColor:'white'

    },
    headerButtonText: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
    },
    input: {
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginTop: 15,
        margin: 20,
        fontSize: 18,

    },
    profileImage: {
        height: 40,
        width: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: '#000',
        borderRadius: 100
    },
    imagePreview: {
        width: '90%',
        height: 200,
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
        borderWidth:2,
        borderColor:'black'
    },
    chooseImageButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        margin: 23,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    chooseImageText: {
        color: '#000',
        fontSize: 17
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 20,
        marginTop: 15,
        overflow: 'hidden',
        paddingHorizontal: 10,
        elevation: 10,
    },

    picker: {
        height: 60,
        width: '100%',
        color: '#666',
        fontSize: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        marginLeft: 30,
    },



})
export default AddPost