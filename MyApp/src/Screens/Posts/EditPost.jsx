import React, { useState, useEffect, useContext } from 'react';
import { Modal, View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../Context/AuthContext';

const EditPostModal = ({ visible, postData, onClose, onSave, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        prize: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    const {userToken} = useContext(AuthContext);

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

    useEffect(() => {
        if (postData) {
            setFormData({
                title: postData.title || '',
                description: postData.description || '',
                image: postData.postPicture || '',
                prize: postData.prize ? String(postData.prize) : '',
                categoryId: postData.category_id || '',
            });
        }
        fetchCategories();
    }, [postData]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Post</Text>

                    <Image
                        style={styles.imagePreview}
                        source={
                            formData.image?.startsWith('file')
                                ? { uri: formData.image }
                                : formData.image
                                    ? { uri: `http://192.168.100.8:3000/uploads/${formData.image}` }
                                    : require('../../../Images/post.jpeg')
                        }
                    />

                    <TextInput
                        placeholder="Title"
                        style={styles.input}
                        value={formData.title}
                        onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
                    />
                    <TextInput
                        placeholder="Description"
                        style={[styles.input, { height: 100 }]}
                        value={formData.description}
                        onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                        multiline
                    />

                    <TextInput
                        keyboardType='numeric'
                        placeholder="Prize (optional)"
                        style={styles.input}
                        value={formData.prize}
                        onChangeText={text => setFormData(prev => ({ ...prev, prize: text }))}
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

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onSave(formData)}
                            style={styles.saveButton}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        width: '90%',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#47787F',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        fontSize:18,
        textAlign: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#47787F',
        marginBottom: 20,
    },

    pickerContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        elevation: 10,
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        color: '#666',
        fontSize: 20,
    },
});

export default EditPostModal;
