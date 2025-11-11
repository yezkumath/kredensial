import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronDown, Pencil, Trash } from "lucide-react";
import { numberToRoman, toLetter } from "../utils/utils";
import { PENILAIAN_MITRABERSARI, PENILAIAN_PRIBADI } from "../constants";

interface ChapterRowProps {
  chapter: any;
  expandedChapters: Set<number>;
  function_menu: number;
  selectedChapterPribadi: Record<number, number>;
  selectedChapterMitrabersari: Record<number, number>;
  input: string;
  inputNumber: number;
  onToggleChapter: (id: number) => void;
  onSetInput: (value: string) => void;
  onUpdate: (
    id: number,
    text: string,
    location: string,
    inputNumber: number
  ) => void;
  onDelete: (id: number, location: string) => void;
  onChapterPenilaianPribadi: (id: number, optionId: number) => void;
  onChapterPenilaianMitrabersari: (id: number, optionId: number) => void;
  onSetInputNumber: (value: number) => void;
}

export const ChapterRow: React.FC<ChapterRowProps> = ({
  chapter,
  expandedChapters,
  function_menu,
  selectedChapterPribadi,
  selectedChapterMitrabersari,
  input,
  inputNumber,
  onToggleChapter,
  onSetInput,
  onUpdate,
  onDelete,
  onChapterPenilaianPribadi,
  onChapterPenilaianMitrabersari,
  onSetInputNumber,
}) => {
  //- IDENTIFY IF Chapter HAS Question if has it return 1 ? not return 0
  const hasQuestions = chapter.questions.length > 0;

  const renderActionCell = () => {
    switch (function_menu) {
      case 6: // Alredy answer Nakes
        if (hasQuestions) return null; // <-- This line prevents actions if chapter has Question
        return (
          <TableCell className="bg-green-50">
            {/* PRIBADI */}
            <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
              {selectedChapterPribadi[chapter.id_chapter] === 4 ? 4 : 3}
            </div>
          </TableCell>
        );

      case 5: // Alredy Answer Nakes & Mitrabersari
        if (hasQuestions) return null; // <-- This line prevents actions if chapter has Question
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {selectedChapterPribadi[chapter.id_chapter] === 4 ? 1 : 2}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {selectedChapterMitrabersari[chapter.id_chapter]}
              </div>
            </TableCell>
          </>
        );

      case 4: // View evaluation
        if (hasQuestions) return null; // <-- This line prevents actions if chapter has Question
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {selectedChapterPribadi[chapter.id_chapter] === 4 ? 4 : 3}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {selectedChapterMitrabersari[chapter.id_chapter]}
              </div>
            </TableCell>
          </>
        );

      case 3: // Personal evaluation
        if (hasQuestions) return null; // <-- This line prevents actions if has child
        return (
          <TableCell>
            {PENILAIAN_PRIBADI.map((option) => (
              <button
                key={`chapter-${option.id}`}
                onClick={() =>
                  onChapterPenilaianPribadi(chapter.id_chapter, option.id)
                }
                className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    selectedChapterPribadi[chapter.id_chapter] === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {option.id}
              </button>
            ))}
          </TableCell>
        );
      case 2: // Peer evaluation
        if (hasQuestions) return null; // <-- This line prevents actions if has child
        return (
          <>
            <TableCell className="bg-green-50 border-r-2 border-green-400">
              {PENILAIAN_PRIBADI.map((option) => (
                <button
                  key={`chapter-${option.id}`}
                  className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                    ${
                      selectedChapterPribadi[chapter.id_chapter] === option.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-200 "
                    }`}
                >
                  {option.id}
                </button>
              ))}
            </TableCell>

            <TableCell colSpan={3} className="bg-yellow-50">
              <div className=" flex flex-row justify-center items-center">
                {PENILAIAN_MITRABERSARI.map((option) => (
                  <button
                    key={`chapter-${option.id}`}
                    onClick={() =>
                      onChapterPenilaianMitrabersari(
                        chapter.id_chapter,
                        option.id
                      )
                    }
                    className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    selectedChapterMitrabersari[chapter.id_chapter] ===
                    option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  >
                    {option.id}
                  </button>
                ))}
              </div>
            </TableCell>
          </>
        );
      case 1: // Update/Delete
        return (
          <TableCell className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-yellow-400"
                  onClick={() => {
                    onSetInput(chapter.chapter),
                      onSetInputNumber(chapter.num_chapter);
                  }}
                >
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>UPDATE pertanyaan</DialogTitle>
                  <DialogDescription>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="w-20"
                        value={inputNumber}
                        onChange={(e) =>
                          onSetInputNumber(Number(e.target.value))
                        }
                      />
                      <Input
                        value={input}
                        onChange={(e) => onSetInput(e.target.value)}
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogClose asChild>
                  <Button
                    className="bg-green-500"
                    onClick={() =>
                      onUpdate(
                        chapter.id_chapter,
                        input,
                        "chapter",
                        inputNumber
                      )
                    }
                  >
                    Submit
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant={"destructive"}>Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-bold text-red-400">
                    DELETE PERTANYAAN
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-black">
                      Semua{" "}
                      <span className="font-bold">
                        Pertanyaan dan Sub Pertanyaan
                      </span>{" "}
                      yang ada di halaman ini akan ikut di hapus
                    </p>
                    <p className="font-bold text-lg text-center text-black">
                      Apakah anda yakin?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant={"destructive"}
                  onClick={async () =>
                    await onDelete(chapter.id_chapter, "chapter")
                  }
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </TableCell>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow className="bg-gray-50 hover:bg-blue-200 transition-all duration-150">
      <TableCell className="w-10 font-bold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleChapter(chapter.id_chapter)}
            className="p-1 hover:bg-gray-200 rounded"
            disabled={!hasQuestions}
          >
            {chapter.questions.length > 0 ? (
              expandedChapters.has(chapter.id_chapter) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : null}
          </button>
          {numberToRoman(chapter.num_chapter)}
        </div>
      </TableCell>
      <TableCell colSpan={3} className="font-bold w-full">
        {chapter.chapter}
      </TableCell>
      {renderActionCell()}
    </TableRow>
  );
};

// Question Row Component
interface QuestionRowProps {
  question: any;
  expandedQuestions: Set<number>;
  function_menu: number;
  selectedQuestionPribadi: Record<number, number>;
  selectedQuestionMitrabersari: Record<number, number>;
  input: string;
  inputNumber: number;
  onToggleQuestion: (id: number) => void;
  onSetInput: (value: string) => void;
  onUpdate: (
    id: number,
    text: string,
    location: string,
    inputNumber: number
  ) => void;
  onDelete: (id: number, location: string) => void;
  onQuestionPenilaianPribadi: (id: number, optionId: number) => void;
  onQuestionPenilaianMitrabersari: (id: number, optionId: number) => void;
  onSetInputNumber: (value: number) => void;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  expandedQuestions,
  function_menu,
  selectedQuestionPribadi,
  selectedQuestionMitrabersari,
  input,
  inputNumber,
  onToggleQuestion,
  onSetInput,
  onUpdate,
  onDelete,
  onQuestionPenilaianPribadi,
  onQuestionPenilaianMitrabersari,
  onSetInputNumber,
}) => {
  // if question has subqustion then it return 1 if not return 0
  const hasSubQuestions = question.subQuestions.length > 0;

  const renderActionCell = () => {
    switch (function_menu) {
      case 6: // Alredy answer Nakes
        if (hasSubQuestions) return null; // <-- This line prevents actions if Question has SubQuestion
        return (
          <TableCell className="bg-green-50">
            {/* PRIBADI */}
            <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
              {question.id_question &&
              selectedQuestionPribadi[question.id_question] === 4
                ? 4
                : 3}
            </div>
          </TableCell>
        );

      case 5: // Alredy Answer Nakes & Mitrabersari
        if (hasSubQuestions) return null; // <-- This line prevents actions if Question has SubQuestion
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {question.id_question &&
                selectedQuestionPribadi[question.id_question] === 4
                  ? 1
                  : 2}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {question.id_question &&
                  selectedQuestionMitrabersari[question.id_question]}
              </div>
            </TableCell>
          </>
        );

      case 4: // View evaluation
        if (hasSubQuestions) return null; // <-- This line prevents actions if Question has SubQuestion
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {question.id_question &&
                selectedQuestionPribadi[question.id_question] === 4
                  ? 4
                  : 3}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {question.id_question &&
                  selectedQuestionMitrabersari[question.id_question]}
              </div>
            </TableCell>
          </>
        );

      case 3: // Personal evaluation
        if (hasSubQuestions) return null; // <-- This line prevents actions if Question has SubQuestion
        return (
          <TableCell>
            {PENILAIAN_PRIBADI.map((option) => (
              <button
                key={`question-${option.id}`}
                onClick={() =>
                  onQuestionPenilaianPribadi(
                    question.id_question || -1,
                    option.id
                  )
                }
                className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    question.id_question &&
                    selectedQuestionPribadi[question.id_question] === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {option.id}
              </button>
            ))}
          </TableCell>
        );
      case 2: // Peer evaluation
        if (hasSubQuestions) return null; // <-- This line prevents actions if Question has SubQuestion
        return (
          <>
            <TableCell className="bg-green-50 border-r-2 border-green-400">
              {PENILAIAN_PRIBADI.map((option) => (
                <button
                  key={`question-${option.id}`}
                  className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                    ${
                      question.id_question &&
                      selectedQuestionPribadi[question.id_question] ===
                        option.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-200"
                    }`}
                >
                  {option.id}
                </button>
              ))}
            </TableCell>
            <TableCell colSpan={3} className="bg-yellow-50">
              <div className=" flex flex-row justify-center items-center">
                {PENILAIAN_MITRABERSARI.map((option) => (
                  <button
                    key={`question-${option.id}`}
                    onClick={() =>
                      onQuestionPenilaianMitrabersari(
                        question.id_question || -1,
                        option.id
                      )
                    }
                    className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    question.id_question &&
                    selectedQuestionMitrabersari[question.id_question] ===
                      option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  >
                    {option.id}
                  </button>
                ))}
              </div>
            </TableCell>
          </>
        );
      case 1: // Update/Delete
        return (
          <TableCell className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-yellow-400"
                  onClick={() => {
                    onSetInput(question.question || ""),
                      onSetInputNumber(question.num_question || 0);
                  }}
                >
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>UPDATE PERTANYAAN</DialogTitle>
                  <DialogDescription>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="w-20"
                        value={inputNumber}
                        onChange={(e) =>
                          onSetInputNumber(Number(e.target.value))
                        }
                      />
                      <Input
                        value={input}
                        onChange={(e) => onSetInput(e.target.value)}
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogClose asChild>
                  <Button
                    className="bg-green-500"
                    onClick={() =>
                      onUpdate(
                        question.id_question || -1,
                        input,
                        "question",
                        inputNumber
                      )
                    }
                  >
                    Submit
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant={"destructive"}>Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-bold text-red-400">
                    DELETE PERTANYAAN
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-black">
                      Semua <span className="font-bold">Sub Pertanyaan</span>{" "}
                      yang ada di halaman ini akan ikut di hapus
                    </p>
                    <p className="font-bold text-lg text-center text-black">
                      Apakah anda yakin?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant={"destructive"}
                  onClick={async () =>
                    await onDelete(question.id_question || -1, "question")
                  }
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </TableCell>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow className="hover:bg-blue-200 transition-all duration-150">
      <TableCell></TableCell>
      <TableCell className="w-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              question.id_question && onToggleQuestion(question.id_question)
            }
            className="p-1 hover:bg-gray-200 rounded"
            disabled={!hasSubQuestions}
          >
            {question.subQuestions.length > 0 ? (
              question.id_question &&
              expandedQuestions.has(question.id_question) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : null}
          </button>
          {question.num_question}
        </div>
      </TableCell>
      <TableCell colSpan={2} className="w-full">
        {question.question}
      </TableCell>
      {renderActionCell()}
    </TableRow>
  );
};

