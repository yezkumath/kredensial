"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GET_chapter,
  GET_question,
  GET_subquestion,
  POST_chapter,
  POST_question,
  POST_subquestion,
} from "@/connection/credentials/question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { numberToRoman } from "../Manajement_Question/utils/utils";
import { Question } from "@/connection/interface";
import toast from "react-hot-toast";

import ManajemenQuestion from "../Manajement_Question/MainPage";

export default function Page({ documment }: { documment: number }) {
  const [dataChapter, setDataChapter] = useState<Question[]>([]);
  const [dataQuestion, setDataQuestion] = useState<Question[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);
  const [input, setInput] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    getDataChapter(documment);
    console.log("id doc", documment);
  }, [documment]);

  useEffect(() => {
    getDataQuestion(Number(selectedChapter));
  }, [selectedChapter]);

  //-------------------------------ACCESS DATABASE--------------------------------

  const getDataChapter = async (id_doc: number) => {
    try {
      const chapter = await GET_chapter(id_doc);
      if (chapter) {
        setDataChapter(chapter);
      }
    } catch (error) {
      console.error("Error:", error);
      setDataChapter([]);
    }
  };

  const getDataQuestion = async (id_chapter: number) => {
    try {
      const question = await GET_question(id_chapter);
      if (question) {
        setDataQuestion(question);
      }
    } catch (error) {
      console.error("Error:", error);
      setDataQuestion([]);
    }
  };

  const inputChapter = async (question: string) => {
    try {
      // Get the next chapter number by finding the max number + 1
      const nextChapterNumber =
        dataChapter.length > 0
          ? Math.max(...dataChapter.map((ch) => ch.number)) + 1
          : 1;
      await POST_chapter(documment, nextChapterNumber, question);
      toast.success("Success simpan Chapter");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal simpan Chapter");
    }
    getDataChapter(documment);
  };

  const inputQuestion = async (chapter: number, question: string) => {
    try {
      // Get the next question number by finding the max number + 1
      const nextQuestionNumber =
        dataQuestion.length > 0
          ? Math.max(...dataQuestion.map((q) => q.number)) + 1
          : 1;
      await POST_question(chapter, nextQuestionNumber, question);
      toast.success("Success simpan Pertanyaan");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal simpan Pertanyaan");
    }
    getDataQuestion(chapter);
  };
  const inputSubQuestion = async (ques: number, question: string) => {
    try {
      // Get existing sub-questions for this question
      const existingSubQuestions = await GET_subquestion(ques); // get Sub question data
      if (existingSubQuestions !== null) {
        const nextSubQuestionNumber =
          existingSubQuestions.length > 0
            ? Math.max(...existingSubQuestions.map((sq) => sq.number)) + 1
            : 1;
        await POST_subquestion(ques, nextSubQuestionNumber, question);
        toast.success("Success simpan Sub-Pertanyaan");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal simpan Sub-Pertanyaan");
    }
  };

  //---------------------------FUNCTION--------------------------------------

  const handleChapterChange = (value: string) => {
    const numValue = Number(value);
    setSelectedChapter(numValue);
    setSelectedQuestion(0);
    if (numValue && numValue !== 0) {
      getDataQuestion(Number(numValue));
    } else {
      setDataQuestion([]);
    }
  };
  const handleQuestionChange = (value: string) => {
    const numValue = Number(value);
    setSelectedQuestion(numValue);
  };

  const handleInput = async (input: string) => {
    if (selectedChapter == 0) {
      await inputChapter(input);
    } else if (selectedQuestion == 0) {
      await inputQuestion(selectedChapter, input);
    } else {
      await inputSubQuestion(selectedQuestion, input);
    }
    setInput("");
    setReloadKey((prev) => prev + 1);
  };

  const handleChildTrigger = () => {
    console.log("Refres data");
    getDataChapter(documment);
    getDataQuestion(Number(selectedChapter));
  };
  //---------------------------------END---------------------------------
  return (
    <div>
      <div className=" border-2 border-blue-400 rounded-lg p-2 shadow-2xl">
        <div className="font-bold rounded-lg border-2 text-white bg-blue-400 text-center shadow-xl text-xl">
          <p className="m-2">BUAT PERTANYAAN</p>
        </div>

        {/* BUTTON */}
        <div className=" flex flex-col space-y-2">
          {/* CHAPTER */}
          <p className="mt-2">Chapter</p>
          <Select
            value={String(selectedChapter)}
            onValueChange={handleChapterChange}
          >
            <SelectTrigger className="w-full  h-12 text-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">-</SelectItem>
              {dataChapter.map((chapter, index) => (
                <SelectItem key={index} value={String(chapter.id)}>
                  {numberToRoman(chapter.number)}. {chapter.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* QUESTION */}
          <p className="mt-2">Pertanyaan</p>
          <Select
            value={String(selectedQuestion)}
            onValueChange={handleQuestionChange}
          >
            <SelectTrigger className="w-full h-12 text-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">-</SelectItem>
              {dataQuestion.map((question, index) => (
                <SelectItem key={index} value={String(question.id)}>
                  {question.number}. {question.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* INPUT */}
        {selectedChapter === 0 ? (
          <p className="mt-4 text-purple-400">Masukkan Chapter</p>
        ) : selectedQuestion === 0 ? (
          <p className="mt-4 text-blue-400">Masukkan Pertanyaan</p>
        ) : (
          <p className="mt-4 text-green-400">Masukkan Sub-Pertanyaan</p>
        )}
        <div className=" flex flex-row space-x-2 items-center">
          <Input
            className="font-semibold border-blue-400 border-4 h-12 !text-xl"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></Input>
          <Button
            className="bg-blue-400 hover:bg-yellow-300"
            onClick={() => handleInput(input)}
          >
            Input
          </Button>
        </div>
      </div>
      {/* 0 view
      1 update delete
      2 mitrabersari eval
      3 personal eval
      4 Komite View */}
      <ManajemenQuestion
        nip="" // not need NIP
        key={reloadKey}
        documment={documment}
        credentialApplication={-1} // because it create document not on aplication proccess
        function_menu={1}
        trigerParent={handleChildTrigger}
      />
    </div>
  );
}
