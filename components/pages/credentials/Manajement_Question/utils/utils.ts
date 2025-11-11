// import { toRoman } from "roman-numerals";
// import {
//   ChapterQuestionSubQuestionRow,
//   Chapter,
//   AnswerOfEvaluation,
// } from "@/connection/interface";
// import { FUNCTION_MENU } from "../constants";

// export const numberToRoman = (num: number): string => {
//   return toRoman(num);
// };

// export const toLetter = (num: number): string => {
//   return String.fromCharCode(96 + num); // 'a', 'b', 'c', etc.
// };

// export const mapToNestedStructure = (
//   rows: ChapterQuestionSubQuestionRow[]
// ): Chapter[] => {
//   const chaptersMap = new Map<number, Chapter>();

//   rows.forEach((row) => {
//     // Get or create chapter
//     if (!chaptersMap.has(row.id_chapter)) {
//       chaptersMap.set(row.id_chapter, {
//         id_dokument: row.id_dokument,
//         id_chapter: row.id_chapter,
//         num_chapter: row.num_chapter,
//         chapter: row.chapter,
//         questions: [],
//       });
//     }

//     const chapter = chaptersMap.get(row.id_chapter)!;

//     // Handle question if it exists
//     if (row.id_question !== null) {
//       // Find existing question or create new one
//       let question = chapter.questions.find(
//         (q) => q.id_question === row.id_question
//       );
//       if (!question) {
//         question = {
//           id_question: row.id_question,
//           num_question: row.num_question,
//           question: row.question,
//           subQuestions: [],
//         };
//         chapter.questions.push(question);
//       }

//       // Handle sub-question if it exists
//       if (row.id_sub_question !== null) {
//         // Check if sub-question already exists to avoid duplicates
//         const existingSubQuestion = question.subQuestions.find(
//           (sq) => sq.id_sub_question === row.id_sub_question
//         );

//         if (!existingSubQuestion) {
//           question.subQuestions.push({
//             id_sub_question: row.id_sub_question,
//             num_sub_question: row.num_sub_question,
//             sub_question: row.sub_question,
//           });
//         }
//       }
//     }
//   });

//   return Array.from(chaptersMap.values());
// };

// export const setInitialAnswersFromData = (
//   answersData: AnswerOfEvaluation[],
//   function_menu: number,
//   nipLogin: string,
//   targetNip: string,
//   setters: {
//     setSelectedChapterPribadi: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//     setSelectedQuestionPribadi: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//     setSelectedSubQuestionPribadi: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//     setSelectedChapterMitrabersari: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//     setSelectedQuestionMitrabersari: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//     setSelectedSubQuestionMitrabersari: React.Dispatch<
//       React.SetStateAction<Record<number, number>>
//     >;
//   }
// ) => {
//   console.log("Processing answers with context:", {
//     answersData,
//     function_menu,
//     nipLogin,
//     targetNip,
//   });

//   const chapterPribadi: Record<number, number> = {};
//   const questionPribadi: Record<number, number> = {};
//   const subQuestionPribadi: Record<number, number> = {};
//   const chapterMitrabersari: Record<number, number> = {};
//   const questionMitrabersari: Record<number, number> = {};
//   const subQuestionMitrabersari: Record<number, number> = {};

//   answersData.forEach((answerItem) => {
//     const {
//       question_type,
//       id_question,
//       answer: selectedAnswer,
//       create_nip, // Evaluator NIP
//       target_nip, // Target NIP
//     } = answerItem;

//     console.log("Processing answer:", {
//       question_type,
//       id_question,
//       selectedAnswer,
//       create_nip,
//       target_nip,
//     });

//     // Determine if this is a personal evaluation or peer evaluation
//     const isPersonalEvaluation = create_nip === target_nip;
//     const isPeerEvaluation = create_nip !== target_nip;

