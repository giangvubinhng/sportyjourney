import { Box, Pressable, Text } from '@gluestack-ui/themed';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function formatDateDisplay(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DatePicker({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (iso: string) => void;
  onBlur: () => void;
}) {
  const [show, setShow] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const dateObj = value ? new Date(value + 'T12:00:00') : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'dismissed') return;
    if (selectedDate) {
      onChange(selectedDate.toISOString().slice(0, 10));
    }
  };

  return (
    <>
      <Pressable onPress={() => { onBlur(); setShow(true); }}>
        <Box
          borderWidth={1}
          borderRadius="$lg"
          px="$4"
          py="$3"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mt="$1"
          style={{ backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }}>
          <Text size="md" style={{ color: colors.text }}>
            {value ? formatDateDisplay(value) : 'Select date'}
          </Text>
          <Text size="sm" style={{ color: colors.textMuted }}>
            Tap to change
          </Text>
        </Box>
      </Pressable>
      {show && (
        <>
          {Platform.OS === 'ios' ? (
            <Box mt="$2">
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="spinner"
                onChange={handleChange}
              />
              <Pressable onPress={() => setShow(false)} style={{ marginTop: 8 }}>
                <Box py="$2" borderRadius="$md" style={{ backgroundColor: colors.cardBackground }}>
                  <Text textAlign="center" fontWeight="$semibold" style={{ color: colors.tint }}>
                    Done
                  </Text>
                </Box>
              </Pressable>
            </Box>
          ) : (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
        </>
      )}
    </>
  );
}