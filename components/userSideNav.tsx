import { Avatar } from '@/components/listings/shared';
import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { formatPlace } from '@/lib/format';
import { Place, UserSummary } from '@/types/listing';
import Constants from 'expo-constants';
import { Href, useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import {
  BadgeCheck,
  Bookmark,
  ChevronRight,
  Compass,
  House,
  LifeBuoy,
  MessageCircle,
  Plus,
  ShoppingBag,
  Star,
  Store,
  SunMoon,
  UserCog,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface UserSideNavProps {
  user: UserSummary & { location?: Place };
  /** Called after a destination is chosen, e.g. to close the mobile drawer. */
  onNavigate?: () => void;
  /** Shows a close button when provided. */
  onClose?: () => void;
}

type NavItem = {
  label: string;
  subtitle: string;
  icon: LucideIcon;
  href: Href;
  isActive: boolean;
  count?: number;
};

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider px-3 mt-5 mb-1">{children}</Text>
  );
}

function NavRow({ item, onPress }: { item: NavItem; onPress: () => void }) {
  const { icon: Icon, isActive } = item;
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-3 py-2.5 rounded-xl ${isActive ? 'bg-zinc-800' : 'active:bg-zinc-800'}`}
      accessibilityRole="link"
      accessibilityState={{ selected: isActive }}
      accessibilityHint={item.subtitle}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center ${isActive ? 'bg-blue-500/20' : 'bg-zinc-800'}`}
      >
        <Icon size={20} color={isActive ? palette.primary : 'white'} />
      </View>
      <View className="flex-1 ml-3">
        <Text className={`text-base font-semibold ${isActive ? 'text-blue-400' : 'text-white'}`}>{item.label}</Text>
        <Text className="text-zinc-500 text-xs" numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      {item.count !== undefined && item.count > 0 && (
        <View className="bg-zinc-700 rounded-full min-w-[24px] h-6 px-2 items-center justify-center">
          <Text className="text-white text-xs font-bold">{item.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ComingSoonRow({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <View className="flex-row items-center px-3 py-2" accessibilityState={{ disabled: true }}>
      <View className="w-10 h-10 rounded-xl items-center justify-center bg-zinc-800/60">
        <Icon size={20} color={palette.textSubtle} />
      </View>
      <Text className="flex-1 ml-3 text-zinc-400 text-base">{label}</Text>
      <View className="bg-zinc-800 rounded-full px-2 py-0.5">
        <Text className="text-zinc-500 text-[11px] font-semibold">Soon</Text>
      </View>
    </View>
  );
}

export default function UserSideNav({ user, onNavigate, onClose }: UserSideNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mode, saved } = useGlobalSearchParams<{ mode?: string; saved?: string }>();
  const { listings, bookmarks } = useListings();
  const myListingCount = listings.filter(l => l.postedBy.id === user.id).length;

  const go = (href: Href) => {
    router.navigate(href);
    onNavigate?.();
  };

  const browse: NavItem[] = [
    {
      label: 'Find work',
      subtitle: 'Tasks, contracts and full-time jobs',
      icon: House,
      href: '/',
      isActive: pathname === '/' && mode !== 'market',
    },
    {
      label: 'Marketplace',
      subtitle: 'Products and services near you',
      icon: ShoppingBag,
      href: { pathname: '/', params: { mode: 'market' } },
      isActive: pathname === '/' && mode === 'market',
    },
    {
      label: 'Search',
      subtitle: 'Look for anything, anywhere',
      icon: Compass,
      href: '/explore',
      isActive: pathname === '/explore' && !saved,
    },
  ];

  const activity: NavItem[] = [
    {
      label: 'My listings',
      subtitle: 'What you have posted',
      icon: Store,
      href: '/profile',
      isActive: pathname === '/profile',
      count: myListingCount,
    },
    {
      label: 'Saved',
      subtitle: 'Listings you bookmarked',
      icon: Bookmark,
      href: { pathname: '/explore', params: { saved: '1' } },
      isActive: pathname === '/explore' && !!saved,
      count: bookmarks.size,
    },
    {
      label: 'Messages',
      subtitle: 'Chats with buyers, sellers and employers',
      icon: MessageCircle,
      href: '/messages',
      isActive: pathname === '/messages',
    },
  ];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 12, paddingBottom: 24 }}>
      {/* Profile card */}
      <View className="bg-zinc-800 rounded-2xl p-4">
        <View className="flex-row items-start">
          <Avatar user={user} size={56} />
          <View className="flex-1 ml-3">
            <View className="flex-row items-center">
              <Text className="text-white text-lg font-bold flex-shrink" numberOfLines={1}>
                {user.name}
              </Text>
              {user.verified && <BadgeCheck size={16} color={palette.verified} style={{ marginLeft: 4 }} />}
            </View>
            <Text className="text-zinc-400 text-sm">@{user.handle}</Text>
            <View className="flex-row items-center mt-1">
              {user.rating !== undefined && (
                <>
                  <Star size={12} color={palette.star} fill={palette.star} />
                  <Text className="text-zinc-300 text-xs ml-1">{user.rating.toFixed(1)}</Text>
                  {user.location && <Text className="text-zinc-600 text-xs mx-1.5">•</Text>}
                </>
              )}
              {user.location && (
                <Text className="text-zinc-400 text-xs flex-shrink" numberOfLines={1}>
                  {formatPlace(user.location)}
                </Text>
              )}
            </View>
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close menu" hitSlop={10} className="p-1 -mr-1 -mt-1">
              <X size={22} color={palette.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => go('/profile')}
          className="flex-row items-center justify-center mt-3 py-2 rounded-lg border border-zinc-700 active:bg-zinc-700"
        >
          <Text className="text-white font-semibold">View profile</Text>
          <ChevronRight size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Primary action */}
      <TouchableOpacity
        onPress={() => go('/post')}
        className="flex-row items-center bg-blue-500 rounded-2xl px-4 py-3.5 mt-3 active:bg-blue-600"
      >
        <View className="w-9 h-9 rounded-full bg-white/20 items-center justify-center">
          <Plus size={20} color="white" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-white text-base font-bold">Post something</Text>
          <Text className="text-blue-100 text-xs">A job, a product or a service</Text>
        </View>
      </TouchableOpacity>

      <SectionLabel>Browse</SectionLabel>
      {browse.map(item => (
        <NavRow key={item.label} item={item} onPress={() => go(item.href)} />
      ))}

      <SectionLabel>Your activity</SectionLabel>
      {activity.map(item => (
        <NavRow key={item.label} item={item} onPress={() => go(item.href)} />
      ))}

      <SectionLabel>Settings & help</SectionLabel>
      <ComingSoonRow label="Account settings" icon={UserCog} />
      <ComingSoonRow label="Appearance" icon={SunMoon} />
      <ComingSoonRow label="Help & support" icon={LifeBuoy} />

      <Text className="text-zinc-600 text-xs text-center mt-6">
        HandyPal {Constants.expoConfig?.version ? `v${Constants.expoConfig.version}` : ''}
      </Text>
    </ScrollView>
  );
}
