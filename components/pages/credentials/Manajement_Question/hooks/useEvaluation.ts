// // useEvaluation.ts - Updated version
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// // NEW IMPORTS - Updated function names
// import {
//   view_credential_question_list,
//   PUT_chapter,
//   PUT_question,
//   PUT_subquestion,
//   PATCH_DELETE_chapter,
//   DELETE_question,
//   DELETE_subquestion_use_idquestion,
//   DELETE_subquestion,
// } from "@/connection/credentials/question";

// import {
//   GET_credential_answer,
//   POST_credential_answer,
// } from "@/connection/credentials/answer";

// import {
//   PUT_mitrabersari,
//   GET_DETAIL_credential_application,
// } from "@/connection/credentials/application";

// import { GetLoginCookie } from "@/function/cookie/loginData";
// import { EvaluationState } from "../types";
// import {
//   mapToNestedStructure,
//   setInitialAnswersFromData,
// } from "../utils/utils";
// import { FUNCTION_MENU } from "../constants";

// export const useEvaluation = (
//   id_document: number,
//   id_application: number,
//   function_menu: number,
//   target_nip: string, // NIP of person being evaluated
//   trigerParent: () => void
// ) => {
//   const [state, setState] = useState<EvaluationState>({
//     chapters: [],
//     answer: [],
//     noteRadio: 0,
//     noteText: "",
//     selectedChapterPribadi: {},
//     selectedQuestionPribadi: {},
//     selectedSubQuestionPribadi: {},
//     selectedChapterMitrabersari: {},
//     selectedQuestionMitrabersari: {},
//     selectedSubQuestionMitrabersari: {},
//     expandedChapters: new Set(),
//     expandedQuestions: new Set(),
//     currentPage: 1,
//     itemsPerPage: 20,
//     input: "",
//     cookieNip: "",
//   });

//   const [evaluatorNip, setEvaluatorNip] = useState("");

//   useEffect(() => {
//     getNip();
//   }, []);

//   const getNip = async () => {
//     const loginData = await GetLoginCookie();
//     const nip = loginData?.nip || "";
//     setEvaluatorNip(nip);
//     setState((prev) => ({ ...prev, cookieNip: nip }));
//   };

//   const setters = {
//     setChapters: (chapters: any) => setState((prev) => ({ ...prev, chapters })),
//     setAnswer: (answer: any) => setState((prev) => ({ ...prev, answer })),
//     setNoteRadio: (noteRadio: number) =>
//       setState((prev) => ({ ...prev, noteRadio })),
//     setNoteText: (noteText: string) =>
//       setState((prev) => ({ ...prev, noteText })),
//     setSelectedChapterPribadi: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedChapterPribadi:
//           typeof value === "function"
//             ? value(prev.selectedChapterPribadi)
//             : value,
//       })),
//     setSelectedQuestionPribadi: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedQuestionPribadi:
//           typeof value === "function"
//             ? value(prev.selectedQuestionPribadi)
//             : value,
//       })),
//     setSelectedSubQuestionPribadi: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedSubQuestionPribadi:
//           typeof value === "function"
//             ? value(prev.selectedSubQuestionPribadi)
//             : value,
//       })),
//     setSelectedChapterMitrabersari: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedChapterMitrabersari:
//           typeof value === "function"
//             ? value(prev.selectedChapterMitrabersari)
//             : value,
//       })),
//     setSelectedQuestionMitrabersari: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedQuestionMitrabersari:
//           typeof value === "function"
//             ? value(prev.selectedQuestionMitrabersari)
//             : value,
//       })),
//     setSelectedSubQuestionMitrabersari: (
//       value: React.SetStateAction<Record<number, number>>
//     ) =>
//       setState((prev) => ({
//         ...prev,
//         selectedSubQuestionMitrabersari:
//           typeof value === "function"
//             ? value(prev.selectedSubQuestionMitrabersari)
//             : value,
//       })),
//     setExpandedChapters: (expandedChapters: Set<number>) =>
//       setState((prev) => ({ ...prev, expandedChapters })),
//     setExpandedQuestions: (expandedQuestions: Set<number>) =>
//       setState((prev) => ({ ...prev, expandedQuestions })),
//     setCurrentPage: (currentPage: number) =>
//       setState((prev) => ({ ...prev, currentPage })),
//     setItemsPerPage: (itemsPerPage: number) =>
//       setState((prev) => ({ ...prev, itemsPerPage })),
//     setInput: (input: string) => setState((prev) => ({ ...prev, input })),
//     setCookieNip: (cookieNip: string) =>
//       setState((prev) => ({ ...prev, cookieNip })),
//   };

