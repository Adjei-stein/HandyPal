import React, { useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
      'https://via.placeholder.com/300/FF0000/FFFFFF?text=Car+Wash+1',
      'https://via.placeholder.com/300/00FF00/FFFFFF?text=Car+Wash+2',
      'https://via.placeholder.com/300/0000FF/FFFFFF?text=Car+Wash+3',
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
      'https://via.placeholder.com/300/FFFF00/000000?text=Dog+Walking+1',
      'https://via.placeholder.com/300/FF00FF/FFFFFF?text=Dog+Walking+2',
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
      'https://via.placeholder.com/300/00FFFF/000000?text=Cleaning+1',
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
  images: string[];
};

type JobCardProps = {
  job: Job;
  onImagePress: (images: string[]) => void;
};

const JobCard: React.FC<JobCardProps> = ({ job, onImagePress }) => (
  <View className="bg-zinc-800 rounded-lg p-4 mb-4">
    <View className="flex-row">
      <TouchableOpacity onPress={() => onImagePress(job.images)} className="w-1/3 h-32 mr-4">
        <Image source={{ uri: job.images[0] }} className="w-full h-full rounded-lg" resizeMode="cover" />
      </TouchableOpacity>
      <View className="flex-1">
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
        <Text className="text-green-400 text-xl font-bold">
          ${job.amount} {job.negotiable && <Text className="text-gray-400 text-sm">(Negotiable)</Text>}
        </Text>
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImagePress = (images: string[]) => {
    setSelectedImages(images);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-zinc-900 p-4">
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} onImagePress={handleImagePress} />}
        keyExtractor={item => item.id}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-black">
          <TouchableOpacity onPress={() => setModalVisible(false)} className="p-4">
            <Text className="text-white text-lg">Close</Text>
          </TouchableOpacity>
          <ScrollView horizontal pagingEnabled>
            {selectedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} className="w-screen h-full" resizeMode="contain" />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Jobs;