export interface Access {
  id: number;
  nakes_nip: string;
  nakes_name: string;
  access: number;
  access_name: string;
  declaration: string;
  declaration_detail: string;
  create_date: Date;
}

export interface AccessList {
  id: number;
  role_name: string;
}

export interface UnitInstalationList {
  id_ruang: string;
  nama_ruangan: string;
  instalasi: string;
}

export interface LogBook {
  id_document: number;
  short_name: string;
  pk_grade: string;
  name_document: string;
  create_date: Date;
}

export interface LogBookDetail {
  id_logbook: number;
  create_nip: string;
  create_date: Date;
  nakes_unit: string;
  id_document: number;
  id_category_logbook: number;
  category_logbook_name: string;
  count_min: number;
  logbook_note: string;
  logbook_drug: string;
  logbook_sop: string;
  supervisor_nip: string;
  supervisor_name: string;
}

export interface LogBookCategory {
  id: number;
  id_document: number;
  short_name: string;
  name_document: string;
  status: number;
  id_category_logbook: number;
  declaration: string;
  count_min: number;
  create_date: Date;
}

export interface CategoryLogbook {
  id: number;
  declaration: string;
  create_date: Date;
}

export interface Question {
  id: number;
  number: number;
  question: string;
}

export interface ChapterQuestionSubQuestionRow {
  id_dokument: number;
  id_chapter: number;
  num_chapter: number;
  chapter: string;
  id_question: number | null;
  num_question: number | null;
  question: string | null;
  id_sub_question: number | null;
  num_sub_question: number | null;
  sub_question: string | null;
}

export interface Question_SubQuestion {
  id_sub_question: number | null; // Because of LEFT JOIN, it can be null
  num_sub_question: number | null;
  sub_question: string | null;
}

export interface Chapter_Question {
  id_question: number | null; // Can be null if no question in the chapter
  num_question: number | null;
  question: string | null;
  subQuestions: Question_SubQuestion[]; // Nested sub questions
}

export interface Chapter {
  id_dokument: number;
  id_chapter: number;
  num_chapter: number;
  chapter: string;
  questions: Chapter_Question[]; // Nested questions
}

export interface DetilDataUser {
  nip: string;
  nama: string;
  bagian: string;
  subbagian: string;
  unit: string;
  profesi: string;
  alamat: string;
  agama: string;
  status_karyawan: string;
  foto_profil: string;
  tgl_lahir: string;
  tempat_lahir: string;
  telp: string;
  marital_status: string;
  golongan_darah: string;
  mail: string;
  no_ktp: string;
  no_bpjsks: string;
  no_bpjstk: string;
  tgl_masuk: string;
  jenis_karyawan: string;
  gender: string;
}

export interface DocumentCredential {
  id: number;
  short_name: string;
  name_document: string;
  pk_grade: string;
  status: number;
  update_date: Date;
  create_date: Date;
}

export interface DocumentCategory {
  id_category: number;
  category_name: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableQuestionRow {
  id: string;
  type: "chapter" | "question" | "subQuestion";
  data: any;
  level: number;
}

export interface ApplicationCard {
  id_application: number;
  id_document: number;
  short_name: string;
  create_nip: string;
  create_name: string;
  create_date: Date;
  nakes_unit: string;
  status_app: number;
  status_name: string;
  supervisor_status: number;
  head_of_installation_status: number;
  mitrabersari_status: number;
  vice_committe_status: number;
  committe_nip: string;
  last_update_date: Date;
}

export interface ApplicationDetail {
  id_application: number;
  id_document: number;
  short_name: string;
  name_document: string;
  create_nip: string;
  create_name: string;
  create_date: Date;
  nakes_unit: string;
  nakes_unit_name: string;
  status_app: number;
  status_name: string;

  supervisor_nip: string;
  supervisor_name: string;
  supervisor_status: number;
  supervisor_note: string;

  head_of_installation_nip: string;
  head_of_installation_name: string;
  head_of_installation_status: number;
  head_of_installation_note: string;

  mitrabersari1_nip: string;
  mitrabersari1_name: string;
  mitrabersari2_nip: string;
  mitrabersari2_name: string;
  mitrabersari3_nip: string;
  mitrabersari3_name: string;
  mitrabersari_status: number;
  mitrabersari_note: string;

  vice_committe_nip: string;
  vice_committe_name: string;
  vice_committe_status: number;
  vice_committe_note: string;

  committe_nip: string;
  committe_name: string;
}

export interface AnswerOfEvaluation {
  id: number;
  target_nip: string;
  id_credentialNurce_Certificate: number;
  question_type: string;
  id_question: number;
  answer: number;
  create_nip: string;
  create_date: Date;
}

export interface LoginData {
  nip: string;
  nama: string;
  roles: number;
}

export interface EmployeesData {
  nip: string;
  nama: string;
  unit: string;
  profesi: string;
}

export interface LogActivity {
  table_name: string;
  idData: string;
  action_ontable: string;
  detail_action: string;
  accessLogin: string;
  date_create: Date;
}

export interface AccessData {
  nakes_nip: string;
  access: number;
  access_name: string;
  declaration: string;
  declaration_detail: string | null;
}
