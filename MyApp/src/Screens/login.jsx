import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';

const Login = ({ setAuth, navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = () => {
        if (emailError || passwordError || !email || !password) {
            alert('Please check credentials and fill in all fields');
            return;
        }
        console.log('email is: ', email);
        console.log('Password is: ', password);
        setAuth(true);
    };

    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../Images/icons8-arrow-left-50.png')} style={styles.backButton} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Hello!</Text>
                <Text style={styles.headerSubText}>Welcome to Home Talents</Text>
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.login}>Login</Text>
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
                    <Text style={styles.ButtonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.alternateText}>---------   Or SignIn with   ---------</Text>
                <View style={styles.iconContainer}>
                    <View style={styles.iconParent}>
                        <Image source={require('../../Images/facebook.png')} style={styles.icons} />
                    </View>
                    <View style={styles.iconParent}>
                        <Image source={require('../../Images/google.png')} style={styles.icons} />
                    </View>
                     <View style={styles.iconParent}>
                                            <Image source={require('../../Images/instagram.png')} style={styles.icons} />
                                        </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#47787F',
        height: 250,
        width: '100%',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 30,
        fontWeight: 'bold'
    },
    headerText: {
        fontSize: 50,
        color: 'white',
        marginTop: 20
    },
    headerSubText: {
        fontSize: 25,
        color: '#D3D3D3'
    },
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
        fontSize: 18
    },
    ButtonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        marginTop: 10,
        padding: 25,
        justifyContent: 'space-between'
    },
    iconParent: {
        elevation: 10,
        backgroundColor: '#fff',
        height: 65,
        width: 65,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icons: {
        height: 55,
        width: 55
    },
    alternateText: {
        marginTop: 40,
        fontSize: 25,
        textAlign: 'center',
        color: 'gray'
    },
    backButton: {
        height: 30,
        width: 30,
        marginTop: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 15,
        marginTop: 5,
    }
});

export default Login;
