import { View, Text, ScrollView, TextInput, } from 'react-native';
import PostCard from './postCard';

export default function Posts() {
  return (
    <View className="flex-1 bg-gray-900">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-xl font-bold text-white">X</Text>
            {/* You can add profile image and icon here */}
        </View>
        {/* Tweet Input */}
        <View className="flex-row items-start px-4 py-3 border-b border-gray-200 text-white">
            <View className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
            <TextInput
            placeholder="What is happening?!"
            multiline
            className="flex-1 text-base text-white"
            />
        </View>

        {/* Tweet Feed */}
        <ScrollView>
            <PostCard
            name="Elon Musk"
            handle="@elonmusk"
            content="Sending thoughts from Mars 🚀"
            avatarColor="bg-blue-500"
            />
            <PostCard
            name="Sundar Pichai"
            handle="@sundarpichai"
            content="Announcing a new AI breakthrough!"
            avatarColor="bg-green-500"
            />
            <PostCard
            name="Ada Lovelace"
            handle="@ada"
            content="Math is poetry in motion."
            avatarColor="bg-purple-500"
            />
        </ScrollView>
    </View>
  );
}