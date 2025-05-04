import { ScrollView } from "react-native-gesture-handler";
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../Components/Header';

const EditProfile = ({ user, navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [profession, setProfession] = useState('');
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState('');
    const [professionError, setProfessionError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:3000/api/user/profile/${user.id}`);
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setPassword(data.password);
            setProfession(data.profession);
            setImage(data.profilePicture);

        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    useEffect(() => {
        fetchProfile();
    }, [user]);

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
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profession', profession);

        if (image && image.startsWith('file')) {
            formData.append('profilePicture', {
                uri: image,
                type: 'image/jpeg',
                name: `${Date.now()}_profile.jpg`,
            });
        }

        fetch(`http://10.0.2.2:3000/api/user/updateProfile/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log('Response:', data)
                if (data.success === true) {
                    navigation.navigate('Profile')
                }
            })
            .catch(err => console.error(err));

    };
    return (
        <ScrollView >
            <Header navigation={navigation} textMain={"Edit Profile"} textSub={"Below is your information"} />
            <View style={styles.loginForm}>
                {image ? (
                    <Image
                        source={
                            image.startsWith('file')
                                ? { uri: image }
                                : { uri: `http://10.0.2.2:3000/uploads/${image}` }
                        }
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
                        setProfession(text);
                        const professionRegex = /^[a-zA-Z ]{2,}$/;
                        setProfessionError(professionRegex.test(text) ? '' : 'Invalid profession');
                    }}
                    placeholder="Profession"
                    value={profession}
                />
                {professionError ? <Text style={styles.errorText}>{professionError}</Text> : null}

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
                    <Text style={styles.ButtonText}>Save</Text>
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
export default EditProfile;