import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const CategoryForm = ({ initialName, initialImage , onSubmit, submitButtonText }) => {
    const [name, setName] = useState(initialName);
    const [image, setImage] = useState(initialImage);

    useEffect(() => {
        setName(initialName);
        setImage(initialImage);
    }, [initialName, initialImage]);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handlePress = () => {
        if (!name) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        onSubmit({ name, image });
    };

    return (
        <View style={styles.Form}>
            {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
                <Image source={require('../../Images/user.png')} style={styles.imagePreview} />
            )}

            <TouchableOpacity onPress={selectImage} style={styles.chooseImageButton}>
                <Text style={styles.chooseImageText}>Choose Category Image</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={name}
                onChangeText={setName}
            />

            <TouchableOpacity style={styles.Button} onPress={handlePress}>
                <Text style={styles.ButtonText}>{submitButtonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    Form: { padding: 30, marginTop: 10 },
    input: {
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        height: 65,
        marginTop: 20,
        fontSize: 18,
    },
    Button: {
        backgroundColor: '#47787F',
        borderRadius: 20,
        padding: 15,
        height: 55,
        marginTop: 20,
        fontSize: 18,
        marginBottom: 20,
    },
    ButtonText: { fontSize: 20, color: 'white', textAlign: 'center' },
    chooseImageButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    chooseImageText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 20,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#47787F',
    },
});

export default CategoryForm;
