// constants.ts
export const FUNCTION_MENU = {
  VIEW_QUESTION: 0,
  UPDATE_DELETE: 1,
  MITRABERSARI_EVAL: 2,
  PERSONAL_EVAL: 3,
  KOMITE_VIEW_EVAL: 4,
  NAKES_VIEW_EVAL: 5,
  SUPERVISOR_VIEW_EVAL: 6,
} as const;

export const PENILAIAN_MITRABERSARI = [
  { id: 1, label: "Option 1" },
  { id: 2, label: "Option 2" },
  { id: 3, label: "Option 3" },
];

export const PENILAIAN_PRIBADI = [
  { id: 3, label: "Option 3" },
  { id: 4, label: "Option 4" },
];

export const NOTE_STATUS = {
  NONE: 0,
  PASS: 1,
  PASS_WITH_NOTE: 2,
  FAIL: 3,
} as const;
