import { BlurView } from 'expo-blur';
import { BadgeCent, Bookmark, Calendar1, ChevronLeft, ChevronRight, Handshake, ListFilter, Lock, MapPin, X } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateJob from './CreateJob';
import FilterPopup from './FilterPopup';

const jobs = [
  {
    id: '1',
    title: 'Car Wash',
    location: 'Kasoa, Central Region',
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
    location: 'East Legon, Greater Accra Region',
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
    location: 'Adenta, Greater Accra Region',
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
        <View className="flex-col md:flex-row">
            <TouchableOpacity onPress={() => onImagePress(job.images)} className="w-full md:w-64 h-64 mb-4 md:mb-0">
            <Image
                source={job.images[0]}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMode="cover"
            />
            </TouchableOpacity>
            <View className="flex-1 md:pl-4">
            <View className='flex-row items-center justify-between py-1'>
                <Text className="text-white text-xl font-bold">{job.title}</Text>
                <TouchableOpacity>
                    <Bookmark size={24} color="white" />
                </TouchableOpacity>
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
                <Text className="text-gray-400 text-xs pl-1">GH₵ {job.amount}.00</Text>
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [filters, setFilters] = useState<string[]>([]);
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const [activeFilter, setActiveFilter] = useState('All');
  const filtersList = ['All', 'Physical', 'Digital', 'Min GH₵10', 'Max GH₵100', 'Today'];

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
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const handleApplyFilters = (appliedFilters: string[]) => {
    setFilters(appliedFilters);
  };

  const filteredJobs = useMemo(() => {
    if (filters.length === 0) {
      return jobs;
    }
    return jobs.filter(job => {
      const jobTags = [job.title, job.location, job.jobType, job.timeOfDay].flatMap(s => s.toLowerCase().split(/\s+/));
      return filters.every(filter => jobTags.includes(filter.toLowerCase()));
    });
  }, [jobs, filters]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18181b' }}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>Jobs</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#27272a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}>
            <ListFilter size={18} color="white" />
            <Text style={{ color: 'white', marginLeft: 8 }}>Filters</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16 }}>
          <FlatList
            data={filtersList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: activeFilter === item ? '#3b82f6' : '#27272a',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredJobs}
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

      {isFilterPopupVisible && <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />}

      {/* Floating filter button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 102,
          right: 42,
          width: 44,
          height: 44,
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
        onPress={() => setIsFilterPopupVisible(true)}
      >
        <ListFilter size={30} color="white" />
      </TouchableOpacity>


      {/* Floating New Job button */}
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

      <FilterPopup
        visible={isFilterPopupVisible}
        onClose={() => setIsFilterPopupVisible(false)}
        onApply={handleApplyFilters}
      />

      {/* Image viewer modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={80} tint="dark" style={styles.absolute}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            
            {/* Main content container */}
            <View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height * 0.6, // 60% of screen height
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {selectedImages.length > 0 && (
                    <Image
                        source={selectedImages[currentImageIndex]}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Close Button */}
            <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ position: 'absolute', top: '20%', right: '5%' }}
            >
                <X size={30} color="white" />
            </TouchableOpacity>

            {/* Navigation Buttons */}
            {selectedImages.length > 1 && (
                <>
                    {/* Previous Button */}
                    <TouchableOpacity
                        onPress={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedImages.length - 1))}
                        style={{ position: 'absolute', left: 15, top: '50%', transform: [{ translateY: -15 }] }}
                    >
                        <ChevronLeft size={30} color="white" />
                    </TouchableOpacity>
                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={() => setCurrentImageIndex((prev) => (prev < selectedImages.length - 1 ? prev + 1 : 0))}
                        style={{ position: 'absolute', right: 15, top: '50%', transform: [{ translateY: -15 }] }}
                    >
                        <ChevronRight size={30} color="white" />
                    </TouchableOpacity>
                </>
            )}
        </View>
        </BlurView>
      </Modal>

      {createModalVisible && <CreateJob setCreateModalVisible={setCreateModalVisible} />}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: '#18181b',
  },
  filterButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#3f3f46',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  dropdownButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropdownButtonText: {
    color: 'white',
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#3f3f46',
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#52525b',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Jobs;