//   // Load Questions
//   const getData = async () => {
//     try {
//       const database = await view_credential_question_list(id_document);
//       if (!database || database.length === 0) {
//         toast.error("Database Masih Kosong");
//       } else {
//         const transformedData = mapToNestedStructure(database);
//         setters.setChapters(transformedData);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Gagal memuat pertanyaan");
//     }
//   };

//   // Load Answers
//   const getAnswer = async () => {
//     try {
//       console.log("🔍 getAnswer called with:", {
//         evaluatorNip,
//         target_nip,
//         function_menu,
//         id_application,
//       });
//       console.log("Loading answers for application:", id_application);
//       const database = await GET_credential_answer(id_application);
//       console.log("Raw answer data:", database);

//       if (!database || database.length === 0) {
//         console.log("No answers found in database");
//         setters.setAnswer([]);
//         return;
//       }

//       // Filter based on function_menu
//       let filteredAnswers = database;

//       switch (function_menu) {
//         case FUNCTION_MENU.PERSONAL_EVAL: // Personal evaluation
//           filteredAnswers = database.filter(
//             (answer: any) =>
//               answer.create_nip === target_nip &&
//               answer.target_nip === target_nip
//           );
//           break;

//         case FUNCTION_MENU.MITRABERSARI_EVAL: // Peer evaluation
//           filteredAnswers = database.filter(
//             (answer: any) =>
//               // Personal answers (read-only)
//               (answer.create_nip === target_nip &&
//                 answer.target_nip === target_nip) ||
//               // Peer answers by current evaluator (editable)
//               // ALL Peer answers (from all 3 mitrabersari)
//               (answer.create_nip !== target_nip &&
//                 answer.nip_target === target_nip)
//           );
//           break;

//         case FUNCTION_MENU.KOMITE_VIEW_EVAL: // View all
//           filteredAnswers = database.filter(
//             (answer: any) => answer.target_nip === target_nip
//           );
//           break;

//         default:
//           filteredAnswers = [];
//       }

//       setters.setAnswer(filteredAnswers);
//     } catch (error) {
//       console.error("Error loading answers:", error);
//       setters.setAnswer([]);
//     }
//   };

//   // Handle Note Radio Change
//   const handleNoteRadioChange = (value: number) => {
//     setters.setNoteRadio(value);
//     if (value === 1 || value === 3) {
//       setters.setNoteText("");
//     }
//   };

//   // Save Evaluation (for Mitrabersari)
//   const handleSaveEval = async () => {
//     try {
//       const response = await PUT_mitrabersari(
//         id_application,
//         evaluatorNip,
//         state.noteRadio,
//         state.noteText,
//         6
//       );

//       if (response) {
//         if (state.noteRadio === 1) {
//           toast.success("Evaluasi selesai - Petugas Medis Dinyatakan LOLOS");
//         } else if (state.noteRadio === 2) {
//           toast.success("Evaluasi selesai - LOLOS dengan Catatan");
//         } else if (state.noteRadio === 3) {
//           toast.success("Evaluasi selesai - Petugas Medis Dinyatakan GAGAL");
//         } else {
//           toast.success("Evaluasi Selesai");
//         }
//         trigerParent();
//       } else {
//         toast.error("Gagal menyimpan evaluasi");
//       }
//     } catch (error) {
//       console.error("Error saving evaluation:", error);
//       toast.error("Gagal menyimpan evaluasi");
//     }
//   };

