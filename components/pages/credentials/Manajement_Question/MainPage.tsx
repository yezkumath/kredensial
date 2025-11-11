"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageProps, TableQuestionRow } from "./types";
import { FUNCTION_MENU } from "./constants";
import { useEvaluation } from "./hooks/useEvaluation";
import {
  ChapterRow,
  QuestionRow,
  SubQuestionRow,
} from "./components/TableComponents";
import { PaginationComponent } from "./components/PaginationComponent";
import {
  flattenRowsForPagination,
  getPaginatedRows,
  calculateTotalPages,
} from "./utils/tableUtils";
import { GET_credential_document } from "@/connection/credentials/document"; // Update import path

export default function Page({
  nip, // This is target_nip (person being evaluated)
  documment, // This is id_document
  credentialApplication, // This is id_application
  function_menu,
  trigerParent,
}: PageProps) {
  const { state, setters, handlers, actions } = useEvaluation(
    documment, // id_document
    credentialApplication, // id_application
    function_menu,
    nip, // target_nip
    trigerParent
  );

  const [nameDoc, setNameDoc] = useState<string>("");

  useEffect(() => {
    getDocumentName();
  }, []);

  const getDocumentName = async () => {
    try {
      const result = await GET_credential_document(documment);
      if (result && result.length > 0) {
        setNameDoc(result[0].name_document);
      } else {
        toast.error("Gagal Mendapatkan Dokumen");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat nama dokumen");
    }
  };

  // Toggle functions
  const toggleChapter = (chapterId: number) => {
    const newExpanded = new Set(state.expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setters.setExpandedChapters(newExpanded);
  };

  const toggleQuestion = (questionId: number) => {
    const newExpanded = new Set(state.expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setters.setExpandedQuestions(newExpanded);
  };

  // Pagination functions
  const handlePageChange = (page: number) => {
    setters.setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setters.setItemsPerPage(items);
    setters.setCurrentPage(1);
  };

  // Get paginated rows
  const allRows = flattenRowsForPagination(
    state.chapters,
    state.expandedChapters,
    state.expandedQuestions,
    function_menu
  );

  // const paginatedRows = getPaginatedRows(
  //   allRows,
  //   state.currentPage,
  //   state.itemsPerPage
  // );
  // const totalPages = calculateTotalPages(allRows.length, state.itemsPerPage);

  const shouldShowAllRows = function_menu === 5 || function_menu === 6;
  const paginatedRows = shouldShowAllRows
    ? allRows
    : getPaginatedRows(allRows, state.currentPage, state.itemsPerPage);
  const totalPages = shouldShowAllRows
    ? 1
    : calculateTotalPages(allRows.length, state.itemsPerPage);

  // Render table row based on type
  const renderTableRow = (row: TableQuestionRow) => {
    const commonProps = {
      input: state.input,
      inputNumber: state.inputNumber,
      onSetInput: setters.setInput,
      onUpdate: handlers.handleUpdate,
      onDelete: handlers.handleDelete,
      onSetInputNumber: setters.setInputNumber,
    };

    switch (row.type) {
      case "chapter":
        return (
          <ChapterRow
            key={row.id}
            chapter={row.data}
            expandedChapters={state.expandedChapters}
            function_menu={function_menu}
            selectedChapterPribadi={state.selectedChapterPribadi}
            selectedChapterMitrabersari={state.selectedChapterMitrabersari}
            onToggleChapter={toggleChapter}
            onChapterPenilaianPribadi={handlers.handleChapterPenilaianPribadi}
            onChapterPenilaianMitrabersari={
              handlers.handleChapterPenilaianMitrabersari
            }
            {...commonProps}
          />
        );

      case "question":
        return (
          <QuestionRow
            key={row.id}
            question={row.data}
            expandedQuestions={state.expandedQuestions}
            function_menu={function_menu}
            selectedQuestionPribadi={state.selectedQuestionPribadi}
            selectedQuestionMitrabersari={state.selectedQuestionMitrabersari}
            onToggleQuestion={toggleQuestion}
            onQuestionPenilaianPribadi={handlers.handleQuestionPenilaianPribadi}
            onQuestionPenilaianMitrabersari={
              handlers.handleQuestionPenilaianMitrabersari
            }
            {...commonProps}
          />
        );

      case "subQuestion":
        return (
          <SubQuestionRow
            key={row.id}
            subQuestion={row.data}
            function_menu={function_menu}
            selectedSubQuestionPribadi={state.selectedSubQuestionPribadi}
            selectedSubQuestionMitrabersari={
              state.selectedSubQuestionMitrabersari
            }
            onSubQuestionPenilaianPribadi={
              handlers.handleSubQuestionPenilaianPribadi
            }
            onSubQuestionPenilaianMitrabersari={
              handlers.handleSubQuestionPenilaianMitrabersari
            }
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  // Render table header based on function menu
  const renderTableHeader = () => {
    let actionColumnTitle = "";
    let showSpecialHeader = false;

    switch (function_menu) {
      case FUNCTION_MENU.UPDATE_DELETE:
        actionColumnTitle = "Action";
        break;
      case FUNCTION_MENU.MITRABERSARI_EVAL:
        showSpecialHeader = true;
        break;
      case FUNCTION_MENU.PERSONAL_EVAL:
        actionColumnTitle = "Penilaian";
        break;
      case FUNCTION_MENU.KOMITE_VIEW_EVAL:
        showSpecialHeader = true;
        break;
      default:
        actionColumnTitle = "";
    }

    return (
      <TableHeader className="font-bold text-lg">
        <TableRow>
          <TableHead colSpan={4} className="text-center">
            Rincian Kewenangan Klinis
          </TableHead>
          {showSpecialHeader ? (
            <>
              <TableHead className="text-center bg-green-50 border-r-2 border-green-400">
                Diminta
              </TableHead>
              <TableHead className="text-center bg-yellow-50">
                Rekomendasi Mitrabersari
              </TableHead>
            </>
          ) : (
            actionColumnTitle && <TableHead>{actionColumnTitle}</TableHead>
          )}
        </TableRow>
      </TableHeader>
    );
  };

  return (
    <div>
      <div className="text-center text-xl mt-3 font-bold">{nameDoc}</div>
      <Table>
        {renderTableHeader()}
        <TableBody>{paginatedRows.map((row) => renderTableRow(row))}</TableBody>
      </Table>

      <PaginationComponent
        currentPage={state.currentPage}
        totalPages={totalPages}
        itemsPerPage={state.itemsPerPage}
        function_menu={function_menu}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
