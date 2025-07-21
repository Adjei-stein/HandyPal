import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
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
  const [showMenu, setShowMenu] = useState(false);

  const onMorePress = () => {
    setShowMenu(prev => !prev);
  };

  const handleVisitProfile = () => {
    setShowMenu(false);
    console.log(`Went to Banku's Profile`);
  };

  const handleFollow = () => {
    setShowMenu(false);
    // You'd handle follow logic here
    console.log(`Followed banku`);
  };


  return (
    <View style={styles.zIndexZero} className="flex-row px-4 py-3 border-b border-zinc-700 relative">
      <View className={`w-10 h-10 rounded-full ${avatarColor} mr-3`} />

      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          {/* Left side: name, handle, time */}
          <View className="flex-row items-center flex-wrap">
            <Text className="font-bold text-white mr-1">{name}</Text>
            <Text className="text-gray-500">{handle}</Text>
            <Text className="text-gray-600 text-xs"> · 12mmin</Text>
          </View>


          {/* Right side: more options */}
          <View className="relative">
            <TouchableOpacity onPress={onMorePress}>
              <Text className="text-gray-400 text-xl">⋯</Text>
            </TouchableOpacity>

            {showMenu && (
              <View style={styles.zIndexHundred} className="absolute right-0 top-6 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg overflow-hidden">
                <TouchableOpacity
                  onPress={handleVisitProfile}
                  className="px-4 py-2"
                >
                  <Text className="text-white text-sm">Visit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFollow}
                  className="px-4 py-2"
                >
                  <Text className="text-white text-sm">Follow</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  widthTwentyFive: {
    width: '25%',
  },
  zIndexHundred: {
    zIndex: 999,
  },
  zIndexZero: {
    zIndex: 0,
  }
});