//   // CRUD Operations
//   const handleUpdate = async (id: number, text: string, location: string) => {
//     let result = null;
//     try {
//       if (location === "chapter") {
//         result = await PUT_chapter(id, 0, text); // number parameter might need adjustment
//       } else if (location === "question") {
//         result = await PUT_question(id, 0, text);
//       } else if (location === "subQuestion") {
//         result = await PUT_subquestion(id, 0, text);
//       }

//       if (result !== null) {
//         toast.success("Success Update");
//       } else {
//         toast.error("Gagal Update");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error("Gagal Update");
//     }
//     trigerParent();
//     getData();
//   };

//   const handleDelete = async (id: number, location: string) => {
//     let result = null;
//     try {
//       if (location === "chapter") {
//         result = await PATCH_DELETE_chapter(id);
//       } else if (location === "question") {
//         await DELETE_subquestion_use_idquestion(id);
//         result = await DELETE_question(id);
//       } else if (location === "subQuestion") {
//         result = await DELETE_subquestion(id);
//       }

//       if (result !== null) {
//         toast.success("Success Delete");
//       } else {
//         toast.error("Gagal Delete");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Gagal Delete");
//     }
//     trigerParent();
//     getData();
//   };

//   // Answer Handlers with UPSERT logic
//   const createAnswerHandler =
//     (type: string, isPersonal: boolean) =>
//     async (id: number, optionId: number) => {
//       const setter = isPersonal
//         ? type === "Chapter"
//           ? setters.setSelectedChapterPribadi
//           : type === "Question"
//           ? setters.setSelectedQuestionPribadi
//           : setters.setSelectedSubQuestionPribadi
//         : type === "Chapter"
//         ? setters.setSelectedChapterMitrabersari
//         : type === "Question"
//         ? setters.setSelectedQuestionMitrabersari
//         : setters.setSelectedSubQuestionMitrabersari;

//       setter((prev: Record<number, number>) => ({
//         ...prev,
//         [id]: optionId,
//       }));

//       try {
//         await POST_credential_answer(
//           id_application,
//           target_nip,
//           type,
//           id,
//           optionId
//         );
//         trigerParent();
//         console.log(`Answer saved: ${type} ${id} = ${optionId}`);
//       } catch (error) {
//         console.error(`Error Answer ${type}:`, error);
//         toast.error("Gagal menyimpan jawaban");
//       }
//     };

//   // Load note status
//   const getNoteStatus = async () => {
//     try {
//       const statusData = await GET_DETAIL_credential_application(
//         id_application
//       );

//       if (statusData && statusData.length > 0) {
//         const status = statusData[0];
//         setters.setNoteRadio(status.mitrabersari_status || 0);
//         setters.setNoteText(status.mitrabersari_note || "");
//       }
//     } catch (error) {
//       console.error("Error loading note status:", error);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     if (
//       evaluatorNip &&
//       function_menu !== FUNCTION_MENU.UPDATE_DELETE &&
//       function_menu !== FUNCTION_MENU.VIEW_QUESTION
//     ) {
//       getAnswer();

//       if (function_menu === FUNCTION_MENU.MITRABERSARI_EVAL) {
//         getNoteStatus();
//       }
//     }
//   }, [evaluatorNip, function_menu, target_nip, id_document, id_application]);

//   useEffect(() => {
//     setters.setCurrentPage(1);
//   }, [state.expandedChapters, state.expandedQuestions]);

//   useEffect(() => {
//     if (state.chapters.length > 0) {
//       type Question = { id_question: number | null };
//       type Chapter = { id_chapter: number; questions: Question[] };

//       const allChapterIds = new Set(
//         state.chapters.map((chapter: Chapter) => chapter.id_chapter)
//       );
//       setters.setExpandedChapters(allChapterIds);