//     // Process based on function menu and evaluation type
//     switch (function_menu) {
//       case FUNCTION_MENU.PERSONAL_EVAL: // Personal evaluation (function_menu = 3)
//         if (isPersonalEvaluation) {
//           // Only load personal answers for personal evaluation mode
//           if (question_type === "Chapter") {
//             chapterPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "Question") {
//             questionPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "SubQuestion") {
//             subQuestionPribadi[id_question] = selectedAnswer;
//           }
//         }
//         break;

//       case FUNCTION_MENU.MITRABERSARI_EVAL: // Peer evaluation (function_menu = 2)
//         if (isPersonalEvaluation) {
//           if (question_type === "Chapter") {
//             chapterPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "Question") {
//             questionPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "SubQuestion") {
//             subQuestionPribadi[id_question] = selectedAnswer;
//           }
//         } else if (isPeerEvaluation) {
//           // Only load peer answers from current evaluator for peer evaluation mode
//           if (question_type === "Chapter") {
//             chapterMitrabersari[id_question] = selectedAnswer;
//           } else if (question_type === "Question") {
//             questionMitrabersari[id_question] = selectedAnswer;
//           } else if (question_type === "SubQuestion") {
//             subQuestionMitrabersari[id_question] = selectedAnswer;
//           }
//         }
//         break;

//       // case FUNCTION_MENU.MITRABERSARI_EVAL: // Peer evaluation (function_menu = 2)
//       //   if (isPersonalEvaluation) {
//       //     // Load Nakes personal answers (left column - read-only)
//       //     if (question_type === "Chapter") {
//       //       chapterPribadi[id_question] = selectedAnswer;
//       //     } else if (question_type === "Question") {
//       //       questionPribadi[id_question] = selectedAnswer;
//       //     } else if (question_type === "SubQuestion") {
//       //       subQuestionPribadi[id_question] = selectedAnswer;
//       //     }
//       //   } else if (isPeerEvaluation) {
//       //     // ✅ NEW: Show any mitrabersari answer
//       //     // Priority 1: Current evaluator's answer
//       //     if (create_nip === nipLogin) {
//       //       if (question_type === "Chapter") {
//       //         chapterMitrabersari[id_question] = selectedAnswer;
//       //       } else if (question_type === "Question") {
//       //         questionMitrabersari[id_question] = selectedAnswer;
//       //       } else if (question_type === "SubQuestion") {
//       //         subQuestionMitrabersari[id_question] = selectedAnswer;
//       //       }
//       //     } else {
//       //       // Priority 2: Other mitrabersari's answer (only if current hasn't answered)
//       //       if (
//       //         question_type === "Chapter" &&
//       //         !chapterMitrabersari[id_question]
//       //       ) {
//       //         chapterMitrabersari[id_question] = selectedAnswer;
//       //       } else if (
//       //         question_type === "Question" &&
//       //         !questionMitrabersari[id_question]
//       //       ) {
//       //         questionMitrabersari[id_question] = selectedAnswer;
//       //       } else if (
//       //         question_type === "SubQuestion" &&
//       //         !subQuestionMitrabersari[id_question]
//       //       ) {
//       //         subQuestionMitrabersari[id_question] = selectedAnswer;
//       //       }
//       //     }
//       //   }
//       //   break;

//       case FUNCTION_MENU.KOMITE_VIEW_EVAL: // View evaluation (function_menu = 4)
//         // Load both personal and peer evaluations for viewing
//         if (isPersonalEvaluation) {
//           if (question_type === "Chapter") {
//             chapterPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "Question") {
//             questionPribadi[id_question] = selectedAnswer;
//           } else if (question_type === "SubQuestion") {
//             subQuestionPribadi[id_question] = selectedAnswer;
//           }
//         } else if (isPeerEvaluation) {
//           if (question_type === "Chapter") {
//             chapterMitrabersari[id_question] = selectedAnswer;
//           } else if (question_type === "Question") {
//             questionMitrabersari[id_question] = selectedAnswer;
//           } else if (question_type === "SubQuestion") {
//             subQuestionMitrabersari[id_question] = selectedAnswer;
//           }
//         }
//         break;

