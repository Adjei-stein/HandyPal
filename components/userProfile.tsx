import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface UserProfileProps {
  avatarColor: string;
  name: string;
  handle: string;
  bio: string;
  location: string;
  website?: string;
  followers: number;
  following: number;
  posts: number;
  joinDate: string;
  skills: string[];
  status: string;
  rate: string;
  availability: string;
}

export default function UserProfile({
  avatarColor,
  name,
  handle,
  bio,
  location,
  website,
  followers,
  following,
  posts,
  joinDate,
  skills,
  status,
  rate,
  availability,
}: UserProfileProps) {
  const navigation = useNavigation();

  return (
    <View className="px-4 py-3">
      {/* Profile Header */}
      <View className="flex-row items-start mb-4">
        <View className={`w-20 h-20 rounded-full ${avatarColor} mr-4`} />
        
          <View className="flex-1">
            <View>
              <Text className="font-bold text-white text-xl">{name}</Text>
              <Text className="text-gray-500 mb-2">@{handle}</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
                  <Text className="text-white font-bold">Follow</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className="border border-gray-500 px-4 py-2 rounded-full">
                  <Text className="text-white font-bold">Message</Text>
                </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text className="text-white mb-3">{bio}</Text>

      {/* Location & Website */}
      <View className="flex-row items-center space-x-4 mb-3">
        <View className="flex-row items-center">
          <Text className="text-gray-400">📍 {location}</Text>
        </View>
        {website && (
          <TouchableOpacity>
            <Text className="text-blue-400">{website}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row space-x-4 mb-4">
        <TouchableOpacity>
          <Text className="text-white font-bold">{followers} <Text className="text-gray-400 font-normal">Followers</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-white font-bold">{following} <Text className="text-gray-400 font-normal">Following</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-white font-bold">{posts} <Text className="text-gray-400 font-normal">Posts</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Join Date */}
      <Text className="text-gray-400 text-sm mb-4">Joined {joinDate}</Text>

      {/* Status & Pricing */}
      <View className="flex-row items-center space-x-2 mb-4">
        <View className="bg-gray-700 rounded-full px-2 py-0.5">
          <Text className="text-gray-200 text-xs font-semibold">{status}</Text>
        </View>
        <View className="bg-white/10 rounded-full px-2 py-0.5">
          <Text className="text-white text-xs font-semibold">💰 {rate}</Text>
        </View>
        <View className="bg-white/10 rounded-full px-2 py-0.5">
          <Text className="text-white text-xs font-semibold">⏳ {availability}</Text>
        </View>
      </View>

      {/* Skills */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {skills.map((skill, index) => (
          <View key={index} className="bg-blue-900/30 rounded-full px-3 py-1">
            <Text className="text-blue-400 text-sm">{skill}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View className="border-b border-zinc-700 my-2" />

      {/* Navigation */}
      <View className="flex-row justify-around pt-2">
        <TouchableOpacity>
          <Text className="text-white font-bold">Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-400">Opportunities</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-400">Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-400">Messages</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}