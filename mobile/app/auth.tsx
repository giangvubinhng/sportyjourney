import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';

import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginWithPassword, signUp } from '@/api/auth';

type Mode = 'login' | 'signup';

type FormValues = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

function validate(values: FormValues, isSignup: boolean): Partial<FormValues> {
  const errors: Partial<FormValues> = {};
  if (!values.email.trim()) errors.email = 'Email is required';
  if (!values.password) errors.password = 'Password is required';
  if (isSignup) {
    if (!values.passwordConfirm) errors.passwordConfirm = 'Confirm your password';
    else if (values.password !== values.passwordConfirm)
      errors.passwordConfirm = 'Passwords do not match';
  }
  return errors;
}

export default function AuthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [mode, setMode] = useState<Mode>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const isSignup = mode === 'signup';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Box px="$6" py="$8" style={{ backgroundColor: colors.background }}>
          <Formik
            initialValues={initialValues}
            validate={(v) => validate(v, isSignup)}
            onSubmit={async (values, helpers) => {
              setAuthError(null);
              helpers.setSubmitting(true);
              try {
                if (mode === 'signup') {
                  await signUp({
                    email: values.email,
                    password: values.password,
                    passwordConfirm: values.passwordConfirm,
                    name: values.name.trim() || undefined,
                    username: values.email,
                  });
                }
                await loginWithPassword(values.email, values.password);
                router.replace('/(tabs)');
              } catch (err) {
                setAuthError(
                  err instanceof Error ? err.message : 'Something went wrong. Please try again.'
                );
              } finally {
                helpers.setSubmitting(false);
              }
            }}>
            {({
              values,
              errors,
              touched,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            }) => {
              const setModeDirect = (next: Mode) => {
                if (mode === next) return;
                setMode(next);
                setAuthError(null);
                if (next === 'login') {
                  setFieldValue('passwordConfirm', '');
                  setFieldTouched('passwordConfirm', false);
                }
              };

              return (
                <Box
                  borderRadius="$2xl"
                  p="$6"
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}>
                  {/* Mode toggle */}
                  <HStack
                    borderRadius="$xl"
                    p="$1"
                    style={{ backgroundColor: colors.background }}
                    mb="$6">
                    {(['login', 'signup'] as const).map((item) => {
                      const active = mode === item;
                      return (
                        <Pressable
                          key={item}
                          onPress={() => setModeDirect(item)}
                          flex={1}
                          borderRadius="$lg">
                          <Box
                            borderRadius="$lg"
                            px="$4"
                            py="$3"
                            alignItems="center"
                            style={{
                              backgroundColor: active ? colors.tint : 'transparent',
                            }}>
                            <Text
                              fontWeight="$semibold"
                              size="sm"
                              style={{
                                color: active ? '#fff' : colors.textMuted,
                              }}>
                              {item === 'login' ? 'Log in' : 'Sign up'}
                            </Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </HStack>

                  <Heading size="xl" mb="$1" style={{ color: colors.text }}>
                    {isSignup ? 'Create account' : 'Welcome back'}
                  </Heading>
                  <Text size="sm" mb="$6" style={{ color: colors.textMuted }}>
                    {isSignup
                      ? 'Sign up to start tracking your BJJ journey.'
                      : 'Log in to continue where you left off.'}
                  </Text>

                  <VStack space="md">
                    {isSignup && (
                      <FormControl>
                        <FormControlLabel>
                          <FormControlLabelText style={{ color: colors.text }}>
                            Full name
                          </FormControlLabelText>
                        </FormControlLabel>
                        <Input
                          variant="outline"
                          size="lg"
                          borderRadius="$lg"
                          style={{ borderColor: colors.cardBorder, backgroundColor: colors.background }}>
                          <InputField
                            value={values.name}
                            onChangeText={(t) => setFieldValue('name', t)}
                            onBlur={() => setFieldTouched('name')}
                            placeholder="Your name"
                            placeholderTextColor={colors.textMuted}
                            style={{ color: colors.text }}
                            autoCapitalize="words"
                            returnKeyType="next"
                          />
                        </Input>
                      </FormControl>
                    )}

                    <FormControl isInvalid={!!(touched.email && errors.email)}>
                      <FormControlLabel>
                        <FormControlLabelText style={{ color: colors.text }}>
                          Email *
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input
                        variant="outline"
                        size="lg"
                        borderRadius="$lg"
                        style={{
                          borderColor: touched.email && errors.email ? undefined : colors.cardBorder,
                          backgroundColor: colors.background,
                        }}>
                        <InputField
                          value={values.email}
                          onChangeText={(t) => setFieldValue('email', t)}
                          onBlur={() => setFieldTouched('email')}
                          placeholder="you@example.com"
                          placeholderTextColor={colors.textMuted}
                          style={{ color: colors.text }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          returnKeyType="next"
                        />
                      </Input>
                      {touched.email && errors.email && (
                        <FormControlError>
                          <FormControlErrorText>{errors.email}</FormControlErrorText>
                        </FormControlError>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!(touched.password && errors.password)}>
                      <FormControlLabel>
                        <FormControlLabelText style={{ color: colors.text }}>
                          Password *
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input
                        variant="outline"
                        size="lg"
                        borderRadius="$lg"
                        style={{
                          borderColor: touched.password && errors.password ? undefined : colors.cardBorder,
                          backgroundColor: colors.background,
                        }}>
                        <InputField
                          value={values.password}
                          onChangeText={(t) => setFieldValue('password', t)}
                          onBlur={() => setFieldTouched('password')}
                          placeholder="••••••••"
                          placeholderTextColor={colors.textMuted}
                          style={{ color: colors.text }}
                          secureTextEntry
                          autoComplete="password"
                          returnKeyType={isSignup ? 'next' : 'go'}
                        />
                      </Input>
                      {touched.password && errors.password && (
                        <FormControlError>
                          <FormControlErrorText>{errors.password}</FormControlErrorText>
                        </FormControlError>
                      )}
                    </FormControl>

                    {isSignup && (
                      <FormControl isInvalid={!!(touched.passwordConfirm && errors.passwordConfirm)}>
                        <FormControlLabel>
                          <FormControlLabelText style={{ color: colors.text }}>
                            Confirm password *
                          </FormControlLabelText>
                        </FormControlLabel>
                        <Input
                          variant="outline"
                          size="lg"
                          borderRadius="$lg"
                          style={{
                            borderColor:
                              touched.passwordConfirm && errors.passwordConfirm
                                ? undefined
                                : colors.cardBorder,
                            backgroundColor: colors.background,
                          }}>
                          <InputField
                            value={values.passwordConfirm}
                            onChangeText={(t) => setFieldValue('passwordConfirm', t)}
                            onBlur={() => setFieldTouched('passwordConfirm')}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textMuted}
                            style={{ color: colors.text }}
                            secureTextEntry
                            autoComplete="password"
                            returnKeyType="go"
                          />
                        </Input>
                        {touched.passwordConfirm && errors.passwordConfirm && (
                          <FormControlError>
                            <FormControlErrorText>
                              {errors.passwordConfirm}
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>
                    )}

                    {authError && (
                      <Box
                        borderRadius="$lg"
                        p="$3"
                        style={{
                          backgroundColor: '#FEE2E2',
                          borderWidth: 1,
                          borderColor: '#EF4444',
                        }}>
                        <Text size="sm" style={{ color: '#B91C1C' }}>
                          {authError}
                        </Text>
                      </Box>
                    )}

                    <Button
                      size="lg"
                      borderRadius="$lg"
                      mt="$2"
                      style={{ backgroundColor: colors.tint }}
                      onPress={() => handleSubmit()}
                      isDisabled={isSubmitting}>
                      {isSubmitting ? (
                        <Spinner color="#fff" />
                      ) : (
                        <ButtonText style={{ color: '#fff' }}>
                          {isSignup ? 'Create account' : 'Log in'}
                        </ButtonText>
                      )}
                    </Button>
                  </VStack>

                  <HStack justifyContent="center" mt="$6" flexWrap="wrap" gap="$1">
                    <Text size="sm" style={{ color: colors.textMuted }}>
                      {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    </Text>
                    <Pressable onPress={() => setModeDirect(isSignup ? 'login' : 'signup')}>
                      <Text size="sm" fontWeight="$semibold" style={{ color: colors.tint }}>
                        {isSignup ? 'Log in' : 'Sign up'}
                      </Text>
                    </Pressable>
                  </HStack>
                </Box>
              );
            }}
          </Formik>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
