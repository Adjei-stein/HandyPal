import { BlurView } from 'expo-blur';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

type ImageViewerProps = {
  images: ImageSourcePropType[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
};

export default function ImageViewer({ images, initialIndex = 0, visible, onClose }: ImageViewerProps) {
  if (images.length === 0 || !visible) return null;
  // Mounting fresh on each open starts the viewer at the tapped image.
  return <ViewerContent images={images} initialIndex={initialIndex} onClose={onClose} />;
}

function ViewerContent({ images, initialIndex = 0, onClose }: Omit<ImageViewerProps, 'visible'>) {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(initialIndex);

  const go = (delta: number) => setIndex(prev => (prev + delta + images.length) % images.length);

  return (
    <Modal animationType="fade" transparent visible onRequestClose={onClose}>
      <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center">
          <Image
            source={images[index]}
            style={{ width, height: height * 0.6 }}
            resizeMode="contain"
          />

          {images.length > 1 && (
            <>
              <TouchableOpacity
                onPress={() => go(-1)}
                accessibilityLabel="Previous image"
                className="absolute left-2 p-3 rounded-full bg-black/40"
              >
                <ChevronLeft size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => go(1)}
                accessibilityLabel="Next image"
                className="absolute right-2 p-3 rounded-full bg-black/40"
              >
                <ChevronRight size={28} color="white" />
              </TouchableOpacity>
              <Text className="absolute bottom-16 text-white">
                {index + 1} / {images.length}
              </Text>
            </>
          )}

          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close image viewer"
            className="absolute top-14 right-4 p-3 rounded-full bg-black/40"
          >
            <X size={26} color="white" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}
