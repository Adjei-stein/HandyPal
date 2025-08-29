import React, { useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, ImageSourcePropType, View } from 'react-native';

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
  const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>([]);

  const handleImagePress = (images: ImageSourcePropType[]) => {
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
            {selectedImages.map((imgSrc, index) => (
              <Image key={index} source={imgSrc} className="w-screen h-full" resizeMode="contain" />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Jobs;