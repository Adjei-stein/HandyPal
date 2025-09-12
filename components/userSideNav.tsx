import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { House, UserRound } from 'lucide-react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

interface UserProfileProps {
  avatarColor: string;
  name: string;
  handle: string;
}

export default function UserSideNav({
  avatarColor,
  name,
  handle
}: UserProfileProps) {
  const navigation = useNavigation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

return (
    <View className="px-4 py-3">
      {/* Profile Header */}
        <View className="flex-row items-center mb-4">
            <View className={`w-20 h-20 rounded-full ${avatarColor} mr-4`} />
            
            <View className="flex items-center justify-center">
            <View>
                <Text className="font-bold text-white text-2xl">{name}</Text>
                <Text className="text-gray-500 mb-2">@{handle}</Text>
            </View>
            </View>
        </View>
        <View className="border-b border-zinc-700 my-2" />
        <TouchableOpacity className="flex-row items-center py-4 px-4">
            <UserRound size={24} color="white" />
            <Text className="text-white text-lg ml-4">Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4 px-4 rounded-md bg-zinc-800">
            <House size={24} color="white" />
            <Text className="text-white text-lg ml-4">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4 px-4">
            <Ionicons name="cart-outline" size={24} color="white" />
            <Text className="text-white text-lg ml-4">Marketplace</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center py-4 px-4">
            <Ionicons name="bookmarks-outline" size={24} color="white" />
            <Text className="text-white text-lg ml-4">Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4 px-4">
            <Ionicons name="briefcase-outline" size={24} color="white" />
            <Text className="text-white text-lg ml-4">Opportunities</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-4 px-4">
            <Ionicons name="mail-outline" size={24} color="white" />
            <Text className="text-white text-lg ml-4">Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSettingsOpen(!isSettingsOpen)} className="flex-row items-center justify-between py-4 px-4">
            <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={24} color="white" />
                <Text className="text-white text-lg ml-4">Settings</Text>
            </View>
            <Icon name={isSettingsOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="white" />
        </TouchableOpacity>

        {isSettingsOpen && (
            <View className="pl-8">
                <TouchableOpacity className="flex-row items-center py-2">
                    <MaterialCommunityIcons name="account-cog-outline" size={20} color="white" />
                    <Text className="text-white text-md ml-4">Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center py-2">
                    <Icon name="brightness-6" size={20} color="white" />
                    <Text className="text-white text-md ml-4">Theme</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);
}