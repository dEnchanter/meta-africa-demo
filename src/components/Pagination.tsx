import React, { ReactElement } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { IconButton, Loading } from './Icons';

interface NewThemePaginatorProps {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  pageIndex: number;
  loading: boolean;
}

export function NewThemePaginator({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  loading,
}: NewThemePaginatorProps): JSX.Element {
  return (
    <div className="flex items-center mt-5 sticky ml-5">
      <div className="text-sm text-gray-700 opacity-75 mr-4">{`${pageIndex + 1} of ${pageCount}`}</div>
      <div>
        <IconButton
          round
          icon={<ChevronLeftIcon />}
          disabled={!canPreviousPage}
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-90 bg-purple-100 hover:bg-purple-200"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200"
          onClick={() => previousPage()}
        >
          Prev
        </IconButton>
      </div>
      <div>
        <IconButton
          round
          icon={<ChevronRightIcon />}
          disabled={!canNextPage}
          margin="mr-4"
          font="text-sm text-gray-700"
          bg="opacity-80 bg-purple-100 hover:bg-purple-200"
          border="focus:ring-opacity-7 focus:outline-none focus:ring-2 rounded-sm focus:ring-purple-200"
          onClick={() => nextPage()}
        >
          Next
        </IconButton>
      </div>
      {loading && (
        <div className="text-purple-600 ml-2">
          <Loading />
        </div>
      )}
    </div>
  );
}