//       const allQuestionIds = new Set(
//         state.chapters.flatMap((chapter: Chapter) =>
//           chapter.questions
//             .filter((question: Question) => question.id_question !== null)
//             .map((question: Question) => question.id_question!)
//         )
//       );
//       setters.setExpandedQuestions(allQuestionIds);
//     }
//   }, [state.chapters]);

//   useEffect(() => {
//     if (state.answer && state.answer.length > 0) {
//       setInitialAnswersFromData(
//         state.answer,
//         function_menu,
//         evaluatorNip,
//         target_nip,
//         {
//           setSelectedChapterPribadi: setters.setSelectedChapterPribadi,
//           setSelectedQuestionPribadi: setters.setSelectedQuestionPribadi,
//           setSelectedSubQuestionPribadi: setters.setSelectedSubQuestionPribadi,
//           setSelectedChapterMitrabersari:
//             setters.setSelectedChapterMitrabersari,
//           setSelectedQuestionMitrabersari:
//             setters.setSelectedQuestionMitrabersari,
//           setSelectedSubQuestionMitrabersari:
//             setters.setSelectedSubQuestionMitrabersari,
//         }
//       );
//     } else {
//       setters.setSelectedChapterPribadi({});
//       setters.setSelectedQuestionPribadi({});
//       setters.setSelectedSubQuestionPribadi({});
//       setters.setSelectedChapterMitrabersari({});
//       setters.setSelectedQuestionMitrabersari({});
//       setters.setSelectedSubQuestionMitrabersari({});
//     }
//   }, [state.answer, evaluatorNip, target_nip, function_menu]);

//   return {
//     state,
//     setters,
//     handlers: {
//       handleNoteRadioChange,
//       handleSaveEval,
//       handleUpdate,
//       handleDelete,
//       handleChapterPenilaianPribadi: createAnswerHandler("Chapter", true),
//       handleQuestionPenilaianPribadi: createAnswerHandler("Question", true),
//       handleSubQuestionPenilaianPribadi: createAnswerHandler(
//         "SubQuestion",
//         true
//       ),
//       handleChapterPenilaianMitrabersari: createAnswerHandler("Chapter", false),
//       handleQuestionPenilaianMitrabersari: createAnswerHandler(
//         "Question",
//         false
//       ),
//       handleSubQuestionPenilaianMitrabersari: createAnswerHandler(
//         "SubQuestion",
//         false
//       ),
//     },
//     actions: {
//       getData,
//       getAnswer,
//     },
//   };
// };

// useEvaluation.ts - Fixed version for shared mitrabersari answers
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  view_credential_question_list,
  PUT_chapter,
  PUT_question,
  PUT_subquestion,
  PATCH_DELETE_chapter,
  DELETE_question,
  DELETE_subquestion_use_idquestion,
  DELETE_subquestion,
} from "@/connection/credentials/question";

import {
  GET_credential_answer,
  POST_credential_answer,
} from "@/connection/credentials/answer";

import {
  PUT_mitrabersari,
  GET_DETAIL_credential_application,
} from "@/connection/credentials/application";

import { GetLoginCookie } from "@/function/cookie/loginData";
import { EvaluationState } from "../types";
import {
  mapToNestedStructure,
  setInitialAnswersFromData,
} from "../utils/utils";
import { FUNCTION_MENU } from "../constants";

