import ListingDetails from '@/components/listings/ListingDetails';
import { useListings } from '@/context/ListingsContext';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getListing } = useListings();
  const listing = getListing(id);

  if (!listing) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center px-8">
        <Text className="text-white text-lg font-bold">This listing is no longer available</Text>
        <Link href="/" className="text-blue-400 mt-3">
          Back to home
        </Link>
      </View>
    );
  }

  return <ListingDetails listing={listing} />;
}
