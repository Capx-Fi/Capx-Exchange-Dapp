import { useDispatch, useSelector } from "react-redux";
import { setExchangeBuy, setExchangeSell } from "../../redux/actions/exchange";

import "./ToggleSwitch.scss";

const ToggleSwitch = ({ id }) => {
  const dispatch = useDispatch();
  var mode = useSelector((state) => state.exchange.exchangeMode);
  return (
    <div className="flex items-center justify-center w-fit-content">
      <label htmlFor={`${id}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={mode === "sell"}
            id={`${id}`}
            name={id}
            className="sr-only"
            onChange={() => {
              dispatch(mode === "sell" ? setExchangeBuy() : setExchangeSell());
            }}
          />
          <div
            className={`flex  border bg-dark-500 border-grayLabel flex-row outerDiv rounded-xl breakpoint:rounded-xl tablet:rounded-md phone:rounded-xl justify-around`}
          >
            <p
              className={`p-2 breakpoint:p-2 tablet:p-1 font-bold z-20 breakpoint:text-caption-1 tablet:text-caption-3 phone:text-caption-4 phone:p-2 ${
                mode === "buy" ? "text-black" : "text-primary-green-500"
              }`}
            >
              BUY
            </p>
            <p
              className={`p-2 breakpoint:p-2 tablet:p-1 font-bold z-20 breakpoint:text-caption-1 tablet:text-caption-3 phone:text-caption-4 phone:p-2 ${
                mode === "sell" ? "text-black" : "text-primary-green-500"
              }`}
            >
              SELL
            </p>
          </div>
          <div
            className={`${
              mode === "sell" ? "translate-x-full gradient-bg" : "gradient-bg"
            } transform absolute left-1 top-1 innerSwitch rounded-xl breakpoint:rounded-xl tablet:rounded-md phone:rounded-md transition`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
