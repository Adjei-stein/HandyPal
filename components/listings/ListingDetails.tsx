import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import {
  CONDITION_LABEL,
  DELIVERY_LABEL,
  formatDate,
  formatDateTime,
  formatPlace,
  formatPrice,
  formatRelativeTime,
  WORK_MODE_LABEL,
} from '@/lib/format';
import { Listing, ListingKind } from '@/types/listing';
import { useRouter } from 'expo-router';
import { AlertTriangle, Bookmark, ChevronLeft, Handshake, Lock, MapPin, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewer from './ImageViewer';
import { Avatar, Chip, KindBadge } from './shared';

const CTA_LABEL: Record<ListingKind, string> = {
  task: 'Message poster',
  contract: 'Apply',
  fulltime: 'Apply',
  product: 'Message seller',
  service: 'Request a quote',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="px-4 py-4 border-b border-zinc-800">
      <Text className="text-zinc-400 text-sm mb-2">{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === '') return null;
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-zinc-400 text-base">{label}</Text>
      <Text className="text-zinc-100 text-base font-medium flex-shrink ml-4 text-right">{value}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <>
      {items.map(item => (
        <View key={item} className="flex-row mb-1">
          <Text className="text-zinc-300 text-base mr-2">•</Text>
          <Text className="text-zinc-300 text-base flex-1">{item}</Text>
        </View>
      ))}
    </>
  );
}

function KindSpecificSections({ listing }: { listing: Listing }) {
  switch (listing.kind) {
    case 'task':
      return (
        <Section title="Schedule">
          <Row label="When" value={listing.details.scheduledFor && formatDateTime(listing.details.scheduledFor)} />
          <Row label="Duration" value={listing.details.duration} />
          <Row label="Work mode" value={WORK_MODE_LABEL[listing.details.workMode]} />
          <Row label="People needed" value={listing.details.workersNeeded} />
          {listing.details.toolsProvided !== undefined && (
            <Row label="Tools provided" value={listing.details.toolsProvided ? 'Yes' : 'No'} />
          )}
        </Section>
      );
    case 'contract':
      return (
        <>
          <Section title="Contract">
            <Row label="Length" value={listing.details.duration} />
            <Row label="Work mode" value={WORK_MODE_LABEL[listing.details.workMode]} />
          </Section>
          {listing.details.deliverables.length > 0 && (
            <Section title="Deliverables">
              <BulletList items={listing.details.deliverables} />
            </Section>
          )}
        </>
      );
    case 'fulltime':
      return (
        <>
          <Section title="Position">
            <Row label="Company" value={listing.details.company} />
            <Row label="Work mode" value={WORK_MODE_LABEL[listing.details.workMode]} />
            <Row label="Apply by" value={listing.details.deadline && formatDate(listing.details.deadline)} />
          </Section>
          {listing.details.requirements.length > 0 && (
            <Section title="Requirements">
              <BulletList items={listing.details.requirements} />
            </Section>
          )}
          <View className="mx-4 mt-4 p-3 rounded-lg bg-amber-900/30 border border-amber-700/50">
            <Text className="text-amber-200 text-sm">
              Employers on HandyPal never charge applicants. If you&apos;re asked to pay a fee to apply,
              please report this listing.
            </Text>
          </View>
        </>
      );
    case 'product':
      return (
        <Section title="Item">
          <Row label="Condition" value={CONDITION_LABEL[listing.details.condition]} />
          <Row label="In stock" value={listing.details.stock} />
          <Row label="Delivery" value={listing.details.delivery.map(d => DELIVERY_LABEL[d]).join(', ')} />
        </Section>
      );
    case 'service':
      return (
        <Section title="Availability">
          <Row label="Hours" value={listing.details.hours} />
          <Row
            label="Travels up to"
            value={listing.details.serviceRadiusKm ? `${listing.details.serviceRadiusKm} km` : undefined}
          />
        </Section>
      );
  }
}

