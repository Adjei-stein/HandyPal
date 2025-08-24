import { Heart, Share2, ShoppingCart } from 'lucide-react-native';
import React, { ReactNode, useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const products = [
  {
    id: '1',
    name: 'Vintage Leather Jacket',
    gender: 'Unisex',
    price: '$120.00',
    images: [
      require('../assets/images/pexels-stevedoessteve-27867019.jpg'),
      require('../assets/images/pexels-stevedoessteve-31300187.jpg'),
      require('../assets/images/pexels-stevedoessteve-31300139.jpg'),
      require('../assets/images/pexels-stevedoessteve-31300188.jpg'),
    ],
    description: 'A stylish vintage leather jacket, perfect for all seasons.',
    rating: 4.5,
    reviews: 32,
    type: 'Product',
    user: {
      name: 'Jane Doe',
      image: require('../assets/images/pexels-stevedoessteve-28010414.jpg'),
    },
  },
  {
    id: '2',
    name: 'Summer Floral Dress',
    gender: 'Female',
    price: '$75.50',
    images: [
      require('../assets/images/pexels-stevedoessteve-28105357.jpg'),
      require('../assets/images/pexels-stevedoessteve-31300139.jpg'),
    ],
    description: 'A light and breezy summer dress with a beautiful floral pattern.',
    rating: 4.8,
    reviews: 55,
    type: 'Product',
    user: {
      name: 'Sarah Smith',
      image: require('../assets/images/pexels-stevedoessteve-31300186.jpg'),
    },
  },
  {
    id: '3',
    name: 'Plumbing Services',
    gender: 'N/A',
    price: '$50/hr',
    images: [
      require('../assets/images/pexels-subhankar-sarkar-825689708-33576320.jpg'),
    ],
    description: 'Professional plumbing services for residential and commercial properties.',
    rating: 4.9,
    reviews: 102,
    type: 'Service',
    user: {
      name: 'John The Plumber',
      image: require('../assets/images/pexels-stevedoessteve-31300188.jpg'),
    },
  },
];

import { ImageSourcePropType } from 'react-native';

type Product = {
  type: ReactNode;
  user: any;
  id: string;
  name: string;
  gender: string;
  price: string;
  images: ImageSourcePropType[];
  description: string;
  rating: number;
  reviews: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const images = product.images.slice(0, 4);
  const numImages = images.length;

  return (
    <SafeAreaView className="flex-1 bg-zinc-800">
      <ScrollView className="flex-1">
        <View className="bg-zinc-900 rounded-lg mb-5 overflow-hidden shadow-lg">
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image source={product.user.image} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <Text className="ml-3 font-bold text-white">{product.user.name}</Text>
            </View>
            <Text className={`px-3 py-1 rounded-full text-white ${product.type === 'Service' ? 'bg-blue-500' : 'bg-green-500'}`}>
              {product.type}
            </Text>
          </View>
          
          <View className="w-full aspect-square">
            <View className="flex flex-row flex-wrap h-full">
              {numImages === 1 &&
                <TouchableOpacity className="w-full h-full" onPress={() => setSelectedImage(images[0])}>
                  <Image source={images[0]} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              }
              {numImages === 2 && images.map((image, index) => (
                <TouchableOpacity key={index} className="w-1/2 h-full" onPress={() => setSelectedImage(image)}>
                  <Image source={image} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              ))}
              {numImages === 3 && (
                <>
                  <TouchableOpacity className="w-1/2 h-1/2" onPress={() => setSelectedImage(images[0])}>
                    <Image source={images[0]} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-1/2 h-1/2" onPress={() => setSelectedImage(images[1])}>
                    <Image source={images[1]} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-full h-1/2" onPress={() => setSelectedImage(images[2])}>
                    <Image source={images[2]} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                </>
              )}
              {numImages >= 4 && images.slice(0, 4).map((image, index) => (
                <TouchableOpacity key={index} className="w-1/2 h-1/2" onPress={() => setSelectedImage(image)}>
                  <Image source={image} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="relative p-4 z-10 bg-zinc-900">
            <Text className="text-lg text-white font-bold mb-1">{product.name}</Text>
            <Text className="text-base font-bold text-white mb-2">{product.price}</Text>
            <Text className="text-sm text-slate-400 mb-2">{product.gender}</Text>
            <Text className="text-sm text-gray-500 mb-4">{product.description}</Text>
            <View className="flex-row justify-end">
              <TouchableOpacity className="ml-4">
                <Heart size={24} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity className="ml-4">
                <ShoppingCart size={24} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity className="ml-4">
                <Share2 size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {selectedImage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-80">
            <TouchableOpacity
              className="absolute top-10 right-5 z-10"
              onPress={() => setSelectedImage(null)}
            >
              <Text className="text-white text-3xl font-bold">X</Text>
            </TouchableOpacity>
            <Image source={selectedImage} className="w-full aspect-square" resizeMode="contain" />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const MarketPlace = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id}
        className="p-2 bg-zinc-800"
      />
    </View>
  );
};

export default MarketPlace;