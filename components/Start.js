import { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState('');
  const image = require('../img/Background_Image.jpg');
  const icon = require('../img/icon.png');

  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
    .then( result => {
      navigation.navigate('Chat', {name: name, backgroundColor: selectedColor, id: result.user.uid});
      Alert.alert('Signed in succeccfully');
    }).catch((error) => {
      Alert.alert('Unable to signin, try later');
    })
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>Chat App</Text>

        <View style={styles.containerWhite}>
          <View style={styles.inputContainer}>
            <Image source={icon} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9b53ff"
            />
          </View>

          <Text style={styles.text1}>Choose Background Color:</Text>

          <View style={styles.colorButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: '#090C08',
                  opacity: selectedColor === '#090C08' ? 1 : 0.7,
                },
              ]}
              onPress={() => handleColorSelection('#090C08')}
            />
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: '#1d063d',
                  opacity: selectedColor === '#1d063d' ? 1 : 0.7,
                },
              ]}
              onPress={() => handleColorSelection('#1d063d')}
            />
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: '#c399fe',
                  opacity: selectedColor === '#c399fe' ? 1 : 0.7,
                },
              ]}
              onPress={() => handleColorSelection('#c399fe')}
            />
            <TouchableOpacity
              style={[
                styles.colorButton,
                {
                  backgroundColor: '#ddc5fd',
                  opacity: selectedColor === '#ddc5fd' ? 1 : 0.7,
                },
              ]}
              onPress={() => handleColorSelection('#ddc5fd')}
            />
          </View>

          <Button
            title="Start Chatting"
            onPress={signInUser}
            style={styles.buttonStartChatting}
            color="#9b53ff"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#9b53ff',
  },
  containerWhite: {
    width: '88%',
    height: '44%',
    justifyContent: 'center',
    backgroundColor: 'white',
    bottom: 0,
    alignItems: 'center',
    marginBottom: '60%',
  },
  text: {
    padding: '25%',
    flex: 6,
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9b53ff',
    padding: 18,
    marginLeft: 20,
    marginRight: 20,
    marginTop: -10,
    marginBottom: 10,
    opacity: '50%',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text1: {
    fontSize: 16,
    color: '#9b53ff',
    fontWeight: '300',
    opacity: 1,
    marginTop: 10,
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  buttonStartChatting: {
    backgroundColor: '#9b53ff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default Start;
