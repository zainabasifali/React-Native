import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../Components/Header';

const SignUp = ({ navigation, setAuth }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleSubmit = () => {
        if (emailError || passwordError || !email || !password || !name || nameError) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        setAuth(true)

    };

    return (
        <ScrollView>
            <Header navigation={navigation} />
            <View style={styles.loginForm}>
                <Text style={styles.login}>SignUp</Text>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.imagePreview}
                    />
                ) : (
                    <Image
                        source={require('../../Images/user.png')}
                        style={styles.imagePreview}
                    />
                )}
                <TouchableOpacity onPress={selectImage} style={styles.chooseImageButton}>
                    <Text style={styles.chooseImageText}>
                        Choose Profile Picture
                    </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setName(text);
                        const nameRegex = /^[a-zA-Z ]{2,}$/;
                        setNameError(nameRegex.test(text) ? '' : 'Invalid name');
                    }}
                    placeholder="Full Name"
                    value={name}
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}


                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setEmail(text);
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        setEmailError(emailRegex.test(text) ? '' : 'Invalid email address');
                    }}
                    placeholder="Email"
                    value={email}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TextInput
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(text) => {
                        setPassword(text);
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
                        setPasswordError(passwordRegex.test(text) ? '' : 'Password must be at least 8 characters, include upper/lowercase, a number, and special char');
                    }}
                    placeholder="Password"
                    value={password}
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                    <Text style={styles.ButtonText}>SignUp</Text>
                </TouchableOpacity>


            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({

    loginForm: {
        padding: 30,
        marginTop: 25
    },
    login: {
        fontSize: 35,
        color: '#47787F',
        fontWeight: 'bold',
    },
    input: {
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        height: 65,
        marginTop: 20,
        fontSize: 18
    },
    Button: {
        backgroundColor: '#47787F',
        borderRadius: 20,
        padding: 20,
        height: 65,
        marginTop: 20,
        fontSize: 18,
        marginBottom: 20
    },
    ButtonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 15,
        marginTop: 5,
    },
    ImageButton: {
        borderRadius: 20,
        border: 1,
        color: 'black'
    },
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
    chooseImageText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold'
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 20,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#47787F'
    }

});
export default SignUp