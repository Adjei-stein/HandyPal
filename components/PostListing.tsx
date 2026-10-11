import { palette } from '@/constants/theme';
import { useListings } from '@/context/ListingsContext';
import { currentUser } from '@/data/mockData';
import { CONDITION_LABEL, DELIVERY_LABEL, KIND_LABEL, WORK_MODE_LABEL } from '@/lib/format';
import {
  DeliveryOption,
  ItemCondition,
  ListingKind,
  NewListing,
  PriceUnit,
  WorkMode,
} from '@/types/listing';
import { useRouter } from 'expo-router';
import { Briefcase, ChevronLeft, FileSignature, Hammer, Package, Wrench } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

const KIND_OPTIONS: { kind: ListingKind; icon: typeof Briefcase; blurb: string }[] = [
  { kind: 'task', icon: Hammer, blurb: 'A quick, one-off job — cleaning, repairs, errands' },
  { kind: 'contract', icon: FileSignature, blurb: 'Fixed-term work paid by project, day or month' },
  { kind: 'fulltime', icon: Briefcase, blurb: 'A permanent role at your business' },
  { kind: 'product', icon: Package, blurb: 'Something you are selling' },
  { kind: 'service', icon: Wrench, blurb: 'A service you offer to customers nearby' },
];

const UNITS: Record<ListingKind, PriceUnit[]> = {
  task: ['fixed', 'hour', 'day'],
  contract: ['project', 'hour', 'day', 'week', 'month'],
  fulltime: ['month', 'year', 'hour'],
  product: ['item'],
  service: ['hour', 'fixed', 'day', 'project'],
};

const UNIT_LABEL: Record<PriceUnit, string> = {
  fixed: 'Fixed',
  item: 'Per item',
  hour: 'Per hour',
  day: 'Per day',
  week: 'Per week',
  month: 'Per month',
  year: 'Per year',
  project: 'Per project',
};

type When = 'flexible' | 'today' | 'tomorrow';
const WHEN_LABEL: Record<When, string> = { flexible: 'Flexible', today: 'Today', tomorrow: 'Tomorrow' };

function whenToIso(when: When): string | undefined {
  if (when === 'flexible') return undefined;
  const date = new Date();
  if (when === 'today') {
    date.setHours(date.getHours() + 2, 0, 0, 0);
  } else {
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);
  }
  return date.toISOString();
}

type Deadline = 'none' | '1w' | '2w' | '1m';
const DEADLINE_LABEL: Record<Deadline, string> = { none: 'No deadline', '1w': '1 week', '2w': '2 weeks', '1m': '1 month' };
const DEADLINE_DAYS: Record<Deadline, number> = { none: 0, '1w': 7, '2w': 14, '1m': 30 };

const lines = (text: string) => text.split('\n').map(s => s.trim()).filter(Boolean);

function Field({
  label,
  error,
  hint,
  ...input
}: { label: string; error?: string; hint?: string } & TextInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-zinc-300 text-sm font-semibold mb-1.5">{label}</Text>
      <TextInput
        placeholderTextColor={palette.textSubtle}
        className={`bg-zinc-800 text-white rounded-lg px-4 py-3 text-base border ${
          error ? 'border-red-500' : 'border-zinc-800'
        }`}
        {...input}
      />
      {error ? (
        <Text className="text-red-400 text-xs mt-1">{error}</Text>
      ) : hint ? (
        <Text className="text-zinc-500 text-xs mt-1">{hint}</Text>
      ) : null}
    </View>
  );
}