export default function ListingDetails({ listing }: { listing: Listing }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookmarks, toggleBookmark } = useListings();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const saved = bookmarks.has(listing.id);

  const share = () =>
    Share.share({
      message: `${listing.title} — ${formatPrice(listing.price)} in ${formatPlace(listing.location)} on HandyPal`,
    });

  const contact = () =>
    router.push({
      pathname: '/messages',
      params: { to: listing.postedBy.id, name: listing.postedBy.name, about: listing.title },
    });

  const report = () =>
    Alert.alert('Report listing', 'Tell us what is wrong with this listing.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Scam or fraud', onPress: () => Alert.alert('Thanks', 'We will review this listing.') },
      { text: 'Inappropriate', onPress: () => Alert.alert('Thanks', 'We will review this listing.') },
    ]);

  return (
    <View className="flex-1 bg-zinc-900" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-2 py-2 border-b border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back" className="p-2">
          <ChevronLeft size={26} color="white" />
        </TouchableOpacity>
        <KindBadge kind={listing.kind} />
        <TouchableOpacity onPress={share} accessibilityLabel="Share" className="p-2">
          <Share2 size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {listing.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pt-4">
            {listing.images.map((image, i) => (
              <TouchableOpacity key={i} onPress={() => setViewerIndex(i)} className="mr-2">
                <Image
                  source={image}
                  style={{ width: listing.images.length === 1 ? 320 : 220, height: 180, borderRadius: 12 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View className="px-4 pt-4 pb-4 border-b border-zinc-800">
          <Text className="text-white text-2xl font-bold">{listing.title}</Text>
          <View className="flex-row items-center mt-2 flex-wrap">
            <Text className="text-white text-2xl font-extrabold mr-2">{formatPrice(listing.price)}</Text>
            {listing.price.negotiable ? (
              <View className="flex-row items-center bg-green-900/50 rounded-full px-2 py-0.5">
                <Handshake size={12} color="#86efac" />
                <Text className="text-green-300 text-xs font-semibold ml-1">Negotiable</Text>
              </View>
            ) : listing.kind === 'fulltime' ? null : (
              <View className="flex-row items-center bg-zinc-700 rounded-full px-2 py-0.5">
                <Lock size={12} color={palette.textMuted} />
                <Text className="text-zinc-300 text-xs font-semibold ml-1">Fixed price</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center mt-2">
            <MapPin size={14} color={palette.textMuted} />
            <Text className="text-zinc-400 text-sm ml-1">{formatPlace(listing.location)}</Text>
            <Text className="text-zinc-600 mx-2">•</Text>
            <Text className="text-zinc-400 text-sm">Posted {formatRelativeTime(listing.createdAt)}</Text>
          </View>
        </View>

        <Section title="Description">
          <Text className="text-zinc-200 text-base leading-6">{listing.description}</Text>
          {listing.tags.length > 0 && (
            <View className="flex-row flex-wrap mt-3">
              {listing.tags.map(tag => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          )}
        </Section>

        <KindSpecificSections listing={listing} />

        <Section title={listing.kind === 'product' || listing.kind === 'service' ? 'Seller' : 'Posted by'}>
          <View className="flex-row items-center">
            <Avatar user={listing.postedBy} size={48} />
            <View className="ml-3 flex-1">
              <Text className="text-white text-base font-bold">{listing.postedBy.name}</Text>
              <Text className="text-zinc-400 text-sm">
                {listing.postedBy.verified ? 'Verified' : 'Not yet verified'}
                {listing.postedBy.rating !== undefined &&
                  ` • ★ ${listing.postedBy.rating.toFixed(1)} (${listing.postedBy.reviewCount ?? 0} reviews)`}
              </Text>
            </View>
          </View>
        </Section>

        <TouchableOpacity onPress={report} className="flex-row items-center justify-center py-6">
          <AlertTriangle size={16} color={palette.danger} />
          <Text className="text-red-500 ml-2">Report listing</Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        className="absolute left-0 right-0 bottom-0 flex-row items-center px-4 pt-3 bg-zinc-900 border-t border-zinc-800"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TouchableOpacity
          onPress={() => toggleBookmark(listing.id)}
          accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark'}
          className="p-3 bg-zinc-800 rounded-full"
        >
          <Bookmark size={22} color="white" fill={saved ? 'white' : 'transparent'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={contact} className="flex-1 ml-3 bg-blue-500 rounded-full py-3.5 items-center">
          <Text className="text-white text-base font-bold">{CTA_LABEL[listing.kind]}</Text>
        </TouchableOpacity>
      </View>

      <ImageViewer
        images={listing.images}
        initialIndex={viewerIndex ?? 0}
        visible={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
      />
    </View>
  );
}
