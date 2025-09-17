import { X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FilterTagProps = {
  text: string;
  onRemove: () => void;
};

const FilterTag: React.FC<FilterTagProps> = ({ text, onRemove }) => {
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{text}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <X size={16} color="#a1a1aa" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f3f46',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginRight: 2,
    marginBottom: 2,
    zIndex: 1000,
  },
  tagText: {
    color: 'white',
    marginRight: 5,
  },
  removeButton: {
    marginLeft: 'auto',
  },
});

export default FilterTag;