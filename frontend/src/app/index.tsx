import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Lang = 'en' | 'ur';
type Message = { id: string; text: string; from: 'user' | 'bot' };

const STRINGS = {
  en: {
    title: 'Health & Mind Wellness',
    welcome: 'Hi! Tell me about your sleep, exercise, food or mood today.',
    placeholder: 'Type how you feel...',
    send: 'Send',
    reply: 'Thanks for sharing. AI replies will be connected later.',
  },
  ur: {
    title: 'صحت اور ذہنی تندرستی',
    welcome: 'سلام! آج اپنی نیند، ورزش، خوراک یا موڈ کے بارے میں مجھے بتائیں۔',
    placeholder: 'بتائیں آپ کیسا محسوس کر رہے ہیں...',
    send: 'بھیجیں',
    reply: 'شیئر کرنے کا شکریہ۔ AI جوابات بعد میں شامل کیے جائیں گے۔',
  },
};

export default function ChatScreen() {
  const [lang, setLang] = useState<Lang>('en');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: '', from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const t = STRINGS[lang];
  const textDir = {
    textAlign: lang === 'ur' ? ('right' as const) : ('left' as const),
    writingDirection: lang === 'ur' ? ('rtl' as const) : ('ltr' as const),
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const stamp = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: `u${stamp}`, text, from: 'user' },
      { id: `b${stamp}`, text: t.reply, from: 'bot' },
    ]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={[styles.title, textDir]}>{t.title}</Text>
        <Picker
          selectedValue={lang}
          onValueChange={(value) => setLang(value as Lang)}
          style={styles.picker}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="اردو (Urdu)" value="ur" />
        </Picker>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.from === 'user' ? styles.user : styles.bot]}>
            <Text style={[item.from === 'user' ? styles.userText : styles.botText, textDir]}>
              {item.id === 'welcome' ? t.welcome : item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, textDir]}
          value={input}
          onChangeText={setInput}
          placeholder={t.placeholder}
          onSubmitEditing={send}
        />
        <Pressable style={styles.sendButton} onPress={send}>
          <Text style={styles.sendText}>{t.send}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F6F3', paddingTop: 56 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8, gap: 12 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: '#1E2B2A' },
  picker: { width: 150, height: 40, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 8 },
  list: { padding: 20, gap: 12 },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 18 },
  bot: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
  user: { alignSelf: 'flex-end', backgroundColor: '#2F7F6F' },
  botText: { color: '#1E2B2A', fontSize: 16 },
  userText: { color: '#FFFFFF', fontSize: 16 },
  inputRow: { flexDirection: 'row', gap: 8, padding: 16, backgroundColor: '#FFFFFF' },
  input: { flex: 1, backgroundColor: '#F2F6F3', borderRadius: 14, paddingHorizontal: 16, minHeight: 44, fontSize: 16 },
  sendButton: { backgroundColor: '#2F7F6F', borderRadius: 14, paddingHorizontal: 20, justifyContent: 'center', minHeight: 44 },
  sendText: { color: '#FFFFFF', fontWeight: '800' },
});