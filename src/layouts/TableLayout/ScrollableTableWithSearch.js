import GlobalSearchBox from "./GlobalSearchBox";

import RowsNotFound from "./RowsNotFound";
import ascSort from "../../assets/asc.svg";
import descSort from "../../assets/desc.svg";
import defaultSort from "../../assets/defaultSort.svg";

import "./customScrollbar.css";

const ScrollableTableWithSearch = ({
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
	const { globalFilter } = state;

	return (
		<div className="bg-dark-400 rounded-t-lg pr-40   ">
			<div className="px-4 pl-7 py-2 mb-5  flex justify-between content-start">
				<div className="text-white text-left ">
					<p className="text-subheading font-medium">{title}</p>
					<p className="text-caption-1 text-grayLabel font-semibold mb-5">
						{subTitle}
					</p>
				</div>

				<GlobalSearchBox filter={globalFilter} setFilter={setGlobalFilter} />
			</div>
			<div className="p-0 pt-1 ">
				{rows.length > 0 ? (
					<>
						<div
							className="tableFixHead"
							style={{ overflow: "auto", width: "100%" }}
						>
							<table
								{...getTableProps()}
								className="custom-scroll-capx table-auto w-full border border-separate border-dark-50 border-b-0  text-left text-sm rounded-t-xl"
							>
								<thead className="text-grayLabel text-xs text-left w-extend relative   -top-1 border border-separate border-dark-50 border-b-0 bg-dark-300  rounded-t-lg">
									{headerGroups.map((headerGroup) => (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column) => (
												<th className="p-4 text-left border border-dark-50 border-l-0 border-r-0 border-t-0 border-b-1">
													<div
														className="flex flex-row justify-start"
														{...column.getHeaderProps(
															column.getSortByToggleProps()
														)}
													>
														<div></div>
														<div className="ml-2 text-caption-1">
															{column.render("Header")}{" "}
														</div>
														<div className="ml-2">
															{column.canSort &&
																(column.isSorted ? (
																	column.isSortedDesc ? (
																		<img
																			src={descSort}
																			className="mt-2"
																			alt="downward-arrow"
																		/>
																	) : (
																		<img src={ascSort} alt="upward-arrow" />
																	)
																) : (
																	<img src={defaultSort} alt="default-sort" />
																))}
														</div>
													</div>
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody
									{...getTableBodyProps()}
									className={`text-white border h-52 ${
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
														className={`px-2 pl-4 ${
															title === "overview" ? "py-5" : "py-3"
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
						</div>
						<div className="w-full h-6 bg-dark-300 t-0 rounded-b-lg border-dark-50 border-t-0"></div>
					</>
				) : (
					<RowsNotFound query={globalFilter} />
				)}
			</div>
		</div>
	);
};

export default ScrollableTableWithSearch;
