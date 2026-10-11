import ChatPage, { Conversation } from '@/components/ChatPage';
import InboxPage from '@/components/InboxPage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

export default function MessagesScreen() {
  const router = useRouter();
  // Set when arriving from a listing's "Message" button.
  const { to, name, about } = useLocalSearchParams<{ to?: string; name?: string; about?: string }>();
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState('');

  const paramsKey = `${to}|${name}|${about}`;
  const [prevParamsKey, setPrevParamsKey] = useState<string | null>(null);
  if (paramsKey !== prevParamsKey) {
    setPrevParamsKey(paramsKey);
    if (to && name) {
      setSelected({ id: to, name, lastMessage: '', time: '', unread: false, subtitle: about });
      setDraft(about ? `Hi, I'm interested in "${about}". Is it still available?` : '');
    }
  }

  if (selected) {
    return (
      <ChatPage
        key={String(selected.id)}
        conversation={selected}
        initialDraft={draft}
        onBack={() => {
          setSelected(null);
          setDraft('');
          if (to) router.setParams({ to: undefined, name: undefined, about: undefined });
        }}
      />
    );
  }

  return <InboxPage onSelectConversation={setSelected} />;
}