//       default:
//         console.log("Unknown function_menu:", function_menu);
//         break;
//     }
//   });

//   // Set all states with the loaded data
//   setters.setSelectedChapterPribadi(chapterPribadi);
//   setters.setSelectedQuestionPribadi(questionPribadi);
//   setters.setSelectedSubQuestionPribadi(subQuestionPribadi);
//   setters.setSelectedChapterMitrabersari(chapterMitrabersari);
//   setters.setSelectedQuestionMitrabersari(questionMitrabersari);
//   setters.setSelectedSubQuestionMitrabersari(subQuestionMitrabersari);

//   console.log("Final loaded answers:", {
//     chapterPribadi,
//     questionPribadi,
//     subQuestionPribadi,
//     chapterMitrabersari,
//     questionMitrabersari,
//     subQuestionMitrabersari,
//   });
// };

import { toRoman } from "roman-numerals";
import {
  ChapterQuestionSubQuestionRow,
  Chapter,
  AnswerOfEvaluation,
} from "@/connection/interface";
import { FUNCTION_MENU } from "../constants";

export const numberToRoman = (num: number): string => {
  return toRoman(num);
};

export const toLetter = (num: number): string => {
  return String.fromCharCode(96 + num);
};

export const mapToNestedStructure = (
  rows: ChapterQuestionSubQuestionRow[]
): Chapter[] => {
  const chaptersMap = new Map<number, Chapter>();

  rows.forEach((row) => {
    if (!chaptersMap.has(row.id_chapter)) {
      chaptersMap.set(row.id_chapter, {
        id_dokument: row.id_dokument,
        id_chapter: row.id_chapter,
        num_chapter: row.num_chapter,
        chapter: row.chapter,
        questions: [],
      });
    }

    const chapter = chaptersMap.get(row.id_chapter)!;

    if (row.id_question !== null) {
      let question = chapter.questions.find(
        (q) => q.id_question === row.id_question
      );
      if (!question) {
        question = {
          id_question: row.id_question,
          num_question: row.num_question,
          question: row.question,
          subQuestions: [],
        };
        chapter.questions.push(question);
      }

      if (row.id_sub_question !== null) {
        const existingSubQuestion = question.subQuestions.find(
          (sq) => sq.id_sub_question === row.id_sub_question
        );

        if (!existingSubQuestion) {
          question.subQuestions.push({
            id_sub_question: row.id_sub_question,
            num_sub_question: row.num_sub_question,
            sub_question: row.sub_question,
          });
        }
      }
    }
  });

  return Array.from(chaptersMap.values());
};

