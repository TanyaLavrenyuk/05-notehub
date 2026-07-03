import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const getPaginationComponent = () => {
  const unknownComponent = ReactPaginate as unknown as Record<string, unknown>;
  if (unknownComponent && typeof unknownComponent.default === "function") {
    return unknownComponent.default as React.ComponentType<
      Record<string, unknown>
    >;
  }
  return ReactPaginate as unknown as React.ComponentType<
    Record<string, unknown>
  >;
};

const Paginate = getPaginationComponent();

export default function Pagination({
  pageCount,
  onPageChange,
}: PaginationProps) {
  return (
    <Paginate
      breakLabel="..."
      nextLabel="Next >"
      previousLabel="< Prev"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
