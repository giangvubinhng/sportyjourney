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

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const isSignup = mode === 'signup';

  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    if (isSignup) {
      if (!values.passwordConfirm) {
        errors.passwordConfirm = 'Confirm your password';
      } else if (values.password !== values.passwordConfirm) {
        errors.passwordConfirm = 'Passwords do not match';
      }
    }
    return errors;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} bg="$backgroundDark950" px="$6" py="$10">
          <Formik
            initialValues={initialValues}
            validate={validate}
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
                const message =
                  err instanceof Error ? err.message : 'Something went wrong. Please try again.';
                setAuthError(message);
              } finally {
                helpers.setSubmitting(false);
              }
            }}>
            {(helpers) => {
              const {
                values,
                errors,
                touched,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
              } = helpers;

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
                            <Text
                              fontWeight="$semibold"
                              color={active ? '$textLight0' : '$textDark400'}>
                              {item === 'login' ? 'Log in' : 'Sign up'}
                            </Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </HStack>

                  <VStack space="xs" mt="$4">
                    <Heading size="3xl">
                      {isSignup ? 'Create account' : 'Welcome back'}
                    </Heading>
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
                            value={values.name}
                            onChangeText={(text) => setFieldValue('name', text)}
                            onBlur={() => setFieldTouched('name')}
                            placeholder="Your name"
                            autoCapitalize="words"
                            returnKeyType="next"
                          />
                        </Input>
                      </FormControl>
                    )}

                    <FormControl isRequired isInvalid={touched.email && !!errors.email}>
                      <FormControl.Label>
                        <Text fontWeight="$semibold">Email</Text>
                      </FormControl.Label>
                      <Input variant="outline" size="lg">
                        <InputField
                          value={values.email}
                          onChangeText={(text) => setFieldValue('email', text)}
                          onBlur={() => setFieldTouched('email')}
                          placeholder="you@example.com"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          textContentType="username"
                          returnKeyType="next"
                        />
                      </Input>
                      {touched.email && errors.email ? (
                        <FormControlError>
                          <FormControlErrorText>{errors.email}</FormControlErrorText>
                        </FormControlError>
                      ) : null}
                    </FormControl>

                    <FormControl isRequired isInvalid={touched.password && !!errors.password}>
                      <FormControl.Label>
                        <Text fontWeight="$semibold">Password</Text>
                      </FormControl.Label>
                      <Input variant="outline" size="lg">
                        <InputField
                          value={values.password}
                          onChangeText={(text) => setFieldValue('password', text)}
                          onBlur={() => setFieldTouched('password')}
                          placeholder="********"
                          secureTextEntry
                          autoComplete="password"
                          textContentType="password"
                          returnKeyType={isSignup ? 'next' : 'go'}
                        />
                      </Input>
                      {touched.password && errors.password ? (
                        <FormControlError>
                          <FormControlErrorText>{errors.password}</FormControlErrorText>
                        </FormControlError>
                      ) : null}
                    </FormControl>

                    {isSignup && (
                      <FormControl
                        isRequired
                        isInvalid={touched.passwordConfirm && !!errors.passwordConfirm}>
                        <FormControl.Label>
                          <Text fontWeight="$semibold">Confirm password</Text>
                        </FormControl.Label>
                        <Input variant="outline" size="lg">
                          <InputField
                            value={values.passwordConfirm}
                            onChangeText={(text) => setFieldValue('passwordConfirm', text)}
                            onBlur={() => setFieldTouched('passwordConfirm')}
                            placeholder="********"
                            secureTextEntry
                            autoComplete="password"
                            textContentType="password"
                            returnKeyType="go"
                          />
                        </Input>
                        {touched.passwordConfirm && errors.passwordConfirm ? (
                          <FormControlError>
                            <FormControlErrorText>{errors.passwordConfirm}</FormControlErrorText>
                          </FormControlError>
                        ) : null}
                      </FormControl>
                    )}

                    {authError ? (
                      <Box
                        bg="$backgroundError"
                        borderRadius="$lg"
                        p="$3"
                        borderWidth={1}
                        borderColor="$error500">
                        <Text color="$error500">{authError}</Text>
                      </Box>
                    ) : null}

                    <Button
                      size="lg"
                      action="primary"
                      onPress={() => handleSubmit()}
                      isDisabled={isSubmitting}
                      borderRadius="$lg">
                      {isSubmitting ? (
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
                    <Pressable onPress={() => setModeDirect(isSignup ? 'login' : 'signup')}>
                      <Text color="$primary500" fontWeight="$semibold">
                        {isSignup ? 'Log in' : 'Sign up'}
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>
              );
            }}
          </Formik>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
