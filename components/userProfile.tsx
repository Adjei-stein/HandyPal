import ListingCard from '@/components/listings/ListingCard';
import { Avatar } from '@/components/listings/shared';
import { palette } from '@/constants/theme';
import { formatDate, formatPlace } from '@/lib/format';
import { Listing, Place, UserSummary } from '@/types/listing';
import { BadgeCheck, MapPin, Share2, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Share, Text, TouchableOpacity, View } from 'react-native';

type ProfileUser = UserSummary & {
  bio?: string;
  location?: Place;
  joinedAt?: string;
  completedJobs?: number;
};

interface UserProfileProps {
  user: ProfileUser;
  listings: Listing[];
}

type Tab = 'selling' | 'hiring' | 'reviews';
const TAB_LABEL: Record<Tab, string> = { selling: 'Products & services', hiring: 'Jobs posted', reviews: 'Reviews' };

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center bg-zinc-800 rounded-xl py-3 mx-1">
      <Text className="text-white text-lg font-bold">{value}</Text>
      <Text className="text-zinc-400 text-xs mt-0.5">{label}</Text>
    </View>
  );
}

/** Storefront-style profile: who they are, why to trust them, and what they offer. */
export default function UserProfile({ user, listings }: UserProfileProps) {
  const [tab, setTab] = useState<Tab>('selling');

  const selling = listings.filter(l => l.kind === 'product' || l.kind === 'service');
  const hiring = listings.filter(l => l.kind === 'task' || l.kind === 'contract' || l.kind === 'fulltime');
  const shown: Listing[] = tab === 'selling' ? selling : tab === 'hiring' ? hiring : [];

  const header = (
    <View>
      <View className="flex-row items-center">
        <Avatar user={user} size={72} />
        <View className="ml-4 flex-1">
          <View className="flex-row items-center">
            <Text className="text-white text-2xl font-bold flex-shrink" numberOfLines={1}>
              {user.name}
            </Text>
            {user.verified && <BadgeCheck size={20} color={palette.verified} style={{ marginLeft: 6 }} />}
          </View>
          <Text className="text-zinc-500">@{user.handle}</Text>
          {user.location && (
            <View className="flex-row items-center mt-1">
              <MapPin size={13} color={palette.textMuted} />
              <Text className="text-zinc-400 text-sm ml-1">{formatPlace(user.location)}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => Share.share({ message: `Check out ${user.name} (@${user.handle}) on HandyPal` })}
          accessibilityLabel="Share profile"
          className="p-2.5 bg-zinc-800 rounded-full"
        >
          <Share2 size={20} color="white" />
        </TouchableOpacity>
      </View>

      {user.bio && <Text className="text-zinc-200 text-base mt-4">{user.bio}</Text>}

      <View className="flex-row mt-4 -mx-1">
        <Stat
          value={user.rating !== undefined ? `★ ${user.rating.toFixed(1)}` : '—'}
          label={`${user.reviewCount ?? 0} reviews`}
        />
        <Stat value={String(user.completedJobs ?? 0)} label="Jobs done" />
        <Stat value={String(listings.length)} label="Listings" />
      </View>
      {user.joinedAt && <Text className="text-zinc-500 text-xs mt-3">Member since {formatDate(user.joinedAt)}</Text>}

      <View className="flex-row border-b border-zinc-800 mt-4 mb-3">
        {(Object.keys(TAB_LABEL) as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 items-center pb-3 border-b-2 ${tab === t ? 'border-blue-500' : 'border-transparent'}`}
          >
            <Text className={`text-sm font-semibold ${tab === t ? 'text-white' : 'text-zinc-500'}`}>{TAB_LABEL[t]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      className="bg-zinc-900"
      data={shown}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ListingCard listing={item} />}
      ListHeaderComponent={header}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <View className="items-center py-10">
          <Star size={32} color={palette.textSubtle} />
          <Text className="text-zinc-400 mt-2">
            {tab === 'reviews' ? 'No reviews yet' : 'Nothing posted here yet'}
          </Text>
        </View>
      }
    />
  );
}
