import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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
    const previousDate = previousMessage ? new Date(previousMessage.createdAt) : null;

    if (!previousDate || !currentDate || currentDate.toDateString() !== previousDate.toDateString()) {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {currentDate.toDateString()}
          </Text>
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    // Username
    navigation.setOptions({ title: name });

    // Messages
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://i.pravatar.cc/300',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
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
