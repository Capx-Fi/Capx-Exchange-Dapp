import React from "react";
import { useHistory } from "react-router";

function RowsNotFound({ query }) {
	return (
		<div className=" text-center  w-full border border-dark-50 rounded-lg  ">
			<div className="w-full h-10 bg-dark-300 t-0 rounded-b-lg"></div>
			<p className="text-paragraph-1 font-semibold pt-12 text-white">
				Oops! We could not find any asset pair with the token “{query}”
			</p>
			<p className="text-caption-1 text-grayLabel ">
				Click below to add a new token pair
			</p>
			<div className="w-full h-6 bg-dark-300 b-0 rounded-b-lg"></div>
		</div>
	);
}

export default RowsNotFound;
