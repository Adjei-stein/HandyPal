import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateJobProps = {
  setCreateModalVisible: (visible: boolean) => void;
};

const CreateJob = ({ setCreateModalVisible }: CreateJobProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          height: '80%',
          backgroundColor: '#1f2937',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => setCreateModalVisible(false)} style={{ alignSelf: 'flex-start' }}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Create New Job
        </Text>
        <TextInput
          placeholder="Job Title"
          placeholderTextColor="#9ca3af"
          style={{
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        />
        <TextInput
          placeholder="Location"
          placeholderTextColor="#9ca3af"
          style={{
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#9ca3af"
          multiline
          style={{
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            height: 100,
          }}
        />
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          style={{
            backgroundColor: '#374151',
            color: 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#2563eb',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
          onPress={() => {
            console.log('Job Posted');
            setCreateModalVisible(false);
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Post Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateJob;