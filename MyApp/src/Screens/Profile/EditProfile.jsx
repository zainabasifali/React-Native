import { ScrollView } from "react-native-gesture-handler";
import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../Components/Header';
import Toast from '../../Components/Toast';
import { AuthContext } from '../../Context/AuthContext';
import useToast from "../../hooks/useToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ navigation, route }) => {
    const { userId } = route.params;
    const { toast, showToast, hideToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [profession, setProfession] = useState('');
    const [error, setError] = useState({ nameError: '', emailError: '', professionError: '' });
    const { userToken } = useContext(AuthContext);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://192.168.100.8:3000/api/user/profile/${userId}`,{
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setProfession(data.profession);
            setImage(data.profilePicture);

        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets) {
                setImage(response.assets[0].uri);
            }
        });
    };
    const handleSubmit = async() => {
        if (!email || !name || error.nameError || error.emailError || error.professionError) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('profession', profession);

        if (image && image.startsWith('file')) {
            formData.append('profilePicture', {
                uri: image,
                type: 'image/jpeg',
                name: `${Date.now()}_profile.jpg`,
            });
        }

        fetch(`http://192.168.100.8:3000/api/user/updateProfile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${userToken}`
            },
            body: formData
        })
            .then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
                    showToast("Profile updated successfully", 'success')
                    setTimeout(() => {
                      navigation.navigate('Profile')
                    }, 1000);
                }
                else{
                    showToast("Profile updation error", 'error')

                }
            })
            .catch(err => showToast('Something went wrong. Please try again later', 'error')
);

    };
    return (
        
        <ScrollView >
            <Header navigation={navigation} textMain={"Edit Profile"} textSub={"Below is your information"} />
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onDismiss={hideToast}
            />
            <View style={styles.loginForm}>
                {image ? (
                    <Image
                        source={
                            image.startsWith('file')
                                ? { uri: image }
                                : { uri: `http://192.168.100.8:3000/uploads/${image}` }
                        }
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
        marginTop: -20,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#47787F'
    }

});
export default EditProfile;