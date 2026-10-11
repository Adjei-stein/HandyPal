import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { formatPrice } from '@/lib/format';
import { Listing } from '@/types/listing';
import { useRouter } from 'expo-router';
import { BadgeCheck, Heart, ImageOff, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { KindBadge } from './shared';

/** Compact card for the two-column marketplace grid. */
export default function MarketGridCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useListings();
  const saved = bookmarks.has(listing.id);
  const cover = listing.images[0];

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}
      className="bg-zinc-800 rounded-xl overflow-hidden m-1.5 active:opacity-90"
    >
      <View style={{ aspectRatio: 1 }} className="bg-zinc-700 items-center justify-center">
        {cover ? (
          <Image source={cover} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <ImageOff size={28} color={palette.textSubtle} />
        )}
        <TouchableOpacity
          onPress={() => toggleBookmark(listing.id)}
          accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
          className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5"
        >
          <Heart size={16} color="white" fill={saved ? palette.danger : 'transparent'} />
        </TouchableOpacity>
        <View className="absolute top-2 left-2">
          <KindBadge kind={listing.kind} />
        </View>
      </View>

      <View className="p-2.5">
        <Text className="text-white font-extrabold text-base" numberOfLines={1}>
          {formatPrice(listing.price)}
        </Text>
        <Text className="text-zinc-200 text-sm mt-0.5" numberOfLines={2}>
          {listing.title}
        </Text>
        <View className="flex-row items-center mt-1.5">
          <MapPin size={12} color={palette.textMuted} />
          <Text className="text-zinc-400 text-xs ml-1 flex-1" numberOfLines={1}>
            {listing.location.area}
          </Text>
          {listing.postedBy.verified && <BadgeCheck size={13} color={palette.verified} />}
        </View>
      </View>
    </Pressable>
  );
}
