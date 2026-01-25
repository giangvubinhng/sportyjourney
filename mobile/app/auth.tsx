import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import { loginWithPassword, signUp } from '@/api/auth';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (password !== passwordConfirm) {
          setError('Passwords do not match.');
          return;
        }

        await signUp({
          email,
          password,
          passwordConfirm,
          name: name.trim() || undefined,
          username: email,
        });
      }

      await loginWithPassword(email, password);
      router.replace('/');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
  };

  const setModeDirect = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const isSignup = mode === 'signup';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} bg="$backgroundDark950" px="$6" py="$10">
          <VStack flex={1} justifyContent="center">
            <HStack
              bg="$backgroundDark900"
              borderRadius="$2xl"
              p="$1"
              space="xs"
              alignItems="center">
              {(['login', 'signup'] as const).map((item) => {
                const active = mode === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setModeDirect(item)}
                    flex={1}
                    borderRadius="$xl">
                    <Box
                      borderRadius="$xl"
                      bg={active ? '$primary500' : 'transparent'}
                      px="$4"
                      py="$3"
                      alignItems="center">
                      <Text fontWeight="$semibold" color={active ? '$textLight0' : '$textDark400'}>
                        {item === 'login' ? 'Log in' : 'Sign up'}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </HStack>

            <VStack space="xs" mt="$4">
              <Heading size="3xl">{isSignup ? 'Create account' : 'Welcome back'}</Heading>
              <Text color="$textDark400">
                {isSignup
                  ? 'Sign up to start tracking your journey.'
                  : 'Log in to continue where you left off.'}
              </Text>
            </VStack>

            <VStack space="md" mt="$6">
              {isSignup && (
                <FormControl>
                  <FormControl.Label>
                    <Text fontWeight="$semibold">Full name</Text>
                  </FormControl.Label>
                  <Input variant="outline" size="lg">
                    <InputField
                      value={name}
                      onChangeText={setName}
                      placeholder="Your name"
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </Input>
                </FormControl>
              )}

              <FormControl isRequired>
                <FormControl.Label>
                  <Text fontWeight="$semibold">Email</Text>
                </FormControl.Label>
                <Input variant="outline" size="lg">
                  <InputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="username"
                    returnKeyType="next"
                  />
                </Input>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>
                  <Text fontWeight="$semibold">Password</Text>
                </FormControl.Label>
                <Input variant="outline" size="lg">
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType={isSignup ? 'next' : 'go'}
                  />
                </Input>
              </FormControl>

              {isSignup && (
                <FormControl isRequired>
                  <FormControl.Label>
                    <Text fontWeight="$semibold">Confirm password</Text>
                  </FormControl.Label>
                  <Input variant="outline" size="lg">
                    <InputField
                      value={passwordConfirm}
                      onChangeText={setPasswordConfirm}
                      placeholder="••••••••"
                      secureTextEntry
                      autoComplete="password"
                      textContentType="password"
                      returnKeyType="go"
                    />
                  </Input>
                </FormControl>
              )}

              {error ? (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              ) : null}

              <Button
                size="lg"
                action="primary"
                onPress={handleSubmit}
                isDisabled={submitting}
                borderRadius="$lg">
                {submitting ? (
                  <Spinner color="$textLight0" />
                ) : (
                  <ButtonText>{isSignup ? 'Create account' : 'Log in'}</ButtonText>
                )}
              </Button>
            </VStack>

            <HStack justifyContent="center" space="xs" mt="$8">
              <Text color="$textDark400">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Pressable onPress={toggleMode}>
                <Text color="$primary500" fontWeight="$semibold">
                  {isSignup ? 'Log in' : 'Sign up'}
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
