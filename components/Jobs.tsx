import { BadgeCent, Bookmark, Calendar1, Handshake, Lock, MapPin } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateJob from './CreateJob';

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
        <TouchableOpacity className="absolute top-4 right-4 z-10">
            <Bookmark size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-row">
            <TouchableOpacity onPress={() => onImagePress(job.images)} className="w-64 h-64">
            <Image
                source={job.images[0]}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMode="cover"
            />
            </TouchableOpacity>
            <View className="flex-1 pl-4">
            <View className='flex-row items-center py-1'>
                <Text className="text-white text-xl font-bold">{job.title}</Text>
            </View>
            
            <View className="flex-row items-center py-1">
                <MapPin size={15} className='text-white' />
                <Text className="text-gray-400 text-xs pl-1">{job.location}</Text>
            </View>
            <View className="flex-row items-center py-1">
                <Calendar1 size={15} className='text-white' />
                <Text className="text-gray-400 text-xs pl-1">Today, 9th Sept, 12:00pm</Text>
            </View>
            <View className="flex-row items-center py-1">
                <BadgeCent size={15} className='text-white' />
                <Text className="text-gray-400 text-xs pl-1">GHC {job.amount}.00</Text>
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
            <Text className="text-gray-300 my-2">{job.description}</Text>
            <View className="border-t border-gray-700 my-2" />
            <View className="flex-row justify-end">
                <TouchableOpacity className="bg-blue-500 rounded-full py-2 px-4">
                <Text className="text-white font-bold text-sm">View Job</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    </View>
);

const SCROLLBAR_WIDTH = 4;
const MIN_THUMB_HEIGHT = 20;

const Jobs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageSourcePropType[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  const thumbHeight =
    listHeight > 0 && contentHeight > listHeight
      ? Math.max((listHeight / contentHeight) * listHeight, MIN_THUMB_HEIGHT)
      : 0;

  const scrollThumbY =
    listHeight > 0 && contentHeight > listHeight
      ? scrollY.interpolate({
          inputRange: [0, contentHeight - listHeight],
          outputRange: [0, listHeight - thumbHeight],
          extrapolate: 'clamp',
        })
      : 0;

  const handleImagePress = (images: ImageSourcePropType[]) => {
    setSelectedImages(images);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18181b' }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={jobs}
          renderItem={({ item }) => <JobCard job={item} onImagePress={handleImagePress} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingRight: 20 }} // leave space for scrollbar
          showsVerticalScrollIndicator={false}
          onLayout={(e) => {
            setListHeight(e.nativeEvent.layout.height);
          }}
          onContentSizeChange={(w, h) => {
            setContentHeight(h);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />

        {/* Custom Scrollbar */}
        {thumbHeight > 0 && (
          <View
            style={{
              position: 'absolute',
              right: 6,
              top: 0,
              bottom: 0,
              width: SCROLLBAR_WIDTH,
              backgroundColor: '#3f3f46', // track
              borderRadius: SCROLLBAR_WIDTH / 2,
            }}
          >
            <Animated.View
              style={{
                width: SCROLLBAR_WIDTH,
                height: thumbHeight,
                borderRadius: SCROLLBAR_WIDTH / 2,
                backgroundColor: 'white',
                transform: [{ translateY: scrollThumbY }],
              }}
            />
          </View>
        )}
      </View>

      {/* Floating button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
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
        className='bg-zinc-500'
        onPress={() => setCreateModalVisible(true)}
      >
        <MaterialCommunityIcons name="briefcase-plus-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Image viewer modal */}
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

      {createModalVisible && <CreateJob setCreateModalVisible={setCreateModalVisible} />}
    </SafeAreaView>
  );
};

export default Jobs;