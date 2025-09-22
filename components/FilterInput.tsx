import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FilterTag from './FilterTag';

type FilterInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  inputValue: string;
  onInputValueChange: (text: string) => void;
};

const FilterInput: React.FC<FilterInputProps> = ({
  tags,
  onTagsChange,
  inputValue,
  onInputValueChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [numberCandidate, setNumberCandidate] = useState<string | null>(null);

  const handleInputChange = (text: string) => {
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
        onTagsChange([...tags, newTag]);
      }
      onInputValueChange('');
    } else {
      onInputValueChange(text);
    }
  };

  const handleDropdownSelect = (unit: string) => {
    if (numberCandidate) {
      let newTag = `${numberCandidate} ${unit}`;
      if (unit === 'GH₵') {
        newTag = `${unit} ${numberCandidate}`;
      }
      onTagsChange([...tags, newTag]);
      onInputValueChange('');
      setNumberCandidate(null);
      setShowDropdown(false);
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {/* Tags */}
      {tags.map((tag, index) => (
        <FilterTag key={index} text={tag} onRemove={() => removeTag(index)} />
      ))}

      {/* Input */}
      <TextInput
        className="focus:outline-none"
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        placeholder="Add filters... (e.g., 200 km, GH₵ 50, Accra)"
        placeholderTextColor="#a1a1aa"
      />

      {/* Dropdown inside same popup */}
      {showDropdown && numberCandidate && (
        <View
          style={[
            styles.dropdown,
            { minWidth: numberCandidate.length * 12 + 40 }, // auto width
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleDropdownSelect('km')}
          >
            <Text style={styles.dropdownText}>{numberCandidate} km</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
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
    position: 'relative', // 🔑 keeps dropdown inside FilterPopup
  },
  input: {
    flex: 1,
    height: 40,
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 45, // places dropdown under input
    left: 10,
    backgroundColor: '#3f3f46',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#52525b',
  },
});

export default FilterInput;
