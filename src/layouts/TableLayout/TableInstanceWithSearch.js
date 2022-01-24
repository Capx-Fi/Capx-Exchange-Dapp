import {
  usePagination,
  useSortBy,
  useTable,
  useGlobalFilter,
  useFilters,
} from "react-table";
import { useMemo } from "react";
import TableWithSearch from "./TableWithSearch";

const TableInstanceWithSearch = ({
  tableData,
  columnName,
  sortColumn,
  title,
  subTitle,
}) => {
  const columns = useMemo(() => columnName, [columnName]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useFilters,
    useSortBy
  );

  if (tableData.length <= 0) {
    return <p className="ml-4">Oops, no data found.</p>;
  }

  return (
    <TableWithSearch {...tableInstance} title={title} subTitle={subTitle} />
  );
};

export default TableInstanceWithSearch;
