import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';

const Header = ({ navigation, textMain, textSub }) => {
    return (
        <View style={styles.header}>
            {textSub ? (
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../Images/icons8-arrow-left-50.png')} style={styles.backButton} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{textMain}</Text>
                    <Text style={styles.headerSubText}>{textSub}</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.headerHomeText}>{textMain}</Text>
                    <View style={styles.searchContainer}>
                        <Image source={require('../../Images/search.png')} style={styles.searchIcon} />
                        <TextInput
                            style={styles.search}
                            placeholder="Search..."
                            placeholderTextColor="gray"
                        />
                    </View>
                </View>
            )}
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
        padding: 20,
    },
    headerText: {
        fontSize: 45,
        color: 'white',
        marginTop: 25,
    },
    headerHomeText: {
        fontSize: 45,
        color: 'white',
        marginTop: 50,
    },
    headerSubText: {
        fontSize: 25,
        color: '#D3D3D3',
        marginTop: 5,
    },
    backButton: {
        height: 30,
        width: 30,
        marginTop: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 9,
        marginTop: 20,
        width: 370,
    },
    searchIcon: {
        width: 30,
        height: 27,
        marginRight: 10,
        marginLeft: 10,
    },
    search: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 20,
        color: 'black',
    },
});

export default Header;
