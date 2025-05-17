import { useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import Header from '../../Components/Header';
import { AuthContext } from '../../Context/AuthContext';
import Toast from '../../Components/Toast';
import useToast from "../../hooks/useToast";

const Login = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
     const { toast, showToast, hideToast } = useToast();

    const handleSubmit = async () => {
        setError('');
        if (!email || !password) {
            alert('Please check credentials and fill in all fields');
            return;
        }

        try {
            await login(email, password, navigation);
        } catch (err) {
            showToast("Invalid email or password", 'error')}
    };

    return (
        <View>
            <Header navigation={navigation} textMain="Hello!" textSub="Welcome to Home Talents" />
            <View style={styles.loginForm}>
                <Text style={styles.login}>Login</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    placeholder="Email"
                    value={email}
                />

                <TextInput
                    style={styles.input}
                    secureTextEntry
                    onChangeText={(text) => {
                        setPassword(text);
                    }}
                    placeholder="Password"
                    value={password}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                    <Text style={styles.ButtonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.alternateText}>---------   Or SignIn with   ---------</Text>
                <View style={styles.iconContainer}>
                    <View style={styles.iconParent}>
                        <Image source={require('../../../Images/facebook.png')} style={styles.icons} />
                    </View>
                    <View style={styles.iconParent}>
                        <Image source={require('../../../Images/google.png')} style={styles.icons} />
                    </View>
                    <View style={styles.iconParent}>
                        <Image source={require('../../../Images/instagram.png')} style={styles.icons} />
                    </View>
                </View>
            </View>
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
        height: 50,
        width: 50
    },
    alternateText: {
        marginTop: 40,
        fontSize: 23,
        textAlign: 'center',
        color: 'gray'
    },
    errorText: {
        color: 'red',
        fontSize: 20,
        marginTop: 10,
    }
});

export default Login;
