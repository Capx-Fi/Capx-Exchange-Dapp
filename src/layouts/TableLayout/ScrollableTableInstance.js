import {
    usePagination,
    useSortBy,
    useTable,
    useGlobalFilter,
    useFilters,
  } from "react-table";
  import { useMemo } from "react";
import ScrollableTableWithSearch from "./ScrollableTableWithSearch";

  
  const ScrollableTableInstance = ({
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
       
        // initialState: {
        //   pageSize: 10,
        //   //   sortBy: [
        //   //     {
        //   //       id: sortColumn,
        //   //       desc: true,
        //   //     },
        //   //   ],
        // },
      },
      
      useGlobalFilter,
      useFilters,
      useSortBy
    );
  
    if (tableData.length <= 0) {
      return <p className="ml-4">Oops, no data found.</p>;
    }
  
    return (
      <ScrollableTableWithSearch {...tableInstance} title={title} subTitle={subTitle} />
    );
  };
  
  export default ScrollableTableInstance;
  