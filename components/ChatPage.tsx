import { palette } from '@/constants/theme';
import { Camera, ChevronLeft, Mic, Send } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface Conversation {
  id: number | string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  /** What the conversation is about, e.g. a listing title. */
  subtitle?: string;
}

interface ChatPageProps {
  conversation: Conversation;
  initialDraft?: string;
  onBack: () => void;
}

type Message = { id: string; text: string; sender: 'me' | 'other'; time: string };

const nowLabel = () => new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const ChatPage: React.FC<ChatPageProps> = ({ conversation, initialDraft = '', onBack }) => {
  const [messages, setMessages] = useState<Message[]>(
    conversation.lastMessage
      ? [{ id: 'first', text: conversation.lastMessage, sender: 'other', time: conversation.time }]
      : []
  );
  const [draft, setDraft] = useState(initialDraft);
  const listRef = useRef<FlatList<Message>>(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: `${Date.now()}`, text, sender: 'me', time: nowLabel() }]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      className="w-full h-full bg-zinc-900 flex flex-col"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat header */}
      <View className="px-2 py-3 border-b border-zinc-700 flex-row items-center">
        <TouchableOpacity className="p-2 mr-1" onPress={onBack} accessibilityLabel="Back to inbox">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">{conversation.name}</Text>
          {conversation.subtitle && (
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {conversation.subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Messages area */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text className="text-zinc-500 text-center mt-8">
            Say hello. Keep payments and personal details in the app until you trust each other.
          </Text>
        }
        renderItem={({ item: message }) => (
          <View className={`mb-3 ${message.sender === 'me' ? 'items-end' : 'items-start'}`}>
            <View className={`p-3 rounded-lg max-w-[80%] ${message.sender === 'me' ? 'bg-blue-500' : 'bg-zinc-800'}`}>
              <Text className={`${message.sender === 'me' ? 'text-white' : 'text-gray-300'}`}>{message.text}</Text>
              <Text className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                {message.time}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Message input */}
      <View className="p-3 border-t border-zinc-700 flex-row items-center">
        <TouchableOpacity className="p-2" accessibilityLabel="Attach photo">
          <Camera size={22} color={palette.textMuted} />
        </TouchableOpacity>
        <TextInput
          className="flex-1 bg-zinc-800 text-white px-3 py-2.5 rounded-lg mx-1"
          placeholder="Type a message"
          placeholderTextColor={palette.textSubtle}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        {draft.trim() ? (
          <TouchableOpacity className="p-2" onPress={send} accessibilityLabel="Send">
            <Send size={22} color={palette.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="p-2" accessibilityLabel="Record voice note">
            <Mic size={22} color={palette.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;
