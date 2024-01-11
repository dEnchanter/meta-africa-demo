import { Button } from './ui/button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center space-x-2 text-zinc-200 text-sm mb-5">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-yellow-500 cursor-pointer bg-gray-600/30 hover:bg-gray-600/50"
      >
        Previous
      </Button>

      {/* You can add the current page and total pages text if you need it */}
      <span>Page {currentPage} of {totalPages}</span>

      <Button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer text-zinc-200 bg-gray-600/30 hover:bg-gray-600/50"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