export const useEvaluation = (
  id_document: number,
  id_application: number,
  function_menu: number,
  target_nip: string,
  trigerParent: () => void
) => {
  const [state, setState] = useState<EvaluationState>({
    chapters: [],
    answer: [],
    noteRadio: 0,
    noteText: "",
    selectedChapterPribadi: {},
    selectedQuestionPribadi: {},
    selectedSubQuestionPribadi: {},
    selectedChapterMitrabersari: {},
    selectedQuestionMitrabersari: {},
    selectedSubQuestionMitrabersari: {},
    expandedChapters: new Set(),
    expandedQuestions: new Set(),
    currentPage: 1,
    itemsPerPage: 20,
    input: "",
    inputNumber: 0,
    cookieNip: "",
  });

  const [evaluatorNip, setEvaluatorNip] = useState("");
  const [inputNumber, setInputNumber] = useState(0);

  useEffect(() => {
    getNip();
  }, []);

  const getNip = async () => {
    const loginData = await GetLoginCookie();
    const nip = loginData?.nip || "";
    setEvaluatorNip(nip);
    setState((prev) => ({ ...prev, cookieNip: nip }));
  };

  const setters = {
    setChapters: (chapters: any) => setState((prev) => ({ ...prev, chapters })),
    setInputNumber: (inputNumber: number) =>
      setState((prev) => ({ ...prev, inputNumber })),
    setAnswer: (answer: any) => setState((prev) => ({ ...prev, answer })),
    setNoteRadio: (noteRadio: number) =>
      setState((prev) => ({ ...prev, noteRadio })),
    setNoteText: (noteText: string) =>
      setState((prev) => ({ ...prev, noteText })),
    setSelectedChapterPribadi: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedChapterPribadi:
          typeof value === "function"
            ? value(prev.selectedChapterPribadi)
            : value,
      })),
    setSelectedQuestionPribadi: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedQuestionPribadi:
          typeof value === "function"
            ? value(prev.selectedQuestionPribadi)
            : value,
      })),
    setSelectedSubQuestionPribadi: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedSubQuestionPribadi:
          typeof value === "function"
            ? value(prev.selectedSubQuestionPribadi)
            : value,
      })),
    setSelectedChapterMitrabersari: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedChapterMitrabersari:
          typeof value === "function"
            ? value(prev.selectedChapterMitrabersari)
            : value,
      })),
    setSelectedQuestionMitrabersari: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedQuestionMitrabersari:
          typeof value === "function"
            ? value(prev.selectedQuestionMitrabersari)
            : value,
      })),
    setSelectedSubQuestionMitrabersari: (
      value: React.SetStateAction<Record<number, number>>
    ) =>
      setState((prev) => ({
        ...prev,
        selectedSubQuestionMitrabersari:
          typeof value === "function"
            ? value(prev.selectedSubQuestionMitrabersari)
            : value,
      })),
    setExpandedChapters: (expandedChapters: Set<number>) =>
      setState((prev) => ({ ...prev, expandedChapters })),
    setExpandedQuestions: (expandedQuestions: Set<number>) =>
      setState((prev) => ({ ...prev, expandedQuestions })),
    setCurrentPage: (currentPage: number) =>
      setState((prev) => ({ ...prev, currentPage })),
    setItemsPerPage: (itemsPerPage: number) =>
      setState((prev) => ({ ...prev, itemsPerPage })),
    setInput: (input: string) => setState((prev) => ({ ...prev, input })),
    setCookieNip: (cookieNip: string) =>
      setState((prev) => ({ ...prev, cookieNip })),
  };

  const getData = async () => {
    try {
      const database = await view_credential_question_list(id_document);
      if (!database || database.length === 0) {
        toast.error("Database Masih Kosong");
      } else {
        const transformedData = mapToNestedStructure(database);
        setters.setChapters(transformedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat pertanyaan");
    }
  };

  // 🔧 FIXED: Load Answers with proper filtering
  const getAnswer = async () => {
    try {
      console.log("🔍 getAnswer called with:", {
        evaluatorNip,
        target_nip,
        function_menu,
        id_application,
      });

      const database = await GET_credential_answer(id_application);
      console.log("Raw answer data:", database);

      if (!database || database.length === 0) {
        console.log("No answers found in database");
        setters.setAnswer([]);
        return;
      }

      let filteredAnswers = database;

      switch (function_menu) {
        case FUNCTION_MENU.PERSONAL_EVAL:
          filteredAnswers = database.filter(
            (answer: any) =>
              answer.create_nip === target_nip &&
              answer.target_nip === target_nip
          );
          break;

        case FUNCTION_MENU.MITRABERSARI_EVAL:
          // ✅ Show personal answers (read-only) AND any mitrabersari answer
          filteredAnswers = database.filter(
            (answer: any) => answer.target_nip === target_nip // Only answers for this target
          );
          console.log("📊 Filtered mitrabersari answers:", filteredAnswers);
          break;

        case FUNCTION_MENU.KOMITE_VIEW_EVAL:
        case FUNCTION_MENU.NAKES_VIEW_EVAL:
        case FUNCTION_MENU.SUPERVISOR_VIEW_EVAL:
          filteredAnswers = database.filter(
            (answer: any) => answer.target_nip === target_nip
          );
          break;

        default:
          filteredAnswers = [];
      }

      console.log("✅ Setting filtered answers:", filteredAnswers);
      setters.setAnswer(filteredAnswers);
    } catch (error) {
      console.error("Error loading answers:", error);
      setters.setAnswer([]);
    }
  };

  const handleNoteRadioChange = (value: number) => {
    setters.setNoteRadio(value);
    if (value === 1 || value === 3) {
      setters.setNoteText("");
    }
  };

  const handleSaveEval = async () => {
    try {
      const response = await PUT_mitrabersari(
        id_application,
        evaluatorNip,
        state.noteRadio,
        state.noteText,
        6
      );

      if (response) {
        if (state.noteRadio === 1) {
          toast.success("Evaluasi selesai - Petugas Medis Dinyatakan LOLOS");
        } else if (state.noteRadio === 2) {
          toast.success("Evaluasi selesai - LOLOS dengan Catatan");
        } else if (state.noteRadio === 3) {
          toast.success("Evaluasi selesai - Petugas Medis Dinyatakan GAGAL");
        } else {
          toast.success("Evaluasi Selesai");
        }
        trigerParent();
      } else {
        toast.error("Gagal menyimpan evaluasi");
      }
    } catch (error) {
      console.error("Error saving evaluation:", error);
      toast.error("Gagal menyimpan evaluasi");
    }
  };

  const handleUpdate = async (
    id: number,
    text: string,
    location: string,
    number: number
  ) => {
    let result = null;
    try {
      if (location === "chapter") {
        result = await PUT_chapter(id, number, text);
      } else if (location === "question") {
        result = await PUT_question(id, number, text);
      } else if (location === "subQuestion") {
        result = await PUT_subquestion(id, number, text);
      }

      if (result !== null) {
        toast.success("Success Update");
      } else {
        toast.error("Gagal Update");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Gagal Update");
    }
    trigerParent();
    getData();
  };

  const handleDelete = async (id: number, location: string) => {
    let result = null;
    try {
      if (location === "chapter") {
        result = await PATCH_DELETE_chapter(id);
      } else if (location === "question") {
        await DELETE_subquestion_use_idquestion(id);
        result = await DELETE_question(id);
      } else if (location === "subQuestion") {
        result = await DELETE_subquestion(id);
      }

      if (result !== null) {
        toast.success("Success Delete");
      } else {
        toast.error("Gagal Delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal Delete");
    }
    trigerParent();
    getData();
  };

  // ✅ Answer handlers that will UPSERT (shared among mitrabersari)
  const createAnswerHandler =
    (type: string, isPersonal: boolean) =>
    async (id: number, optionId: number) => {
      const setter = isPersonal
        ? type === "Chapter"
          ? setters.setSelectedChapterPribadi
          : type === "Question"
          ? setters.setSelectedQuestionPribadi
          : setters.setSelectedSubQuestionPribadi
        : type === "Chapter"
        ? setters.setSelectedChapterMitrabersari
        : type === "Question"
        ? setters.setSelectedQuestionMitrabersari
        : setters.setSelectedSubQuestionMitrabersari;

      // Optimistic update
      setter((prev: Record<number, number>) => ({
        ...prev,
        [id]: optionId,
      }));

      try {
        await POST_credential_answer(
          id_application,
          target_nip,
          type,
          id,
          optionId
        );
        trigerParent();
        console.log(`✅ Answer saved: ${type} ${id} = ${optionId}`);
      } catch (error) {
        console.error(`❌ Error saving ${type}:`, error);
        toast.error("Gagal menyimpan jawaban");
        // Revert optimistic update on error
        getAnswer();
      }
    };

  const getNoteStatus = async () => {
    try {
      const statusData = await GET_DETAIL_credential_application(
        id_application
      );

      if (statusData && statusData.length > 0) {
        const status = statusData[0];
        setters.setNoteRadio(status.mitrabersari_status || 0);
        setters.setNoteText(status.mitrabersari_note || "");
      }
    } catch (error) {
      console.error("Error loading note status:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (
      evaluatorNip &&
      function_menu !== FUNCTION_MENU.UPDATE_DELETE &&
      function_menu !== FUNCTION_MENU.VIEW_QUESTION
    ) {
      getAnswer();

      if (function_menu === FUNCTION_MENU.MITRABERSARI_EVAL) {
        getNoteStatus();
      }
    }
  }, [evaluatorNip, function_menu, target_nip, id_document, id_application]);

  useEffect(() => {
    setters.setCurrentPage(1);
  }, [state.expandedChapters, state.expandedQuestions]);

  useEffect(() => {
    if (state.chapters.length > 0) {
      type Question = { id_question: number | null };
      type Chapter = { id_chapter: number; questions: Question[] };

      const allChapterIds = new Set(
        state.chapters.map((chapter: Chapter) => chapter.id_chapter)
      );
      setters.setExpandedChapters(allChapterIds);

      const allQuestionIds = new Set(
        state.chapters.flatMap((chapter: Chapter) =>
          chapter.questions
            .filter((question: Question) => question.id_question !== null)
            .map((question: Question) => question.id_question!)
        )
      );
      setters.setExpandedQuestions(allQuestionIds);
    }
  }, [state.chapters]);

  useEffect(() => {
    console.log("🔄 Answer data changed, processing...", {
      answerLength: state.answer.length,
      evaluatorNip,
      target_nip,
    });

    if (state.answer && state.answer.length > 0) {
      setInitialAnswersFromData(
        state.answer,
        function_menu,
        evaluatorNip,
        target_nip,
        {
          setSelectedChapterPribadi: setters.setSelectedChapterPribadi,
          setSelectedQuestionPribadi: setters.setSelectedQuestionPribadi,
          setSelectedSubQuestionPribadi: setters.setSelectedSubQuestionPribadi,
          setSelectedChapterMitrabersari:
            setters.setSelectedChapterMitrabersari,
          setSelectedQuestionMitrabersari:
            setters.setSelectedQuestionMitrabersari,
          setSelectedSubQuestionMitrabersari:
            setters.setSelectedSubQuestionMitrabersari,
        }
      );
    } else {
      setters.setSelectedChapterPribadi({});
      setters.setSelectedQuestionPribadi({});
      setters.setSelectedSubQuestionPribadi({});
      setters.setSelectedChapterMitrabersari({});
      setters.setSelectedQuestionMitrabersari({});
      setters.setSelectedSubQuestionMitrabersari({});
    }
  }, [state.answer, evaluatorNip, target_nip, function_menu]);

  return {
    state,
    setters,
    handlers: {
      handleNoteRadioChange,
      handleSaveEval,
      handleUpdate,
      handleDelete,
      handleChapterPenilaianPribadi: createAnswerHandler("Chapter", true),
      handleQuestionPenilaianPribadi: createAnswerHandler("Question", true),
      handleSubQuestionPenilaianPribadi: createAnswerHandler(
        "SubQuestion",
        true
      ),
      handleChapterPenilaianMitrabersari: createAnswerHandler("Chapter", false),
      handleQuestionPenilaianMitrabersari: createAnswerHandler(
        "Question",
        false
      ),
      handleSubQuestionPenilaianMitrabersari: createAnswerHandler(
        "SubQuestion",
        false
      ),
    },
    actions: {
      getData,
      getAnswer,
    },
  };
};
