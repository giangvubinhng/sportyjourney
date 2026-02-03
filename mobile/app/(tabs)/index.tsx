import { getCurrentUser, logout } from '@/api/auth';
import type { SessionRecord } from '@/api/sessions';
import { listSessions } from '@/api/sessions';
import ScreenLayout from '@/components/screen-layout';
import { Box } from '@/components/ui/box';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function SessionCard({
  session,
  colors,
}: {
  session: SessionRecord;
  colors: (typeof Colors)['light'];
}) {
  return (
    <Box
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, borderRadius: 16 }}>
      <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text bold size="md" style={{ color: colors.text }}>
          {session.name || formatSessionDate(session.date)}
        </Text>
        <Text size="sm" style={{ color: colors.textMuted }}>
          {session.duration} min
        </Text>
      </Box>
      <Box style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
        <Text size="sm" style={{ color: colors.textMuted }}>
          {formatSessionDate(session.date)}
        </Text>
        <Text size="sm" style={{ color: colors.textMuted }}>
          •
        </Text>
        <Text size="sm" style={{ color: colors.textMuted }}>
          Energy {session.energy}/10
        </Text>
      </Box>
      {session.note?.trim() ? (
        <Text size="sm" numberOfLines={2} style={{ color: colors.textMuted, marginTop: 8 }}>
          {session.note}
        </Text>
      ) : null}
    </Box>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const user = getCurrentUser();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const list = await listSessions();
      setSessions(list);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadSessions();
  }, [user, loadSessions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSessions();
  }, [loadSessions]);

  if (!user) return null;

  return (
    <ScreenLayout title="Home">
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
      }>
      <Box style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.background }}>
        <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <VStack space="xs">
            <Heading size="2xl" style={{ color: colors.text }}>
              Hey, {user.name || user.username || 'there'}
            </Heading>
            <Text style={{ color: colors.textMuted }}>Your recent BJJ sessions</Text>
          </VStack>
          <Button
            size="sm"
            variant="outline"
            action="primary"
            onPress={() => {
              logout();
              router.replace('/auth');
            }}>
            <ButtonText>Sign out</ButtonText>
          </Button>
        </Box>

        {loading ? (
          <Box style={{ paddingVertical: 48, alignItems: 'center' }}>
            <Text style={{ color: colors.textMuted }}>Loading sessions…</Text>
          </Box>
        ) : sessions.length === 0 ? (
          <Box
            style={{ borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <IconSymbol name="calendar.badge.plus" size={48} color={colors.textMuted} />
            <Text style={{ marginTop: 16, textAlign: 'center', color: colors.textMuted }}>
              No sessions yet. Add your first one from the Add Session tab.
            </Text>
          </Box>
        ) : (
          <VStack space="md">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} colors={colors} />
            ))}
          </VStack>
        )}
      </Box>
    </ScrollView>

    </ScreenLayout>
  );
}
