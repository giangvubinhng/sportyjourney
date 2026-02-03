/**
 * Session form schema and validation.
 * Single source of truth for add/edit session forms.
 */

export type SessionFormValues = {
  name: string;
  duration: string;
  energy: string;
  note: string;
  date: string;
};

export const ENERGY_MIN = 1;
export const ENERGY_MAX = 10;

export const DURATION_MIN = 15;
export const DURATION_MAX = 180;
export const DURATION_STEP = 5;

export const DEFAULT_DURATION = 60;
export const DEFAULT_ENERGY = 5;

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function getDefaultSessionFormValues(): SessionFormValues {
  return {
    name: '',
    duration: String(DEFAULT_DURATION),
    energy: String(DEFAULT_ENERGY),
    note: '',
    date: getTodayISO(),
  };
}

export function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export type SessionFormErrors = Partial<Record<keyof SessionFormValues, string>>;

export function validateSessionForm(values: SessionFormValues): SessionFormErrors {
  const errors: SessionFormErrors = {};

  const nameTrim = values.name.trim();
  if (!nameTrim) {
    errors.name = 'Name is required';
  }

  if (!values.date.trim()) {
    errors.date = 'Date is required';
  } else if (!ISO_DATE_ONLY.test(values.date.trim())) {
    errors.date = 'Use YYYY-MM-DD format';
  }

  const durationStr = values.duration.trim();
  if (!durationStr) {
    errors.duration = 'Duration is required';
  } else {
    const duration = parseInt(durationStr, 10);
    if (
      Number.isNaN(duration) ||
      duration < DURATION_MIN ||
      duration > DURATION_MAX
    ) {
      errors.duration = `Between ${DURATION_MIN} and ${DURATION_MAX} minutes`;
    }
  }

  const energyStr = values.energy.trim();
  if (!energyStr) {
    errors.energy = 'Energy level is required';
  } else {
    const energy = parseInt(energyStr, 10);
    if (
      Number.isNaN(energy) ||
      energy < ENERGY_MIN ||
      energy > ENERGY_MAX
    ) {
      errors.energy = `Enter a number between ${ENERGY_MIN} and ${ENERGY_MAX}`;
    }
  }

  return errors;
}

export function sessionFormValuesToPayload(
  values: SessionFormValues
): { name: string; duration: number; energy: number; note: string; date: string } {
  const dateIso = new Date(values.date.trim()).toISOString().slice(0, 10);
  return {
    name: values.name.trim(),
    duration: parseInt(values.duration.trim(), 10),
    energy: parseInt(values.energy.trim(), 10),
    note: values.note.trim(),
    date: dateIso,
  };
}
