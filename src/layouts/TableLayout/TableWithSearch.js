import TradedVolume from "../../components/OverviewCard/TradedVolumes";
import GlobalSearchBox from "./GlobalSearchBox";

import { descSort, defaultSort, ascSort } from "./icons";

import { useHistory } from "react-router";

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
	const { globalFilter } = state;

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
						<p className="text-subheading font-medium desktop:text-heading-3">
							{title}
						</p>
						<p className="text-caption-1 text-grayLabel font-semibold mb-5 desktop:text-caption-1">
							{subTitle}
						</p>
					</div>
				)}
				{title === "overview" && (
					<GlobalSearchBox filter={globalFilter} setFilter={setGlobalFilter} />
				)}
			</div>
			<div className="pt-1">
				{rows.length > 0 ? (
					<>
						<table
							{...getTableProps()}
							className="table-auto w-full mr-64 border border-separate border-dark-50 text-center text-sm rounded-t-xl"
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
														title === "overview"
															? "py-5 desktop:py-4 desktop:px-6 "
															: "py-3 desktop:py-4"
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
				) : null}
			</div>
		</div>
	);
};

export default TableWithSearch;
