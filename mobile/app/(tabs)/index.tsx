import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { Box, Button, ButtonText, Heading, Text, VStack } from '@gluestack-ui/themed';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentUser, logout } from '@/api/auth';
import type { SessionRecord } from '@/api/sessions';
import { listSessions } from '@/api/sessions';

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
      borderRadius="$lg"
      p="$4"
      borderWidth={1}
      style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
        <Text fontWeight="$semibold" size="md" style={{ color: colors.text }}>
          {session.name || formatSessionDate(session.date)}
        </Text>
        <Text size="sm" style={{ color: colors.textMuted }}>
          {session.duration} min
        </Text>
      </Box>
      <Box flexDirection="row" alignItems="center" mt="$1" gap="$2">
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
        <Text size="sm" mt="$2" numberOfLines={2} style={{ color: colors.textMuted }}>
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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
      }>
      <Box flex={1} px="$6" py="$8" style={{ backgroundColor: colors.background }}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb="$6">
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
          <Box py="$12" alignItems="center">
            <Text style={{ color: colors.textMuted }}>Loading sessions…</Text>
          </Box>
        ) : sessions.length === 0 ? (
          <Box
            py="$12"
            alignItems="center"
            borderRadius="$xl"
            borderWidth={1}
            borderStyle="dashed"
            style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
            <IconSymbol name="calendar.badge.plus" size={48} color={colors.textMuted} />
            <Text mt="$4" textAlign="center" style={{ color: colors.textMuted }}>
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
  );
}
