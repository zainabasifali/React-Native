import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../Components/Header';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [profession, setProfession] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState({ nameError: '', emailError: '', passwordError: '', professionError: '' });
    const { toast, showToast, hideToast } = useToast();

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleSubmit = () => {
        if (!email || !password || !name || error.nameError || error.emailError || error.passwordError || error.professionError) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profession', profession);

        if (image) {
            formData.append('profilePicture', {
                uri: image,
                type: 'image/jpeg',
                name: `${Date.now()}_profile.jpg`,
            });
        }
        fetch('http://192.168.100.8:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    setName('');
                    setEmail('');
                    setPassword('');
                    setProfession('');
                    setImage('');
    
                    showToast("Registered successfully", 'success')
                    setTimeout(() => {
                        navigation.navigate('Login')
                    }, 1000);

                } else {
                    showToast("Registeration error", 'error')
                }
            })
            .catch(err => {
                showToast('Something went wrong. Please try again later', 'error');
            });
    };

    return (
        <ScrollView>
            <Header navigation={navigation} textMain="Hello!" textSub="Welcome to Home Talents" />
            <View style={styles.loginForm}>
                <Text style={styles.login}>SignUp</Text>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.imagePreview}
                    />
                ) : (
                    <Image
                        source={require('../../../Images/user.png')}
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
                        setError(prev => ({ ...prev, nameError: nameRegex.test(text) ? '' : 'Invalid name' }));
                    }}
                    placeholder="Full Name"
                    value={name}
                />
                {error.nameError ? <Text style={styles.errorText}>{error.nameError}</Text> : null}

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setProfession(text);
                        const professionRegex = /^[a-zA-Z ]{2,}$/;
                        setError(prev => ({ ...prev, professionError: professionRegex.test(text) ? '' : 'Invalid profession' }));
                    }}
                    placeholder="Profession"
                    value={profession}
                />
                {error.professionError ? <Text style={styles.errorText}>{error.professionError}</Text> : null}

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setEmail(text);
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        setError(prev => ({ ...prev, emailError: emailRegex.test(text) ? '' : 'Invalid email address' }));
                    }}
                    placeholder="Email"
                    value={email}
                />
                {error.emailError ? <Text style={styles.errorText}>{error.emailError}</Text> : null}

                <TextInput
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(text) => {
                        setPassword(text);
                        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
                        setError(prev => ({ ...prev, passwordError: passwordRegex.test(text) ? '' : 'Password must be at least 8 characters, include upper/lowercase, a number, and special char' }));
                    }}
                    placeholder="Password"
                    value={password}
                />
                {error.passwordError ? <Text style={styles.errorText}>{error.passwordError}</Text> : null}

                <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                    <Text style={styles.ButtonText}>SignUp</Text>
                </TouchableOpacity>

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

    loginForm: {
        padding: 30,
    },
    login: {
        fontSize: 33,
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
        fontSize: 18,
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