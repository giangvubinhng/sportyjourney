import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import ScreenLayout from '@/components/screen-layout';
import { Center } from '@/components/ui/center';
import DatePicker from '@/components/ui/date-picker';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@/components/ui/slider';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { getCurrentUser } from '@/api/auth';
import { createSession } from '@/api/sessions';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  DURATION_MAX,
  DURATION_MIN,
  DURATION_STEP,
  ENERGY_MAX,
  ENERGY_MIN,
  getDefaultSessionFormValues,
  sessionFormValuesToPayload,
  validateSessionForm,
  type SessionFormValues,
} from '@/lib/session-form';

const SUBMIT_ERROR_FALLBACK = 'Something went wrong. Please try again.';

export default function AddSessionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const user = getCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (values: SessionFormValues) => {
    setSubmitError(null);
    try {
      const payload = sessionFormValuesToPayload(values);
      await createSession({
        name: payload.name,
        date: payload.date,
        duration: payload.duration,
        energy: payload.energy,
        note: payload.note || undefined,
      });
      router.replace('/(tabs)');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : SUBMIT_ERROR_FALLBACK);
    }
  };

  return (
    <ScreenLayout title="Add session" description="Log a BJJ training session.">
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Box style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 16, backgroundColor: colors.background }}>
          <Formik
            initialValues={getDefaultSessionFormValues()}
            validate={validateSessionForm}
            onSubmit={handleSubmit}>
            {({
              values,
              errors,
              touched,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            }) => {
              const durationNum = parseInt(values.duration, 10) || 0;
              const energyNum = parseInt(values.energy, 10) || 0;

              return (
                <VStack space="lg">
                  {/* Name */}
                  <FormControl isInvalid={!!(touched.name && errors.name)}>
                    <FormControlLabel>
                      <FormControlLabelText className="text-typography-900 font-medium">
                        Name *
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input variant="outline" size="lg" className="rounded-lg border-outline-300">
                      <InputField
                        value={values.name}
                        onChangeText={(v) => setFieldValue('name', v)}
                        onBlur={() => setFieldTouched('name')}
                        placeholder="e.g. Morning roll"
                        className="text-typography-900"
                      />
                    </Input>
                    {touched.name && errors.name && (
                      <Text size="sm" className="text-error-700 mt-1">
                        {errors.name}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    {/* Date */}
                    <FormControlLabel>
                      <FormControlLabelText>Date *</FormControlLabelText>
                    </FormControlLabel>
                    <DatePicker
                      value={values.date}
                      onChange={(iso) => setFieldValue('date', iso)}
                      onBlur={() => setFieldTouched('date')}
                    />
                  </FormControl>
                  {/* Duration */}
                  <FormControl>
                    <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <FormControlLabel>
                        <FormControlLabelText className="text-typography-900 font-medium">
                          Duration *
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Box
                        className="bg-primary-500 px-3 py-1 rounded-full min-w-[56px] items-center">
                        <Text size="sm" bold className="text-typography-0">
                          {durationNum} min
                        </Text>
                      </Box>
                    </Box>
                    <Center className="w-full">
                      <Slider
                        value={durationNum}
                        size="md"
                        orientation="horizontal"
                        onChange={(v) => setFieldValue('duration', String(Math.round(v)))}
                        onBlur={() => setFieldTouched('duration')}
                        minValue={DURATION_MIN}
                        maxValue={DURATION_MAX}
                        step={DURATION_STEP}
                        className="w-full">
                        <SliderTrack className="bg-outline-200">
                          <SliderFilledTrack className="bg-primary-500" />
                        </SliderTrack>
                        <SliderThumb className="bg-primary-500" />
                      </Slider>
                    </Center>
                  </FormControl>

                  {/* Energy */}
                  <FormControl>
                    <Box style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <FormControlLabel>
                        <FormControlLabelText className="text-typography-900 font-medium">
                          Energy *
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Box
                        className="bg-primary-500 px-3 py-1 rounded-full min-w-[56px] items-center">
                        <Text size="sm" bold className="text-typography-0">
                          {energyNum} / {ENERGY_MAX}
                        </Text>
                      </Box>
                    </Box>
                    <Center className="w-full">
                      <Slider
                        value={energyNum}
                        size="md"
                        orientation="horizontal"
                        onChange={(v) => setFieldValue('energy', String(Math.round(v)))}
                        onBlur={() => setFieldTouched('energy')}
                        minValue={ENERGY_MIN}
                        maxValue={ENERGY_MAX}
                        className="w-full">
                        <SliderTrack className="bg-outline-200">
                          <SliderFilledTrack className="bg-primary-500" />
                        </SliderTrack>
                        <SliderThumb className="bg-primary-500" />
                      </Slider>
                    </Center>
                  </FormControl>

                  {/* Note */}
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText className="text-typography-900 font-medium">
                        Note (optional)
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Textarea
                      size="lg"
                      className="min-w-[200px] rounded-lg border-outline-300 min-h-[100px]">
                      <TextareaInput
                        placeholder="Drilling, sparring, techniques…"
                        value={values.note}
                        onChangeText={(v: string) => setFieldValue('note', v)}
                        onBlur={() => setFieldTouched('note')}
                        className="text-typography-900"
                      />
                    </Textarea>
                  </FormControl>

                  {submitError && (
                    <Box
                      style={{
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: '#FEE2E2',
                        borderWidth: 1,
                        borderColor: '#EF4444',
                      }}>
                      <Text size="sm" style={{ color: '#B91C1C' }}>
                        {submitError}
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
                      <ButtonText style={{ color: '#fff' }}>Save session</ButtonText>
                    )}
                  </Button>
                </VStack>
              );
            }}
          </Formik>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
</ScreenLayout>
  );
}
