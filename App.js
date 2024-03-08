// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// firebase
import { initializeApp } from 'firebase/app';
import {
  disableNetwork,
  enableNetwork,
  getFirestore,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

  const firebaseConfig = {
    apiKey: 'AIzaSyC-u-xrtBOxeXhsMuuNFJDoYX9JUHy7rcE',

    authDomain: 'chat-app-df21f.firebaseapp.com',

    projectId: 'chat-app-df21f',

    storageBucket: 'chat-app-df21f.appspot.com',

    messagingSenderId: '866997746753',

    appId: '1:866997746753:web:4fc2f892ffdee8ab4e9ac0',
  };

  //connection status
  const connectionStatus = useNetInfo();
  //if user is not connected to the internet, disable trying to connect to the database
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          options={({ route }) => ({ title: route.params.name })}
        >
          {(props) => (
            <Chat
              db={db}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}{' '}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
