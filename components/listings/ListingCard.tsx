import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { formatDateTime, formatPlace, formatPrice, formatRelativeTime, WORK_MODE_LABEL } from '@/lib/format';
import { Listing } from '@/types/listing';
import { useRouter } from 'expo-router';
import { Bookmark, Calendar1, Handshake, ImageOff, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Chip, KindBadge, UserLine } from './shared';

/** Summary chips that matter most for each kind. */
function highlights(listing: Listing): string[] {
  switch (listing.kind) {
    case 'task':
      return [
        WORK_MODE_LABEL[listing.details.workMode],
        listing.details.duration,
        listing.details.workersNeeded > 1 ? `${listing.details.workersNeeded} people` : undefined,
      ].filter(Boolean) as string[];
    case 'contract':
      return [WORK_MODE_LABEL[listing.details.workMode], listing.details.duration];
    case 'fulltime':
      return [listing.details.company, WORK_MODE_LABEL[listing.details.workMode]];
    case 'product':
      return listing.tags.slice(0, 2);
    case 'service':
      return [listing.details.hours].filter(Boolean) as string[];
  }
}

type ListingCardProps = {
  listing: Listing;
  onImagePress?: (listing: Listing) => void;
};

/** Full-width card used for work listings and search results. */
export default function ListingCard({ listing, onImagePress }: ListingCardProps) {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useListings();
  const saved = bookmarks.has(listing.id);
  const cover = listing.images[0];

  const open = () => router.push({ pathname: '/listing/[id]', params: { id: listing.id } });

  return (
    <Pressable onPress={open} className="bg-zinc-800 rounded-xl p-4 mb-3 active:opacity-90">
      <View className="flex-row">
        {cover ? (
          <TouchableOpacity
            onPress={() => (onImagePress ? onImagePress(listing) : open())}
            accessibilityLabel={`View photos for ${listing.title}`}
          >
            <Image source={cover} style={{ width: 88, height: 88, borderRadius: 10 }} resizeMode="cover" />
            {listing.images.length > 1 && (
              <View className="absolute bottom-1 right-1 bg-black/60 rounded px-1">
                <Text className="text-white text-[10px]">+{listing.images.length - 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View
            className="bg-zinc-700 items-center justify-center"
            style={{ width: 88, height: 88, borderRadius: 10 }}
          >
            <ImageOff size={22} color={palette.textSubtle} />
          </View>
        )}

        <View className="flex-1 ml-3">
          <View className="flex-row items-start justify-between">
            <KindBadge kind={listing.kind} />
            <TouchableOpacity
              onPress={() => toggleBookmark(listing.id)}
              accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark'}
              hitSlop={10}
            >
              <Bookmark size={20} color="white" fill={saved ? 'white' : 'transparent'} />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-base font-bold mt-1" numberOfLines={2}>
            {listing.title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-white text-lg font-extrabold">{formatPrice(listing.price)}</Text>
            {listing.price.negotiable && (
              <View className="flex-row items-center ml-2 bg-green-900/50 rounded-full px-2 py-0.5">
                <Handshake size={11} color="#86efac" />
                <Text className="text-green-300 text-[11px] font-semibold ml-1">Negotiable</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row items-center mt-3">
        <MapPin size={14} color={palette.textMuted} />
        <Text className="text-zinc-400 text-xs ml-1">{formatPlace(listing.location)}</Text>
        <Text className="text-zinc-600 text-xs mx-2">•</Text>
        <Text className="text-zinc-400 text-xs">{formatRelativeTime(listing.createdAt)}</Text>
      </View>
      {listing.kind === 'task' && listing.details.scheduledFor && (
        <View className="flex-row items-center mt-1">
          <Calendar1 size={14} color={palette.textMuted} />
          <Text className="text-zinc-400 text-xs ml-1">{formatDateTime(listing.details.scheduledFor)}</Text>
        </View>
      )}

      <Text className="text-zinc-300 text-sm mt-2" numberOfLines={2}>
        {listing.description}
      </Text>

      <View className="flex-row flex-wrap mt-2">
        {highlights(listing).map(label => (
          <Chip key={label} label={label} />
        ))}
      </View>

      <View className="border-t border-zinc-700 pt-3 mt-1">
        <UserLine user={listing.postedBy} />
      </View>
    </Pressable>
  );
}