// SubQuestion Row Component
interface SubQuestionRowProps {
  subQuestion: any;
  function_menu: number;
  selectedSubQuestionPribadi: Record<number, number>;
  selectedSubQuestionMitrabersari: Record<number, number>;
  input: string;
  inputNumber: number;
  onSetInput: (value: string) => void;
  onUpdate: (
    id: number,
    text: string,
    location: string,
    inputNumber: number
  ) => void;
  onDelete: (id: number, location: string) => void;
  onSubQuestionPenilaianPribadi: (id: number, optionId: number) => void;
  onSubQuestionPenilaianMitrabersari: (id: number, optionId: number) => void;
  onSetInputNumber: (value: number) => void;
}

export const SubQuestionRow: React.FC<SubQuestionRowProps> = ({
  subQuestion,
  function_menu,
  selectedSubQuestionPribadi,
  selectedSubQuestionMitrabersari,
  input,
  inputNumber,
  onSetInput,
  onUpdate,
  onDelete,
  onSubQuestionPenilaianPribadi,
  onSubQuestionPenilaianMitrabersari,
  onSetInputNumber,
}) => {
  const renderActionCell = () => {
    switch (function_menu) {
      case 6: // Alredy answer Nakes
        return (
          <TableCell className="bg-green-50">
            {/* PRIBADI */}
            <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
              {subQuestion.id_sub_question &&
              selectedSubQuestionPribadi[subQuestion.id_sub_question] === 4
                ? 4
                : 3}
            </div>
          </TableCell>
        );

      case 5: // Alredy Answer Nakes & Mitrabersari
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {subQuestion.id_sub_question &&
                selectedSubQuestionPribadi[subQuestion.id_sub_question] === 4
                  ? 1
                  : 2}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {subQuestion.id_sub_question &&
                  selectedSubQuestionMitrabersari[subQuestion.id_sub_question]}
              </div>
            </TableCell>
          </>
        );
      case 4: // View evaluation
        return (
          <>
            <TableCell className="bg-green-50">
              {/* PRIBADI */}
              <div className=" w-[81px] h-8 font-bold text-xl flex justify-center items-center">
                {subQuestion.id_sub_question &&
                selectedSubQuestionPribadi[subQuestion.id_sub_question] === 4
                  ? 4
                  : 3}
              </div>
            </TableCell>
            <TableCell className="bg-yellow-50">
              {/* MITRABERSARI */}
              <div className=" w-[119px] h-8 font-bold text-xl flex justify-center items-center">
                {subQuestion.id_sub_question &&
                  selectedSubQuestionMitrabersari[subQuestion.id_sub_question]}
              </div>
            </TableCell>
          </>
        );
      case 3: // Personal evaluation
        return (
          <TableCell>
            {PENILAIAN_PRIBADI.map((option) => (
              <button
                key={`subQuestion-${option.id}`}
                onClick={() =>
                  onSubQuestionPenilaianPribadi(
                    subQuestion.id_sub_question || -1,
                    option.id
                  )
                }
                className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    subQuestion.id_sub_question &&
                    selectedSubQuestionPribadi[subQuestion.id_sub_question] ===
                      option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {option.id}
              </button>
            ))}
          </TableCell>
        );
      case 2: // Peer evaluation
        return (
          <>
            <TableCell className="bg-green-50 border-r-2 border-green-400">
              {PENILAIAN_PRIBADI.map((option) => (
                <button
                  key={`subQuestion-${option.id}`}
                  className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                    ${
                      subQuestion.id_sub_question &&
                      selectedSubQuestionPribadi[
                        subQuestion.id_sub_question
                      ] === option.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-200"
                    }`}
                >
                  {option.id}
                </button>
              ))}
            </TableCell>
            <TableCell colSpan={3} className="bg-yellow-50">
              <div className=" flex flex-row justify-center items-center">
                {PENILAIAN_MITRABERSARI.map((option) => (
                  <button
                    key={`subQuestion-${option.id}`}
                    onClick={() =>
                      onSubQuestionPenilaianMitrabersari(
                        subQuestion.id_sub_question || -1,
                        option.id
                      )
                    }
                    className={`mx-1 w-8 h-8 space-x-2 rounded-full border-2 transition-all duration-200 font-bold text-sm
                  ${
                    subQuestion.id_sub_question &&
                    selectedSubQuestionMitrabersari[
                      subQuestion.id_sub_question
                    ] === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  >
                    {option.id}
                  </button>
                ))}
              </div>
            </TableCell>
          </>
        );
      case 1: // Update/Delete
        return (
          <TableCell className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-yellow-400"
                  onClick={() => {
                    onSetInput(subQuestion.sub_question || ""),
                      onSetInputNumber(subQuestion.num_sub_question || 0);
                  }}
                >
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>UPDATE PERTANYAAN</DialogTitle>
                  <DialogDescription>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="w-20"
                        value={inputNumber}
                        onChange={(e) =>
                          onSetInputNumber(Number(e.target.value))
                        }
                      />
                      <Input
                        value={input}
                        onChange={(e) => onSetInput(e.target.value)}
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogClose asChild>
                  <Button
                    className="bg-green-500"
                    onClick={() =>
                      onUpdate(
                        subQuestion.id_sub_question || -1,
                        input,
                        "subQuestion",
                        inputNumber
                      )
                    }
                  >
                    Submit
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant={"destructive"}>Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-bold text-red-400">
                    DELETE PERTANYAAN
                  </DialogTitle>
                  <DialogDescription>
                    <p className="font-bold text-lg text-center text-black">
                      Apakah anda yakin?
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant={"destructive"}
                  onClick={async () =>
                    await onDelete(
                      subQuestion.id_sub_question || -1,
                      "subQuestion"
                    )
                  }
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </TableCell>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow className="hover:bg-blue-200 transition-all duration-150">
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell className="w-10">
        {subQuestion.num_sub_question && toLetter(subQuestion.num_sub_question)}
      </TableCell>
      <TableCell className="w-full">{subQuestion.sub_question}</TableCell>
      {renderActionCell()}
    </TableRow>
  );
};
