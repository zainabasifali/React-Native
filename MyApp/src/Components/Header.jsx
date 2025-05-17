import { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';

const Header = ({ navigation, textMain, textSub }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { userToken, logout } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const response = await fetch(`http://192.168.100.8:3000/api/user/search?q=${search}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      const data = await response.json();
      setResults(data);

      setShowDropdown(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSearch('');
    setResults([]);
    setShowDropdown(false);
    navigation.navigate('Profile', { userId: user.id });
  };

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
          <TouchableOpacity onPress={async () => { await logout(); }} > <Image source={require('../../Images/logout.png')} style={styles.logoutButtonImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{textMain}</Text>
          <View style={{ position: 'relative' }}>
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={handleSearch}>
                <Image source={require('../../Images/search.png')} style={styles.searchIcon} />
              </TouchableOpacity>
              <TextInput
                style={styles.search}
                placeholder="Search..."
                placeholderTextColor="gray"
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                  if (text.length >= 2) {
                    handleSearch();
                  } else {
                    setShowDropdown(false);
                  }
                }}
              />
            </View>

            {showDropdown && results.length > 0 && (
              <FlatList
                style={styles.dropdown}
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => handleSelectUser(item)}>
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownText}>{item.name} - {item.profession}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#47787F',
    height: 220,
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 45,
    color: 'white',
    marginTop: 10,
  },

  logoutButtonImage: {
    height: 20,
    width: 33,
    alignSelf: 'flex-end'

  },
  headerSubText: {
    fontSize: 25,
    color: '#D3D3D3',
    marginTop: 5,
  },
  backButton: {
    height: 30,
    width: 30,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    marginTop: 10,
    width: '100%',
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
  dropdown: {
    position: 'absolute',
    top: 65,
    width: 320,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 150,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 18,
    color: 'black',
  },
});

export default Header;
