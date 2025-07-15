import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
  return (
    <View className="flex-row px-4 py-3 border-b border-gray-200">
      <View className={`w-10 h-10 rounded-full ${avatarColor} mr-3`} />

      <View className="flex-1">
        <View className="flex-row items-center flex-wrap">
          <Text className="font-bold text-white mr-1">{name}</Text>
          <Text className="text-gray-500">{handle}</Text>
        </View>

        <Text className="text-white mt-1">{content}</Text>

        <View className="flex-row justify-between mt-3 pr-8">
          <TouchableOpacity><Text className="text-gray-400">💬</Text></TouchableOpacity>
          <TouchableOpacity><Text className="text-gray-400">🔁</Text></TouchableOpacity>
          <TouchableOpacity><Text className="text-gray-400">📤</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}