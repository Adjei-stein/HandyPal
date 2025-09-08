import { Handshake, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const jobs = [
  {
    id: '1',
    title: 'Car Wash',
    location: 'San Francisco, CA',
    jobType: 'One-time',
    amount: 50,
    negotiable: true,
    duration: '1 hour',
    timeOfDay: 'Afternoon',
    description: 'Looking for someone to wash my car. All supplies will be provided.',
    images: [
      require('../assets/images/photo_2025-08-29_11-40-04.jpg'),
      require('../assets/images/photo_2025-08-29_11-38-04.jpg'),
    ],
  },
  {
    id: '2',
    title: 'Dog Walker',
    location: 'New York, NY',
    jobType: 'Recurring',
    amount: 25,
    negotiable: false,
    duration: '30 minutes',
    timeOfDay: 'Morning',
    description: 'Need a reliable person to walk my dog every weekday morning.',
    images: [
      require('../assets/images/photo_2025-08-29_11-38-09.jpg'),
    ],
  },
  {
    id: '3',
    title: 'House Cleaning',
    location: 'Austin, TX',
    jobType: 'One-time',
    amount: 150,
    negotiable: true,
    duration: '4 hours',
    timeOfDay: 'Morning',
    description: 'Deep cleaning for a 2-bedroom apartment before moving out.',
    images: [
      require('../assets/images/photo_2025-08-29_11-38-12.jpg'),
      require('../assets/images/photo_2025-08-29_11-38-15.jpg'),
    ],
  },
];

type Job = {
  id: string;
  title: string;
  location: string;
  jobType: string;
  amount: number;
  negotiable: boolean;
  duration: string;
  timeOfDay: string;
  description: string;
  images: ImageSourcePropType[];
};

type JobCardProps = {
  job: Job;
  onImagePress: (images: ImageSourcePropType[]) => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, onImagePress }) => (
  <View className="bg-zinc-800 rounded-lg p-4 mb-4">
    <View className="flex-row">
      <TouchableOpacity onPress={() => onImagePress(job.images)} className="w-64 h-64">
        <Image
            source={job.images[0]}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}
            resizeMode="cover"
        />
      </TouchableOpacity>
      <View className="flex-1 pl-4">
        <Text className="text-white text-lg font-bold">{job.title}</Text>
        <Text className="text-gray-400">{job.location}</Text>
        <View className="flex-row flex-wrap my-2">
          <View className="bg-zinc-700 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-white text-sm">{job.jobType}</Text>
          </View>
          <View className="bg-zinc-700 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-white text-sm">{job.duration}</Text>
          </View>
          <View className="bg-zinc-700 rounded-full px-3 py-1 mb-2">
            <Text className="text-white text-sm">{job.timeOfDay}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Text className="text-green-400 text-xl font-bold">${job.amount}</Text>
          {job.negotiable ? (
            <View className="ml-2 bg-green-100 border border-green-300 rounded-full px-2 py-0.5 flex-row items-center">
              <Handshake size={12} color="#166534" />
              <Text className="text-green-700 text-xs font-semibold ml-1">Negotiable</Text>
            </View>
          ) : (
            <View className="ml-2 bg-red-100 border border-red-300 rounded-full px-2 py-0.5 flex-row items-center">
              <Lock size={12} color="#991b1b" />
              <Text className="text-red-700 text-xs font-semibold ml-1">Non-Negotiable</Text>
            </View>
          )}
        </View>
      </View>
    </View>
    <Text className="text-gray-300 my-2">{job.description}</Text>
    <TouchableOpacity className="bg-blue-600 rounded-lg py-3 items-center mt-2">
      <Text className="text-white font-bold">View Job</Text>
    </TouchableOpacity>
  </View>
);

const Jobs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleImagePress = (images: ImageSourcePropType[]) => {
    setSelectedImages(images);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#18181b' }}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} onImagePress={handleImagePress} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          backgroundColor: '#2563eb',
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => setCreateModalVisible(true)}
      >
        <MaterialCommunityIcons name="briefcase-plus-outline" size={30} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 16 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          <ScrollView horizontal pagingEnabled>
            {selectedImages.map((img, index) => (
              <Image
                key={index}
                source={img}
                style={{ width: Dimensions.get('window').width, height: '100%' }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {createModalVisible && (
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
      )}
    </View>
  );
};

export default Jobs;