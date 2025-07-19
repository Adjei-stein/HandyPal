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
            name="Paul Steiner"
            handle="@paulsteiner"
            content="Need a gardener to help with my backyard. DM me if interested!"
            avatarColor="bg-blue-500"
            />
            <PostCard
            name="Sundar Pichai"
            handle="@sundarpichai"
            content="Skilled chef here. Looking for part-time gigs in the city. Kindly reach out!"
            avatarColor="bg-green-500"
            />
            <PostCard
            name="Ada Lovelace"
            handle="@ada"
            content="Today, I showcase my some of my best interior design work. Always open to more opportunities!"
            avatarColor="bg-purple-500"
            />
        </ScrollView>
    </View>
  );
}