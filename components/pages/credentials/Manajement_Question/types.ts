// types.ts
import { Chapter, AnswerOfEvaluation } from "@/connection/interface";

export type TableQuestionRow =
  | {
      id: string;
      type: "chapter";
      data: Chapter;
      level: number;
    }
  | {
      id: string;
      type: "question";
      data: any;
      level: number;
    }
  | {
      id: string;
      type: "subQuestion";
      data: any;
      level: number;
    }
  | {
      id: string;
      type: "noteInput";
      data: any;
      level: number;
    };

export interface PageProps {
  nip: string;
  documment: number;
  credentialApplication: number;
  function_menu: number;
  trigerParent: () => void;
}

export interface EvaluationState {
  chapters: Chapter[];
  answer: AnswerOfEvaluation[];
  noteRadio: number;
  noteText: string;
  selectedChapterPribadi: Record<number, number>;
  selectedQuestionPribadi: Record<number, number>;
  selectedSubQuestionPribadi: Record<number, number>;
  selectedChapterMitrabersari: Record<number, number>;
  selectedQuestionMitrabersari: Record<number, number>;
  selectedSubQuestionMitrabersari: Record<number, number>;
  expandedChapters: Set<number>;
  expandedQuestions: Set<number>;
  currentPage: number;
  itemsPerPage: number;
  input: string;
  inputNumber: number;
  cookieNip: string;
}
