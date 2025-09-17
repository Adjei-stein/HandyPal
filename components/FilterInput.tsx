import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FilterTag from './FilterTag';

const FilterInput = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [numberCandidate, setNumberCandidate] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
    // Check if input is numeric only
    if (/^\d+$/.test(text)) {
      setShowDropdown(true);
      setNumberCandidate(text);
    } else {
      setShowDropdown(false);
      setNumberCandidate(null);
    }

    if (text.endsWith(', ')) {
      const newTag = text.slice(0, -2).trim();
      if (newTag) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    } else {
      setInputValue(text);
    }
  };

  const handleDropdownSelect = (unit: string) => {
    if (numberCandidate) {
      let newTag = `${numberCandidate} ${unit}`;
      if (unit == 'GH₵') {
        newTag = `${unit} ${numberCandidate}`;
      }
      setTags([...tags, newTag]);
      setInputValue('');
      setNumberCandidate(null);
      setShowDropdown(false);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <FilterTag key={index} text={tag} onRemove={() => removeTag(index)} />
      ))}
      <TextInput
        className="focus:outline-none"
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        placeholder="Add filters (e.g., 200 km, 50 GHC, Accra)"
        placeholderTextColor="#a1a1aa"
      />
      {showDropdown && numberCandidate && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleDropdownSelect('km')}
          >
            <Text style={styles.dropdownText}>{numberCandidate} km</Text>
          </TouchableOpacity>
          <View className="border-t border-gray-500 w-full" />
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleDropdownSelect('GH₵')}
          >
            <Text style={styles.dropdownText}>GH₵ {numberCandidate}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 3,
    backgroundColor: '#27272a',
    borderRadius: 8,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 40,
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },dropdown: {
  position: 'absolute',
  top: 50,
  left: 10,
  backgroundColor: '#3f3f46',
  borderRadius: 6,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 5,
},
  dropdownItem: {
    padding: 10
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FilterInput;