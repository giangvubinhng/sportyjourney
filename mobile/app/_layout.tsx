import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider as ThemedProvider } from '@gluestack-ui/themed';
import { config as gluestackConfig } from '@gluestack-ui/config';
import 'react-native-reanimated';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentUser } from '@/api/auth';
import { pocketBaseClient } from '@/api/pocketbase';

import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const [user, setUser] = useState(getCurrentUser());
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    // On native, segments can stay empty until after first paint; only require navigation state.
    if (rootNavigationState?.key) {
      setNavReady(true);
    }
  }, [rootNavigationState?.key]);

  useEffect(() => {
    const unsubscribe = pocketBaseClient.authStore.onChange(() => {
      setUser(getCurrentUser());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!navReady) return;
    const isInAuth = segments[0] === 'auth';

    if (!user && !isInAuth) {
      router.replace('/auth');
    } else if (user && isInAuth) {
      router.replace('/(tabs)');
    }
  }, [user, router, segments, navReady]);

  if (!navReady) {
    return null;
  }

  const themeMode = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <GluestackUIProvider mode={themeMode}>
      <ThemedProvider config={gluestackConfig}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </ThemedProvider>
    </GluestackUIProvider>
  );
}
