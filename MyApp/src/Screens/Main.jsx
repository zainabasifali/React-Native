import { TouchableOpacity, StyleSheet, View, Image, Text, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Main = ({navigation}) => {

  return (
    <LinearGradient colors={['#7FA3A7', '#47787F', '#2F4F53']} style={styles.container}>
      <Image source={require('../../Images/social.jpg')} style={styles.image} />
      <Text style={[styles.text, styles.heading]}>Home Talents</Text>
      <Text style={[styles.text, styles.para]} >Make your journey exciting, with adding a bit of appreciation</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Explore Pressed!')} >
          <Text style={styles.buttonText}>SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')} >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 4
  },
  image: {
    height: 300,
    width: 340,
    borderRadius: 100,
    marginBottom: 30,
    alignSelf:'center'
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20
  },
  heading: {
    fontSize: 40,
    marginTop: 20,
    fontWeight: 'bold',
  },
  para: {
    fontSize: 25,
    marginBottom: 40
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  button: {
    backgroundColor: '#FFFFFF',
    height: 60,
    width: 180,
    borderRadius: 25,
  },
  buttonText: {
    color: '#47787F',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign:'center',
    marginTop:10
    
  }
})
export default Main;