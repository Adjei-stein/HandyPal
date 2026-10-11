import ListingCard from '@/components/listings/ListingCard';
import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { KIND_LABEL } from '@/lib/format';
import { Listing, ListingKind } from '@/types/listing';
import { useLocalSearchParams } from 'expo-router';
import { Search, SearchX, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Filter = 'all' | 'saved' | ListingKind;

const FILTERS: Filter[] = ['all', 'saved', 'task', 'contract', 'fulltime', 'product', 'service'];
const FILTER_LABEL: Record<Filter, string> = { all: 'All', saved: 'Saved', ...KIND_LABEL };

function searchableText(listing: Listing): string {
  const parts = [
    listing.title,
    listing.description,
    listing.location.area,
    listing.location.city,
    listing.postedBy.name,
    KIND_LABEL[listing.kind],
    ...listing.tags,
  ];
  if (listing.kind === 'fulltime') parts.push(listing.details.company);
  return parts.filter(Boolean).join(' ').toLowerCase();
}

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ saved?: string }>();
  const { listings, bookmarks } = useListings();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>(params.saved ? 'saved' : 'all');

  // Opening Explore from the drawer's "Saved" link switches to that filter.
  const [prevSaved, setPrevSaved] = useState(params.saved);
  if (params.saved !== prevSaved) {
    setPrevSaved(params.saved);
    if (params.saved) setFilter('saved');
  }

  const results = useMemo(() => {
    // Every word must appear somewhere, so "plumber adenta" narrows instead of widening.
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return listings.filter(l => {
      if (filter === 'saved' && !bookmarks.has(l.id)) return false;
      if (filter !== 'all' && filter !== 'saved' && l.kind !== filter) return false;
      if (words.length === 0) return true;
      const text = searchableText(l);
      return words.every(w => text.includes(w));
    });
  }, [listings, bookmarks, query, filter]);

  return (
    <View className="flex-1 bg-zinc-900">
      <View className="px-4 pt-3">
        <Text className="text-white text-3xl font-bold mb-3">Explore</Text>
        <View className="flex-row items-center bg-zinc-800 rounded-full px-4">
          <Search size={18} color={palette.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search jobs, products, services, places…"
            placeholderTextColor={palette.textSubtle}
            className="flex-1 text-white text-base py-3 ml-2"
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={10}>
              <X size={18} color={palette.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 mb-1">
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-white' : 'bg-zinc-800'}`}
              >
                <Text className={`font-semibold ${active ? 'text-zinc-900' : 'text-white'}`}>
                  {FILTER_LABEL[f]}
                  {f === 'saved' && bookmarks.size > 0 ? ` (${bookmarks.size})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <Text className="text-zinc-500 text-sm mb-2">
            {results.length} result{results.length === 1 ? '' : 's'}
          </Text>
        }
        ListEmptyComponent={
          <View className="items-center py-16 px-8">
            <SearchX size={40} color={palette.textSubtle} />
            <Text className="text-white text-lg font-bold mt-3">
              {filter === 'saved' ? 'Nothing saved yet' : 'No matches'}
            </Text>
            <Text className="text-zinc-400 text-center mt-1">
              {filter === 'saved'
                ? 'Tap the bookmark on any listing to keep it here.'
                : 'Try fewer words or a different category.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
