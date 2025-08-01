import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ChatPageProps {
  conversation: {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unread: boolean;
  };
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversation, onBack }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Sample chat data
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: conversation?.lastMessage || '',
      sender: 'other',
      time: conversation?.time || ''
    }
  ]);

  return (
    <View className="w-full h-full bg-zinc-900 flex flex-col">
      {/* Chat header */}
      <View className="p-4 border-b border-zinc-700 flex-row items-center">
        <TouchableOpacity 
          className="mr-2"
          onPress={onBack}
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-white text-lg font-bold">{conversation?.name || 'Chat'}</Text>
          <Text className="text-gray-400 text-sm">Plumbing specialist</Text>
        </View>
      </View>

      {/* Messages area */}
      <View className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <View 
            key={message.id} 
            className={`mb-3 ${message.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <View 
              className={`p-3 rounded-lg max-w-[80%] ${message.sender === 'me' ? 'bg-blue-500' : 'bg-zinc-800'}`}
            >
              <Text className={`${message.sender === 'me' ? 'text-white' : 'text-gray-300'}`}>
                {message.text}
              </Text>
              <Text className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                {message.time}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Message input */}
      <View className="p-3 border-t border-zinc-700 flex-row items-center">
        <TextInput
          className="flex-1 bg-zinc-800 text-white p-3 rounded-lg mr-2"
          placeholder="Type a message"
          placeholderTextColor="#71717a"
        />
        <TouchableOpacity className="p-2">
          <Icon name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Icon name="microphone" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Icon name="emoji-happy" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatPage;