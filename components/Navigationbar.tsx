import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import React from 'react';

export default function NavigationBar() {
  const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-zinc-900 w-full">
      <TouchableOpacity>
        <FontAwesomeIcon name="paper-plane" size={16} color="white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesomeIcon name="suitcase" size={16} color="white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="settings" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
}