import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps {
  name: string;
  handle: string;
  content: string;
  avatarColor: string;
}

export default function PostCard({
  name,
  handle,
  content,
  avatarColor,
}: PostCardProps) {
  const navigation = useNavigation();


  return (
    <View className="flex-row px-4 py-3 border-b border-zinc-700">
      <View className={`w-10 h-10 rounded-full ${avatarColor} mr-3`} />

      <View className="flex-1">
        <View className="flex-row items-center flex-wrap">
          <Text className="font-bold text-white mr-1">{name}</Text>
          <Text className="text-gray-500">{handle}</Text>
          <Text className="text-gray-600 text-xs"> · 12mins</Text>
        </View>

        <View className="flex-row items-center space-x-2 py-1">
            <View className="bg-gray-700 rounded-full px-2 py-0.5">
              <Text className="text-gray-200 text-xs font-semibold">
                ForHire
              </Text>
            </View>
            <Text className="text-gray-400 text-sm">📍 Kasoa, Ghana</Text>
            <View className="bg-white/10 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-semibold">
                💰 $50
              </Text>
            </View>
            <View className="bg-white/10 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-semibold">
                ⏳ 2 weeks
              </Text>
            </View>
        </View>

        <Text className="text-white mt-1">{content}</Text>


        <View className="flex-row justify-between mt-3 pr-8">
          <TouchableOpacity><Text className="text-gray-400">💬</Text></TouchableOpacity>
          <TouchableOpacity><Text className="text-gray-400">🔁</Text></TouchableOpacity>
          <TouchableOpacity
          //onPress={() => navigation.navigate()} // replace with your actual screen name
          ><Text className="text-gray-400">➡️</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}