// Process answers to support shared mitrabersari answers
export const setInitialAnswersFromData = (
  answersData: AnswerOfEvaluation[],
  function_menu: number,
  nipLogin: string,
  targetNip: string,
  setters: {
    setSelectedChapterPribadi: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
    setSelectedQuestionPribadi: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
    setSelectedSubQuestionPribadi: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
    setSelectedChapterMitrabersari: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
    setSelectedQuestionMitrabersari: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
    setSelectedSubQuestionMitrabersari: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >;
  }
) => {
  console.log("📋 Processing answers with context:", {
    totalAnswers: answersData.length,
    function_menu,
    nipLogin,
    targetNip,
  });

  const chapterPribadi: Record<number, number> = {};
  const questionPribadi: Record<number, number> = {};
  const subQuestionPribadi: Record<number, number> = {};
  const chapterMitrabersari: Record<number, number> = {};
  const questionMitrabersari: Record<number, number> = {};
  const subQuestionMitrabersari: Record<number, number> = {};

  answersData.forEach((answerItem) => {
    const {
      question_type,
      id_question,
      answer: selectedAnswer,
      create_nip,
      target_nip,
    } = answerItem;

    const isPersonalEvaluation = create_nip === target_nip;
    const isPeerEvaluation = create_nip !== target_nip;

    switch (function_menu) {
      case FUNCTION_MENU.PERSONAL_EVAL:
        if (isPersonalEvaluation) {
          if (question_type === "Chapter") {
            chapterPribadi[id_question] = selectedAnswer;
          } else if (question_type === "Question") {
            questionPribadi[id_question] = selectedAnswer;
          } else if (question_type === "SubQuestion") {
            subQuestionPribadi[id_question] = selectedAnswer;
          }
        }
        break;

      case FUNCTION_MENU.MITRABERSARI_EVAL:
        if (isPersonalEvaluation) {
          // Load Nakes personal answers (left column - read-only)
          if (question_type === "Chapter") {
            chapterPribadi[id_question] = selectedAnswer;
          } else if (question_type === "Question") {
            questionPribadi[id_question] = selectedAnswer;
          } else if (question_type === "SubQuestion") {
            subQuestionPribadi[id_question] = selectedAnswer;
          }
        } else if (isPeerEvaluation) {
          // Load ANY mitrabersari answer (shared among all 3)
          // Priority: Latest answer or current evaluator's answer
          if (question_type === "Chapter") {
            // Only overwrite if it's from current user OR if not set yet
            if (create_nip === nipLogin || !chapterMitrabersari[id_question]) {
              chapterMitrabersari[id_question] = selectedAnswer;
            }
          } else if (question_type === "Question") {
            if (create_nip === nipLogin || !questionMitrabersari[id_question]) {
              questionMitrabersari[id_question] = selectedAnswer;
            }
          } else if (question_type === "SubQuestion") {
            if (
              create_nip === nipLogin ||
              !subQuestionMitrabersari[id_question]
            ) {
              subQuestionMitrabersari[id_question] = selectedAnswer;
            }
          }
        }
        break;

      case FUNCTION_MENU.KOMITE_VIEW_EVAL:
      case FUNCTION_MENU.NAKES_VIEW_EVAL:
      case FUNCTION_MENU.SUPERVISOR_VIEW_EVAL:
        if (isPersonalEvaluation) {
          if (question_type === "Chapter") {
            chapterPribadi[id_question] = selectedAnswer;
          } else if (question_type === "Question") {
            questionPribadi[id_question] = selectedAnswer;
          } else if (question_type === "SubQuestion") {
            subQuestionPribadi[id_question] = selectedAnswer;
          }
        } else if (isPeerEvaluation) {
          if (question_type === "Chapter") {
            chapterMitrabersari[id_question] = selectedAnswer;
          } else if (question_type === "Question") {
            questionMitrabersari[id_question] = selectedAnswer;
          } else if (question_type === "SubQuestion") {
            subQuestionMitrabersari[id_question] = selectedAnswer;
          }
        }
        break;
    }
  });

  console.log(" Final loaded answers:", {
    chapterPribadi: Object.keys(chapterPribadi).length,
    questionPribadi: Object.keys(questionPribadi).length,
    subQuestionPribadi: Object.keys(subQuestionPribadi).length,
    chapterMitrabersari: Object.keys(chapterMitrabersari).length,
    questionMitrabersari: Object.keys(questionMitrabersari).length,
    subQuestionMitrabersari: Object.keys(subQuestionMitrabersari).length,
  });

  setters.setSelectedChapterPribadi(chapterPribadi);
  setters.setSelectedQuestionPribadi(questionPribadi);
  setters.setSelectedSubQuestionPribadi(subQuestionPribadi);
  setters.setSelectedChapterMitrabersari(chapterMitrabersari);
  setters.setSelectedQuestionMitrabersari(questionMitrabersari);
  setters.setSelectedSubQuestionMitrabersari(subQuestionMitrabersari);
};
