// utils/tableUtils.ts
import { TableQuestionRow } from "../types";
import { Chapter } from "@/connection/interface";

export const flattenRowsForPagination = (
  chapters: Chapter[],
  expandedChapters: Set<number>,
  expandedQuestions: Set<number>,
  function_menu: number
): TableQuestionRow[] => {
  const rows: TableQuestionRow[] = [];

  chapters.forEach((chapter) => {
    // Add chapter row
    rows.push({
      id: `chapter-${chapter.id_chapter}`,
      type: "chapter",
      data: chapter,
      level: 0,
    });

    // Only add questions if chapter is expanded
    if (expandedChapters.has(chapter.id_chapter)) {
      chapter.questions.forEach((question) => {
        // Add question row
        rows.push({
          id: `question-${question.id_question}`,
          type: "question",
          data: { ...question, parentChapter: chapter },
          level: 1,
        });

        // Only add sub-questions if question is expanded
        if (
          question.id_question &&
          expandedQuestions.has(question.id_question)
        ) {
          question.subQuestions.forEach((subQuestion) => {
            // Add sub-question row
            rows.push({
              id: `subQuestion-${subQuestion.id_sub_question}`,
              type: "subQuestion",
              data: {
                ...subQuestion,
                parentQuestion: question,
                parentChapter: chapter,
              },
              level: 2,
            });
          });
        }
      });
    }
  });

  // Add note input row for function_menu === 2
  if (function_menu === 2) {
    rows.push({
      id: "note-input-row",
      type: "noteInput",
      data: {},
      level: 0,
    });
  }

  return rows;
};

export const getPaginatedRows = (
  allRows: TableQuestionRow[],
  currentPage: number,
  itemsPerPage: number
): TableQuestionRow[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allRows.slice(startIndex, endIndex);
};

export const calculateTotalPages = (
  totalRows: number,
  itemsPerPage: number
): number => {
  return Math.ceil(totalRows / itemsPerPage);
};
