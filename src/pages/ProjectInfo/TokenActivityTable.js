import { Table } from "antd";
import "./TokenListTable.scss";

import TokenLink from "../../assets/token-link.svg";

import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";

import { getExplorerURL } from "../../constants/getChainConfig";
import useWagmi from "../../useWagmi";

const { Column } = Table;

function TokenActivityTable({ completeOrders }) {
	const { chainId } = useWagmi();

	const EXPLORER_URL = chainId && getExplorerURL(chainId);

	function onChange(pagination, filters, sorter, extra) {
		// console.log("params", pagination, filters, sorter, extra);
	}
	return (
		// <div className="tokenListTableContainer">
		<Table
			dataSource={completeOrders}
			pagination={false}
			scroll={{ y: 440 }}
			onChange={onChange}
		>
			<Column
				title="Asset"
				sorter={(a, b) => a.asset.localeCompare(b.asset)}
				showSorterTooltip={false}
				width={"28%"}
				dataIndex="asset"
				key="asset"
				render={(value, row) => {
					return (
						<div className="flex flex-row items-center mx-auto">
							{value}
							<a
								target="_blank"
								rel="noreferrer"
								href={`${EXPLORER_URL}${row.assetID}`}
								className="ml-2"
							>
								<img src={TokenLink} alt="deposit" />
							</a>
						</div>
					);
				}}
			/>
			<Column
				title="Price"
				dataIndex="price"
				key="price"
				render={(value, row) => {
					return (
						<div>
							{new Intl.NumberFormat("en-IN", {
								style: "currency",
								currency: "USD",
								maximumSignificantDigits: 6,
							}).format(Number(value))}
						</div>
					);
				}}
			/>
			<Column
				title="Quantity"
				dataIndex="completedQuantity"
				key="completedQuantity"
				render={(value, row) => {
					return <div>{convertToInternationalCurrencySystem(value)}</div>;
				}}
			/>
			<Column
				title="Fulfilled Date"
				dataIndex="fulfillOrderTimestamp"
				key="fulfillOrderTimestamp"
			/>
		</Table>
	);
}

export default TokenActivityTable;
