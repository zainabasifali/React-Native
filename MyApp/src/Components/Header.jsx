import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const Header = ({ navigation }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={require('../../Images/icons8-arrow-left-50.png')} style={styles.backButton} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Hello!</Text>
            <Text style={styles.headerSubText}>Welcome to Home Talents</Text>
        </View>
    )
}
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
    backButton: {
        height: 30,
        width: 30,
        marginTop: 15,
    }

});
export default Header