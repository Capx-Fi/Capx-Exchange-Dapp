import TradedVolume from "../../components/OverviewCard/TradedVolumes";
import GlobalSearchBox from "./GlobalSearchBox";

import { descSort, defaultSort, ascSort } from "./icons";
import RowsNotFound from "./RowsNotFound";
import DeskCTA from "../../components/CTA/DeskCTA";

import AddIcon from "../../assets/AddIcon.svg";
import HistoryIcon from "../../assets/HistoryIcon.svg";
import { useHistory } from "react-router";
import DropDown from "../../components/DropDown/DropDown";

const TableWithSearch = ({
  rows,
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  nextPage,
  previousPage,
  canNextPage,
  canPreviousPage,
  pageOptions,
  state,
  setGlobalFilter,
  gotoPage,
  pageCount,
  setPageSize,
  prepareRow,
  title,
  subTitle,
}) => {
  const { pageIndex, pageSize, globalFilter } = state;

  const history = useHistory();
  return (
    <div className="bg-dark-400 rounded-t-lg ml-16 text-left desktop:w-12/12 ">
      <div className="px-0 pl-7 py-2 mb-2 mt-2 flex justify-between content-start desktop:pl-1">
        {title === "overview" && (
          <TradedVolume
            title="TRADE VOLUME"
            value="$8,200,89.795"
            title2="TRADES"
            value2="8,200,89.795"
          />
        )}
        {(title === "Holdings" || title === "Transaction History") && (
          <div className="text-white text-left mr-48">
            <p className="text-subheading font-medium desktop:text-heading-3">{title}</p>
            <p className="text-caption-1 text-grayLabel font-semibold mb-5 desktop:text-caption-1">
              {subTitle}
            </p>
          </div>
        )}
        {title === "overview" && (
          <GlobalSearchBox filter={globalFilter} setFilter={setGlobalFilter} />
        )}
        {title === "Holdings" && (
          <div>
            <div className="flex flex-row pt-4">
              <DeskCTA
                title={"ADD NEW ASSET"}
                classes="button mb-0 mr-6 text-subheading font-bold laptop:text-caption-1 desktop:text-caption-3"
                icon={AddIcon}
                onClick={() => history.push("/newasset")}
              />
              <img
                src={HistoryIcon}
                alt="history"
                className="cursor-pointer"
                onClick={() => history.push("/history")}
              />
            </div>
          </div>
        )}
        {title === "Transaction History" && <DropDown />}
      </div>
      <div className="pt-1">
        {rows.length > 0 ? (
          <>
            <table
              {...getTableProps()}
              className="table-auto w-full mr-64 border border-separate border-dark-50 text-center text-sm rounded-t-xl"
              // style={{
              //   border: "1px solid #2A383C",
              //   borderRadius: "16px!important",
              // }}
            >
              <thead className="text-grayLabel  text-xs text-center w-0 bg-dark-300 rounded-t-lg p-24">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th className="p-0 pt-4 border border-dark-300 border-l-0 border-r-0 border-t-1 border-b-1">
                        <div
                          className="flex flex-row justify-center"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div></div>
                          <div className="ml-4 text-caption-3 desktop:text-caption-2">
                            {column.render("Header")}{" "}
                          </div>
                          <div className="font-bold text-caption-2 desktop:my-2 desktop:mx-0 desktop:py-2 desktop:pr-8">
                            {column.canSort &&
                              (column.isSorted
                                ? column.isSortedDesc
                                  ? descSort
                                  : ascSort
                                : "")}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                {...getTableBodyProps()}
                className={`text-white border${
                  title !== "overview" && "h-20 overflow-y-scroll"
                }`}
              >
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="border border-b-grayLabel"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className={`px-18 text-display-1 pl-6 py-8 ${
                            title === "overview" ? "py-5 desktop:py-4 desktop:px-6 " : "py-3 desktop:py-4"
                          } border border-dark-50 border-l-0 border-r-0 border-t-0 border-b-1`}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}{" "}
              </tbody>
            </table>
            <div className="w-full h-6 bg-dark-300 t-0 rounded-b-lg border-dark-50 border-t-0"></div>
          </>
        ) : (
          <RowsNotFound query={globalFilter} />
        )}

        {/* extras */}
        {/*   <div className="extras flex justify-end items-center p-4 w-full text-gray-600 text-sm">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-1 rounded mr-6 cursor-pointer bg-dark-400"
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} per page
              </option>
            ))}
          </select>

          <span className="mr-6">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>

          <span className="mr-6">
            <span className="mr-1">Go to page:</span>{" "}
            <input
              className="border rounded px-1 py-0.5 w-12 bg-dark-400 border-dark-300"
              min={1}
              max={pageCount}
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
            />
          </span>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="disabled:opacity-50"
          >
            <p className="mr-4">{"<"}</p>
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="disabled:opacity-50"
          >
            <p className="ml-4">{">"}</p>
          </button>
        </div>
       */}
      </div>
    </div>
  );
};

export default TableWithSearch;
