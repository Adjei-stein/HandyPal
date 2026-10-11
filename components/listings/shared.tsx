import { palette } from '@/constants/theme';
import { KIND_LABEL } from '@/lib/format';
import { ListingKind, UserSummary } from '@/types/listing';
import { BadgeCheck, Star } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

const KIND_COLOR: Record<ListingKind, string> = {
  task: 'bg-blue-500',
  contract: 'bg-violet-500',
  fulltime: 'bg-emerald-600',
  product: 'bg-amber-600',
  service: 'bg-cyan-600',
};

export function KindBadge({ kind }: { kind: ListingKind }) {
  return (
    <View className={`${KIND_COLOR[kind]} rounded-full px-2 py-0.5 self-start`}>
      <Text className="text-white text-xs font-semibold">{KIND_LABEL[kind]}</Text>
    </View>
  );
}

export function Chip({ label }: { label: string }) {
  return (
    <View className="bg-zinc-700 rounded-full px-3 py-1 mr-2 mb-2">
      <Text className="text-white text-xs">{label}</Text>
    </View>
  );
}

export function Avatar({ user, size = 40 }: { user: UserSummary; size?: number }) {
  if (user.avatar) {
    return (
      <Image
        source={user.avatar}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessibilityIgnoresInvertColors
      />
    );
  }
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
  return (
    <View
      className="bg-blue-600 items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  );
}

export function UserLine({ user, size = 28 }: { user: UserSummary; size?: number }) {
  return (
    <View className="flex-row items-center">
      <Avatar user={user} size={size} />
      <Text className="text-zinc-200 text-sm font-semibold ml-2" numberOfLines={1}>
        {user.name}
      </Text>
      {user.verified && (
        <BadgeCheck size={14} color={palette.verified} style={{ marginLeft: 4 }} />
      )}
      {user.rating !== undefined && (
        <View className="flex-row items-center ml-2">
          <Star size={12} color={palette.star} fill={palette.star} />
          <Text className="text-zinc-400 text-xs ml-1">{user.rating.toFixed(1)}</Text>
        </View>
      )}
    </View>
  );
}