function ChipSelect<T extends string>({
  label,
  options,
  labels,
  selected,
  onToggle,
}: {
  label: string;
  options: T[];
  labels: Record<T, string>;
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="text-zinc-300 text-sm font-semibold mb-1.5">{label}</Text>
      <View className="flex-row flex-wrap">
        {options.map(option => {
          const active = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onToggle(option)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${active ? 'bg-blue-500' : 'bg-zinc-800'}`}
              accessibilityState={{ selected: active }}
            >
              <Text className={`font-semibold ${active ? 'text-white' : 'text-zinc-300'}`}>{labels[option]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center justify-between mb-4 bg-zinc-800 rounded-lg px-4 py-2">
      <Text className="text-zinc-200 text-base">{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: palette.primary }} />
    </View>
  );
}

function SectionHeading({ children }: { children: string }) {
  return <Text className="text-white text-lg font-bold mt-2 mb-3">{children}</Text>;
}

export default function PostListing() {
  const router = useRouter();
  const { addListing } = useListings();
  const [kind, setKind] = useState<ListingKind | null>(null);

  // Shared fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [currency, setCurrency] = useState(currentUser.defaultCurrency);
  const [unit, setUnit] = useState<PriceUnit>('fixed');
  const [negotiable, setNegotiable] = useState(true);
  const [area, setArea] = useState(currentUser.location.area);
  const [city, setCity] = useState(currentUser.location.city ?? '');
  const [tags, setTags] = useState('');

  // Kind-specific fields
  const [when, setWhen] = useState<When>('flexible');
  const [duration, setDuration] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('onsite');
  const [workersNeeded, setWorkersNeeded] = useState('1');
  const [toolsProvided, setToolsProvided] = useState(false);
  const [deliverables, setDeliverables] = useState('');
  const [company, setCompany] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState<Deadline>('2w');
  const [condition, setCondition] = useState<ItemCondition>('new');
  const [stock, setStock] = useState('');
  const [delivery, setDelivery] = useState<DeliveryOption[]>(['pickup']);
  const [hours, setHours] = useState('');
  const [radius, setRadius] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const chooseKind = (next: ListingKind) => {
    setKind(next);
    setUnit(UNITS[next][0]);
    setNegotiable(next !== 'fulltime');
    setErrors({});
  };

  const reset = () => {
    setKind(null);
    setTitle('');
    setDescription('');
    setAmount('');
    setMaxAmount('');
    setTags('');
    setDuration('');
    setDeliverables('');
    setCompany('');
    setRequirements('');
    setStock('');
    setHours('');
    setRadius('');
    setErrors({});
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (title.trim().length < 4) next.title = 'Give it a short, clear title (at least 4 characters).';
    if (description.trim().length < 10) next.description = 'Add a few more details (at least 10 characters).';
    const price = Number(amount);
    if (!amount || Number.isNaN(price) || price <= 0) next.amount = 'Enter a price greater than 0.';
    if (maxAmount && (Number.isNaN(Number(maxAmount)) || Number(maxAmount) < price)) {
      next.maxAmount = 'Maximum must be a number at least as large as the minimum.';
    }
    if (!/^[A-Za-z]{3}$/.test(currency.trim())) next.currency = 'Use a 3-letter code like GHS, NGN or USD.';
    if (!area.trim()) next.area = 'Where is this? An area or neighbourhood is enough.';
    if (kind === 'contract' && !duration.trim()) next.duration = 'How long is the contract?';
    if (kind === 'fulltime' && !company.trim()) next.company = 'Which company is hiring?';
    if (kind === 'product' && delivery.length === 0) next.delivery = 'Pick at least one delivery option.';
    return next;
  };

  const submit = () => {
    if (!kind) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const base = {
      title: title.trim(),
      description: description.trim(),
      price: {
        amount: Number(amount),
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        currency: currency.trim().toUpperCase(),
        unit,
        negotiable,
      },
      location: { area: area.trim(), city: city.trim() || undefined, country: currentUser.location.country },
      images: [],
      tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
    };

    let listing: NewListing;
    switch (kind) {
      case 'task':
        listing = {
          ...base,
          kind,
          details: {
            scheduledFor: whenToIso(when),
            duration: duration.trim() || undefined,
            workMode,
            workersNeeded: Math.max(1, parseInt(workersNeeded, 10) || 1),
            toolsProvided,
          },
        };
        break;
      case 'contract':
        listing = { ...base, kind, details: { duration: duration.trim(), workMode, deliverables: lines(deliverables) } };
        break;
      case 'fulltime':
        listing = {
          ...base,
          kind,
          details: {
            company: company.trim(),
            workMode,
            requirements: lines(requirements),
            deadline:
              deadline === 'none'
                ? undefined
                : new Date(Date.now() + DEADLINE_DAYS[deadline] * 86400_000).toISOString(),
          },
        };
        break;
      case 'product':
        listing = {
          ...base,
          kind,
          details: { condition, stock: stock ? parseInt(stock, 10) || undefined : undefined, delivery },
        };
        break;
      case 'service':
        listing = {
          ...base,
          kind,
          details: { hours: hours.trim() || undefined, serviceRadiusKm: radius ? Number(radius) || undefined : undefined },
        };
        break;
    }

    const created = addListing(listing);
    reset();
    router.push({ pathname: '/listing/[id]', params: { id: created.id } });
  };

  if (!kind) {
    return (
      <ScrollView className="flex-1 bg-zinc-900" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-white text-3xl font-bold">Post</Text>
        <Text className="text-zinc-400 text-base mt-1 mb-5">What would you like to post?</Text>
        {KIND_OPTIONS.map(({ kind: k, icon: Icon, blurb }) => (
          <TouchableOpacity
            key={k}
            onPress={() => chooseKind(k)}
            className="flex-row items-center bg-zinc-800 rounded-xl p-4 mb-3 active:bg-zinc-700"
          >
            <View className="w-11 h-11 rounded-full bg-zinc-700 items-center justify-center">
              <Icon size={22} color="white" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-base font-bold">{KIND_LABEL[k]}</Text>
              <Text className="text-zinc-400 text-sm">{blurb}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const isRole = kind === 'contract' || kind === 'fulltime';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center px-2 py-2 border-b border-zinc-800">
        <TouchableOpacity onPress={() => setKind(null)} accessibilityLabel="Back" className="p-2">
          <ChevronLeft size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-1">New {KIND_LABEL[kind].toLowerCase()}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <SectionHeading>Basics</SectionHeading>
        <Field
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder={kind === 'product' ? 'e.g. Wooden dining chair' : 'e.g. Fix a leaking kitchen tap'}
          error={errors.title}
          maxLength={80}
        />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What should people know?"
          multiline
          style={{ minHeight: 110, textAlignVertical: 'top' }}
          error={errors.description}
        />

        <SectionHeading>{kind === 'fulltime' ? 'Salary' : 'Price'}</SectionHeading>
        <View className="flex-row">
          <View className="flex-1 mr-3">
            <Field
              label={kind === 'fulltime' ? 'From' : 'Amount'}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              error={errors.amount}
            />
          </View>
          <View style={{ width: 96 }}>
            <Field
              label="Currency"
              value={currency}
              onChangeText={setCurrency}
              autoCapitalize="characters"
              maxLength={3}
              error={errors.currency}
            />
          </View>
        </View>
        {kind === 'fulltime' && (
          <Field
            label="Up to (optional)"
            value={maxAmount}
            onChangeText={setMaxAmount}
            keyboardType="decimal-pad"
            placeholder="Leave empty for a single figure"
            error={errors.maxAmount}
          />
        )}
        {UNITS[kind].length > 1 && (
          <ChipSelect label="Paid" options={UNITS[kind]} labels={UNIT_LABEL} selected={[unit]} onToggle={setUnit} />
        )}
        <ToggleRow label="Price is negotiable" value={negotiable} onChange={setNegotiable} />

        <SectionHeading>Details</SectionHeading>
        {kind === 'task' && (
          <>
            <ChipSelect
              label="When"
              options={['flexible', 'today', 'tomorrow'] as When[]}
              labels={WHEN_LABEL}
              selected={[when]}
              onToggle={setWhen}
            />
            <Field label="How long will it take? (optional)" value={duration} onChangeText={setDuration} placeholder="e.g. 2 hours" />
            <Field label="People needed" value={workersNeeded} onChangeText={setWorkersNeeded} keyboardType="number-pad" />
            <ToggleRow label="I'll provide tools and supplies" value={toolsProvided} onChange={setToolsProvided} />
          </>
        )}
        {isRole && (
          <>
            {kind === 'fulltime' && (
              <Field label="Company" value={company} onChangeText={setCompany} placeholder="Business name" error={errors.company} />
            )}
            {kind === 'contract' && (
              <Field label="Length" value={duration} onChangeText={setDuration} placeholder="e.g. 3 months" error={errors.duration} />
            )}
          </>
        )}
        {(kind === 'task' || isRole) && (
          <ChipSelect
            label="Work mode"
            options={['onsite', 'remote', 'hybrid'] as WorkMode[]}
            labels={WORK_MODE_LABEL}
            selected={[workMode]}
            onToggle={setWorkMode}
          />
        )}
        {kind === 'contract' && (
          <Field
            label="Deliverables (one per line)"
            value={deliverables}
            onChangeText={setDeliverables}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
        )}
        {kind === 'fulltime' && (
          <>
            <Field
              label="Requirements (one per line)"
              value={requirements}
              onChangeText={setRequirements}
              multiline
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />
            <ChipSelect
              label="Applications close in"
              options={['none', '1w', '2w', '1m'] as Deadline[]}
              labels={DEADLINE_LABEL}
              selected={[deadline]}
              onToggle={setDeadline}
            />
          </>
        )}
        {kind === 'product' && (
          <>
            <ChipSelect
              label="Condition"
              options={['new', 'like_new', 'used'] as ItemCondition[]}
              labels={CONDITION_LABEL}
              selected={[condition]}
              onToggle={setCondition}
            />
            <Field label="Quantity available (optional)" value={stock} onChangeText={setStock} keyboardType="number-pad" />
            <ChipSelect
              label="Delivery options"
              options={['pickup', 'seller_delivers', 'courier'] as DeliveryOption[]}
              labels={DELIVERY_LABEL}
              selected={delivery}
              onToggle={option =>
                setDelivery(prev => (prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]))
              }
            />
            {errors.delivery && <Text className="text-red-400 text-xs -mt-3 mb-4">{errors.delivery}</Text>}
          </>
        )}
        {kind === 'service' && (
          <>
            <Field label="Working hours (optional)" value={hours} onChangeText={setHours} placeholder="e.g. Mon–Sat, 8am–6pm" />
            <Field label="How far will you travel? km (optional)" value={radius} onChangeText={setRadius} keyboardType="number-pad" />
          </>
        )}

        <SectionHeading>Location</SectionHeading>
        <Field
          label="Area or neighbourhood"
          value={area}
          onChangeText={setArea}
          error={errors.area}
          hint="Only the area is shown publicly — share exact addresses in chat."
        />
        <Field label="City / region (optional)" value={city} onChangeText={setCity} />
        <Field
          label="Tags (optional)"
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. plumbing, repairs"
          hint="Separate with commas so people can find this in search."
        />

        <TouchableOpacity onPress={submit} className="bg-blue-500 rounded-full py-4 items-center mt-2">
          <Text className="text-white text-base font-bold">Post {KIND_LABEL[kind].toLowerCase()}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
