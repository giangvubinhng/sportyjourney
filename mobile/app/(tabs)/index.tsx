import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { getCurrentUser, logout } from '@/api/auth';

export default function HomeScreen() {
  const router = useRouter();
  const user = getCurrentUser();
  if (!user) return null;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome, {user.name}!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.signOutContainer}>
        <Button
          variant="outline"
          action="negative"
          onPress={() => {
            logout();
            router.replace('/auth');
          }}>
          <ButtonText>Sign out</ButtonText>
        </Button>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutContainer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
