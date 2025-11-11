// components/PaginationComponent.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  function_menu: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  function_menu,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Don't show pagination for case 5 & 6
  const shouldShowPagination = function_menu !== 5 && function_menu !== 6;

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Generate page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* <div className="flex items-center space-x-2 text-sm">
        <p>Jumlah Maksimal baris dalam 1 halaman</p>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-20 h-7 border-blue-700 border-2">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="45">45</SelectItem>
            <SelectItem value="90">90</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
      {/* Items per page selector - hide for case 5 & 6 */}
      {shouldShowPagination && (
        <div className="flex items-center space-x-2 text-sm">
          <p>Jumlah Maksimal baris dalam 1 halaman</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-7 border-blue-700 border-2">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="45">45</SelectItem>
              <SelectItem value="90">90</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
