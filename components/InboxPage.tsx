import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

interface InboxItem {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface InboxPageProps {
  onSelectConversation?: (conversation: any) => void;
}

const InboxPage: React.FC<InboxPageProps> = ({ onSelectConversation }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Sample inbox data
  const inboxItems = [
    {
      id: 1,
      name: 'Alex Johnson',
      lastMessage: 'Hey, are you available for a plumbing job this weekend?',
      time: '10:30 AM',
      unread: true
    },
    {
      id: 2,
      name: 'Sarah Miller',
      lastMessage: 'Thanks for fixing my sink! The work was excellent.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 3,
      name: 'Mike Chen',
      lastMessage: 'I have an electrical issue in my kitchen, can you help?',
      time: '2 days ago',
      unread: false
    },
  ];

  const truncateMessage = (message: string, length = 30) => {
    return message.length > length 
      ? message.substring(0, length) + '...' 
      : message;
  };

  return (
    <View className="w-full h-full bg-zinc-900 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-bold">Messages</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-md"
          onPress={() => console.log('Create group')}
        >
          <Text className="text-white">Create Group</Text>
        </TouchableOpacity>
      </View>

      {inboxItems.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          className={`p-3 mb-2 rounded-md ${item.unread ? 'bg-zinc-800' : 'bg-zinc-900'}`}
          onPress={() => {
            const conversation = inboxItems.find(i => i.id === item.id);
            if (onSelectConversation && conversation) {
              onSelectConversation(conversation);
            }
          }}
        >
          <View className="flex-row justify-between">
            <Text className={`font-bold ${item.unread ? 'text-white' : 'text-gray-400'}`}>{item.name}</Text>
            <Text className="text-gray-500 text-xs">{item.time}</Text>
          </View>
          <Text className={`mt-1 ${item.unread ? 'text-gray-300' : 'text-gray-500'}`}>
            {truncateMessage(item.lastMessage)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default InboxPage;