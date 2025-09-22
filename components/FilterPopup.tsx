import { BlurView } from 'expo-blur';
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import FilterInput from './FilterInput';

type FilterPopupProps = {
  onApply: (filters: string[]) => void;
  visible: boolean;
  onClose: () => void;
};

const FilterPopup: React.FC<FilterPopupProps> = ({ onApply, visible, onClose }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleApply = () => {
    onApply(tags);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        {Platform.OS !== 'web' ? (
          <BlurView intensity={80} tint="dark" className="absolute inset-0" />
        ) : (
          <View className="absolute inset-0 bg-black/50" />
        )}
        <View className="w-4/5 max-w-lg bg-zinc-800 rounded-xl p-5 items-center shadow-lg">
          <TouchableOpacity className="absolute top-2.5 right-2.5" onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white mb-4">Filter Content</Text>
          <View className="flex-row items-center w-full">
            <FilterInput
              tags={tags}
              onTagsChange={setTags}
              inputValue={inputValue}
              onInputValueChange={setInputValue}
            />
            <TouchableOpacity className='bg-zinc-500 ml-3 p-2 rounded-xl' onPress={handleApply}>
              <Search size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterPopup;