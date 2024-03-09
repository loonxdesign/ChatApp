import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

LogBox.ignoreLogs(['Cannot connect to Metro', '@firebase/firestore']);

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    // setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#9b53ff',
          },
          left: {
            backgroundColor: '#2a2b30',
          },
        }}
        textStyle={{
          right: {
            color: '#ffffff', // Text color for user messages
          },
          left: {
            color: '#ffffff', // Text color for other users' messages
          },
        }}
        timeTextStyle={{
          right: { color: '#ffffff' }, // Text color for timestamp of user messages
          left: { color: '#ffffff' }, // Text color for timestamp of other users' messages
        }}
      />
    );
  };

  const renderSystemMessage = (props) => {
    if (props.currentMessage.system) {
      // If the message is a system message, apply custom styling
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemText}>{props.currentMessage.text}</Text>
        </View>
      );
    }
    return null;
  };

  const renderDay = (props) => {
    const { currentMessage, previousMessage } = props;
    const currentDate = new Date(currentMessage.createdAt);
    const previousDate = previousMessage
      ? new Date(previousMessage.createdAt)
      : null;

    if (
      !previousDate ||
      !currentDate ||
      currentDate.toDateString() !== previousDate.toDateString()
    ) {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
        </View>
      );
    }
    return null;
  };

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar style={styles.toolbar} {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || '[]';
    setMessages(JSON.parse(cachedMessages));
  };

  let unsubMessages;

  useEffect(() => {
    // Username
    navigation.setOptions({ title: name });

    // Messages
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (documentSnapshot) => {
        let newMessages = [];
        documentSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });

        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: route.params.id,
          name,
        }}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  systemMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  systemText: {
    fontSize: 14,
    color: '#9b53ff',
    fontWeight: 'bold',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#9b53ff',
    fontWeight: 'bold',
  },
 
});

export default Chat;
