import { View, Text, ScrollView, TextInput, } from 'react-native';
import PostCard from './postCard';

export default function Posts() {
  return (
    <View className="flex-1 bg-zinc-900 w-full">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-700">
            <Text className="text-xl font-bold text-white">Posts</Text>
        </View>

        {/* List of Posts */}
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