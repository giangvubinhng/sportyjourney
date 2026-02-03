import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

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
        <Box style={{ paddingHorizontal: 24, paddingVertical: 32, backgroundColor: colors.background }}>
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
                  style={{
                    borderRadius: 24,
                    padding: 24,
                    backgroundColor: colors.cardBackground,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}>
                  {/* Mode toggle */}
                  <HStack
                    style={{
                      borderRadius: 16,
                      padding: 4,
                      marginBottom: 24,
                      backgroundColor: colors.background,
                    }}>
                    {(['login', 'signup'] as const).map((item) => {
                      const active = mode === item;
                      return (
                        <Pressable
                          key={item}
                          onPress={() => setModeDirect(item)}
                          style={{ flex: 1, borderRadius: 8 }}>
                          <Box
                            style={{
                              borderRadius: 8,
                              paddingHorizontal: 16,
                              paddingVertical: 12,
                              alignItems: 'center',
                              backgroundColor: active ? colors.tint : 'transparent',
                            }}>
                            <Text
                              bold
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

                  <Heading size="xl" style={{ color: colors.text, marginBottom: 4 }}>
                    {isSignup ? 'Create account' : 'Welcome back'}
                  </Heading>
                  <Text size="sm" style={{ color: colors.textMuted, marginBottom: 24 }}>
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
                          style={{ borderRadius: 8, borderColor: colors.cardBorder, backgroundColor: colors.background }}>
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
                        style={{
                          borderRadius: 8,
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
                        style={{
                          borderRadius: 8,
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
                          style={{
                            borderRadius: 8,
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
                        style={{
                          borderRadius: 8,
                          padding: 12,
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
                      style={{ backgroundColor: colors.tint, borderRadius: 8, marginTop: 8 }}
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

                  <HStack style={{ justifyContent: 'center', marginTop: 24, flexWrap: 'wrap', gap: 4 }}>
                    <Text size="sm" style={{ color: colors.textMuted }}>
                      {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    </Text>
                    <Pressable onPress={() => setModeDirect(isSignup ? 'login' : 'signup')}>
                      <Text size="sm" bold style={{ color: colors.tint }}>
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
