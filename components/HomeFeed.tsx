import ImageViewer from '@/components/listings/ImageViewer';
import ListingCard from '@/components/listings/ListingCard';
import MarketGridCard from '@/components/listings/MarketGridCard';
import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { KIND_LABEL } from '@/lib/format';
import { KINDS_BY_GROUP, Listing, LISTING_GROUP, ListingGroup, ListingKind } from '@/types/listing';
import { useRouter } from 'expo-router';
import { Plus, SearchX } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

type KindFilter = 'all' | ListingKind;

const GROUP_LABEL: Record<ListingGroup, string> = { work: 'Work', market: 'Market' };

/** Render with `key={initialGroup}` so changing the initial group resets the feed. */
export default function HomeFeed({ initialGroup = 'work' }: { initialGroup?: ListingGroup }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { listings } = useListings();
  const [group, setGroup] = useState<ListingGroup>(initialGroup);
  const [kind, setKind] = useState<KindFilter>('all');
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [viewerListing, setViewerListing] = useState<Listing | null>(null);

  const switchGroup = (next: ListingGroup) => {
    setGroup(next);
    setKind('all');
    // Keep the URL in sync so the side menu highlights the right section.
    router.setParams({ mode: next === 'market' ? 'market' : undefined });
  };

  const visible = useMemo(
    () =>
      listings.filter(
        l =>
          l.status === 'open' &&
          LISTING_GROUP[l.kind] === group &&
          (kind === 'all' || l.kind === kind) &&
          (!negotiableOnly || l.price.negotiable)
      ),
    [listings, group, kind, negotiableOnly]
  );

  const kindChips: KindFilter[] = ['all', ...KINDS_BY_GROUP[group]];

  const empty = (
    <View className="items-center py-16 px-8">
      <SearchX size={40} color={palette.textSubtle} />
      <Text className="text-white text-lg font-bold mt-3">Nothing here yet</Text>
      <Text className="text-zinc-400 text-center mt-1">
        Try another filter, or be the first to post something in your area.
      </Text>
      <TouchableOpacity onPress={() => router.navigate('/post')} className="mt-4 bg-blue-500 rounded-full px-5 py-2.5">
        <Text className="text-white font-bold">Post a listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-zinc-900">
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center">
          <View className="flex-row flex-1 bg-zinc-800 rounded-full p-1">
            {(['work', 'market'] as ListingGroup[]).map(g => (
              <TouchableOpacity
                key={g}
                onPress={() => switchGroup(g)}
                className={`flex-1 items-center py-2 rounded-full ${group === g ? 'bg-blue-500' : ''}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: group === g }}
              >
                <Text className={`font-bold ${group === g ? 'text-white' : 'text-zinc-400'}`}>{GROUP_LABEL[g]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {width >= 768 && (
            <TouchableOpacity
              onPress={() => router.navigate('/post')}
              className="ml-3 flex-row items-center bg-blue-500 rounded-full px-4 py-2.5"
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-bold ml-1">Post</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {kindChips.map(k => {
            const active = kind === k;
            return (
              <TouchableOpacity
                key={k}
                onPress={() => setKind(k)}
                className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-white' : 'bg-zinc-800'}`}
              >
                <Text className={`font-semibold ${active ? 'text-zinc-900' : 'text-white'}`}>
                  {k === 'all' ? 'All' : KIND_LABEL[k]}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={() => setNegotiableOnly(v => !v)}
            className={`px-4 py-2 rounded-full mr-2 border ${
              negotiableOnly ? 'bg-green-900/50 border-green-500' : 'bg-zinc-800 border-zinc-800'
            }`}
          >
            <Text className={`font-semibold ${negotiableOnly ? 'text-green-300' : 'text-white'}`}>Negotiable</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {group === 'work' ? (
        <FlatList
          key="work"
          data={visible}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ListingCard listing={item} onImagePress={setViewerListing} />}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          ListEmptyComponent={empty}
        />
      ) : (
        <FlatList
          key="market"
          data={visible}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ width: '50%' }}>
              <MarketGridCard listing={item} />
            </View>
          )}
          contentContainerStyle={{ padding: 10, paddingTop: 4 }}
          ListEmptyComponent={empty}
        />
      )}

      <ImageViewer
        images={viewerListing?.images ?? []}
        visible={viewerListing !== null}
        onClose={() => setViewerListing(null)}
      />
    </View>
  );
}
