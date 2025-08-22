import { Heart, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, FlatList, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';

const products = [
  {
    id: '1',
    name: 'Vintage Leather Jacket',
    gender: 'Unisex',
    price: '$120.00',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    description: 'A stylish vintage leather jacket, perfect for all seasons.',
    rating: 4.5,
    reviews: 32,
  },
  {
    id: '2',
    name: 'Summer Floral Dress',
    gender: 'Female',
    price: '$75.50',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    description: 'A light and breezy summer dress with a beautiful floral pattern.',
    rating: 4.8,
    reviews: 55,
  },
  {
    id: '3',
    name: 'Men\'s Classic Watch',
    gender: 'Male',
    price: '$250.00',
    images: [
      'https://via.placeholder.com/150',
    ],
    description: 'An elegant and timeless watch for the modern gentleman.',
    rating: 4.9,
    reviews: 102,
  },
];

type Product = {
  id: string;
  name: string;
  gender: string;
  price: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView className="flex-1">
        <View className="bg-zinc-900 rounded-lg mb-5 overflow-hidden shadow-lg">
            <View className="flex-row flex-wrap">
            {product.images.slice(0, 4).map((image, index) => (
                <Image key={index} source={{ uri: image }} className="w-1/2 h-40" />
            ))}
            </View>
            <View className="p-4">
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
            </View>
            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
);

const MarketPlace = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id}
        className="p-2 bg-gray-100"
      />
    </View>
  );
};

export default MarketPlace;