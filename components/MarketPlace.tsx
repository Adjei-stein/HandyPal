import { Heart, Share2, ShoppingCart } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

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
  {
    id: '4',
    name: 'Handmade Wooden Chair',
    gender: 'Unisex',
    price: '$85.00',
    images: [
      require('../assets/images/pexels-stevedoessteve-27867019.jpg'),
    ],
    description: 'Beautiful handmade wooden chair, perfect for your living room.',
    rating: 4.7,
    reviews: 28,
    type: 'Product',
    user: {
      name: 'Mike Carpenter',
      image: require('../assets/images/pexels-stevedoessteve-28010414.jpg'),
    },
  },
  {
    id: '5',
    name: 'Electrical Repair',
    gender: 'N/A',
    price: '$65/hr',
    images: [
      require('../assets/images/pexels-subhankar-sarkar-825689708-33576320.jpg'),
    ],
    description: 'Professional electrical repair services for homes and offices.',
    rating: 4.9,
    reviews: 87,
    type: 'Service',
    user: {
      name: 'Alex Electrician',
      image: require('../assets/images/pexels-stevedoessteve-31300186.jpg'),
    },
  },
];

type Product = {
  id: string;
  name: string;
  gender: string;
  price: string;
  images: any[];
  description: string;
  rating: number;
  reviews: number;
  type: string;
  user: {
    name: string;
    image: any;
  };
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const images = product.images.slice(0, 4);
  const numImages = images.length;

  const renderImageGrid = () => {
    switch (numImages) {
      case 1:
        return (
          <TouchableOpacity 
            className="w-full h-full" 
            onPress={() => setSelectedImage(images[0])}
            activeOpacity={0.8}
          >
            <Image source={images[0]} className="w-full h-full" resizeMode="cover" />
          </TouchableOpacity>
        );
      
      case 2:
        return images.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            className="w-1/2 h-full" 
            onPress={() => setSelectedImage(image)}
            activeOpacity={0.8}
          >
            <Image source={image} className="w-full h-full" resizeMode="cover" />
          </TouchableOpacity>
        ));
      
      case 3:
        return (
          <>
            <TouchableOpacity 
              className="w-1/2 h-1/2" 
              onPress={() => setSelectedImage(images[0])}
              activeOpacity={0.8}
            >
              <Image source={images[0]} className="w-full h-full" resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-1/2 h-1/2" 
              onPress={() => setSelectedImage(images[1])}
              activeOpacity={0.8}
            >
              <Image source={images[1]} className="w-full h-full" resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-full h-1/2" 
              onPress={() => setSelectedImage(images[2])}
              activeOpacity={0.8}
            >
              <Image source={images[2]} className="w-full h-full" resizeMode="cover" />
            </TouchableOpacity>
          </>
        );
      
      default: // 4 or more images
        return images.slice(0, 4).map((image, index) => (
          <TouchableOpacity 
            key={index} 
            className="w-1/2 h-1/2" 
            onPress={() => setSelectedImage(image)}
            activeOpacity={0.8}
          >
            <Image source={image} className="w-full h-full" resizeMode="cover" />
            {index === 3 && numImages > 4 && (
              <View className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <Text className="text-white font-bold text-lg">+{numImages - 4}</Text>
              </View>
            )}
          </TouchableOpacity>
        ));
    }
  };

  return (
    <View className="bg-zinc-900 rounded-lg mb-4 overflow-hidden shadow-lg mx-2">
      {/* User Info Header */}
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image 
            source={product.user.image} 
            style={{ width: 40, height: 40, borderRadius: 20 }} 
          />
          <Text className="ml-3 font-bold text-white text-base">{product.user.name}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          product.type === 'Service' ? 'bg-blue-500' : 'bg-green-500'
        }`}>
          <Text className="text-white text-xs font-semibold">{product.type}</Text>
        </View>
      </View>
      
      {/* Image Grid */}
      <View className="w-full aspect-square">
        <View className="flex flex-row flex-wrap h-full">
          {renderImageGrid()}
        </View>
      </View>

      {/* Product Details */}
      <View className="p-4 bg-zinc-900">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg text-white font-bold flex-1 mr-2">{product.name}</Text>
          <Text className="text-lg font-bold text-white">{product.price}</Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Text className="text-sm text-slate-400 mr-3">{product.gender}</Text>
          <View className="flex-row items-center">
            <Text className="text-yellow-400 text-sm mr-1">★</Text>
            <Text className="text-slate-400 text-sm mr-2">{product.rating}</Text>
            <Text className="text-slate-500 text-sm">({product.reviews} reviews)</Text>
          </View>
        </View>
        
        <Text className="text-sm text-gray-400 mb-4 leading-5">{product.description}</Text>
        
        {/* Action Buttons */}
        <View className="flex-row justify-end space-x-4">
          <TouchableOpacity className="p-2">
            <Heart size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ShoppingCart size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Share2 size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Modal */}
      {selectedImage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-90">
            <TouchableOpacity
              className="absolute top-14 right-5 z-10 p-4"
              onPress={() => setSelectedImage(null)}
              activeOpacity={0.7}
            >
              <Text className="text-white text-2xl font-bold">✕</Text>
            </TouchableOpacity>
            <Image 
              source={selectedImage} 
              className="w-full aspect-square" 
              resizeMode="contain" 
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

interface MarketPlaceProps {
  scrollRef?: any;
}

const MarketPlace: React.FC<MarketPlaceProps> = ({ scrollRef }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id}
        className="bg-zinc-800"
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        // Remove simultaneousHandlers to avoid gesture conflicts
      />
    </View>
  );
};

export default MarketPlace;