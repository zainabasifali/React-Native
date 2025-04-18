import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


const Posts = () => {
  return (

    <ScrollView>
      <View style={styles.posts}>
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
      </View>
      <View style={styles.posts}>
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
      </View>
      <View style={styles.posts}>
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
      </View>
      <View style={styles.posts}>
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
      </View>
      <View style={styles.posts}>
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
          <Image source={require('../../Images/profile1.jpg')} style={styles.postImg} />
      </View>
    </ScrollView>
  )
}

const Services = () => {
  return (
    <ScrollView>
      <View style={styles.sales}>
        <Image source={require('../../Images/cupcake.png')} style={styles.salesImg} />
        <View style={{ textAlign: 'center' }}>
          <Text style={styles.salesHeading}>Calligraphy </Text>
          <Text style={styles.salesDesc}>2000 Rs Only</Text>
          <TouchableOpacity style={styles.button} onPress={() => alert('Contact Zainab Asif at:\n 03783747565748\n ')}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sales}>
        <Image source={require('../../Images/profile1.jpg')} style={styles.salesImg} />
        <View style={{ textAlign: 'center' }}>
          <Text style={styles.salesHeading}>Calligraphy </Text>
          <Text style={styles.salesDesc}>2000 Rs Only</Text>
          <TouchableOpacity style={styles.button} onPress={() => alert('Contact Zainab Asif at:\n 03783747565748\n ')}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sales}>
        <Image source={require('../../Images/profile1.jpg')} style={styles.salesImg} />
        <View style={{ textAlign: 'center' }}>
          <Text style={styles.salesHeading}>Calligraphy </Text>
          <Text style={styles.salesDesc}>2000 Rs Only</Text>
          <TouchableOpacity style={styles.button} onPress={() => alert('Contact Zainab Asif at:\n 03783747565748\n ')}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sales}>
        <Image source={require('../../Images/profile1.jpg')} style={styles.salesImg} />
        <View style={{ textAlign: 'center' }}>
          <Text style={styles.salesHeading}>Calligraphy </Text>
          <Text style={styles.salesDesc}>2000 Rs Only</Text>
          <TouchableOpacity style={styles.button} onPress={() => alert('Contact Zainab Asif at:\n 03783747565748\n ')}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  )
}

const renderScene = SceneMap({
  first: Posts,
  second: Services,
});

const routes = [
  { key: 'first', title: 'Posts' },
  { key: 'second', title: 'Services' },
];

const Profile = () => {

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.View}>
      <View style={styles.container}>
        <Image source={require('../../Images/profile1.jpg')} style={styles.profileImg} />
        <Text style={styles.bioHeading}>Zainab Asif</Text>
        <Text style={styles.bioPara}>Artist</Text>
        <View style={styles.followInfo}>
          <Text style={styles.followText}><Text style={styles.followCount}>174</Text> Photos  </Text>
          <Text style={styles.followText}><Text style={styles.followCount}>174</Text> followers  </Text>
          <Text style={styles.followText}><Text style={styles.followCount}>174</Text> Following  </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => alert('Explore Pressed!')}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#00AFAF' }}
            indicatorStyle={{ backgroundColor: 'white' }}
          />
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  View: {
    flex: 1
  },
  profileImg: {
    height: 200,
    width: '100%',
    borderRadius: 20
  },
  bioHeading: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold'
  },
  bioPara: {
    fontSize: 20,
    color: 'grey'
  },
  followInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10
  },
  posts: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  sales: {
    flexDirection: 'row',
    gap: 20,
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    padding: 20,
    margin: 20,
  },
  salesImg: {
    borderRadius: 10,
    height: 150,
    width: 150
  },
  salesHeading: {
    fontSize: 28,
    width: 170,
  },
  salesDesc: {
    fontSize: 20,
    marginTop: 10
  },
  followText: {
    width: 100,
    fontSize: 20,
    color: 'grey'
  },
  followCount:
  {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black'
  },

  postImg: {
    height: 130,
    width: 112,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10
  },
  button: {
    backgroundColor: '#00AFAF',
    height: 50,
    border: 1,
    width: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    align: 'center',
  },
  profileButton: {
    backgroundColor: '#00AFAF',
    height: 50,
    border: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 20,
    width: 400
  },
})
export default Profile;