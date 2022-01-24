import React from 'react'
import DeskCTA from '../../components/CTA/DeskCTA'

import NextIcon from "../../assets/next-black.svg"
import { useHistory } from 'react-router'

function RowsNotFound({query}) {
    const history = useHistory();
    return (
        <div className=" text-center  w-full border border-dark-50 rounded-lg  ">
            <div className="w-full h-10 bg-dark-300 t-0 rounded-b-lg">

</div>
            <p className="text-paragraph-1 font-semibold pt-12 text-white">Oops! We could not find any asset pair with the token “{query}”</p>
            <p className="text-caption-1 text-grayLabel ">Click below to add a new token pair</p>
            <div className="text-center justify-center" style={{margin:"auto"}}>
            <DeskCTA title="ADD TOKEN PAIR" classes="button m-auto mt-5 mb-20" icon={NextIcon} onClick={() => history.push("/newpair")}/>
            </div>
            <div className="w-full h-6 bg-dark-300 b-0 rounded-b-lg">

            </div>
        </div>
    )
}

export default RowsNotFound
