import React, {useState} from 'react'
import './FakeBAYC/FakeBAYC';
import { useContractFunction } from '@usedapp'
import { getContract, contractInfos } from '@services/contracts'
import {ethers} from 'ethers'


const FakeBAYC = () => {

    const name = require('./FakeBAYC/FakeBAYC.json').contractName;
    const fakeBayc = require('./FakeBAYC/FakeBAYC.json').abi;
    // const contract = new Contract(abi);

    const contract = getContract(contractInfos.fakeBayc)
    const { state, send } = useContractFunction(contract, 'claimAToken', { transactionName: 'ClaimToken' })

	return (
		<div className='FakeBAYC'>
		<h4> {"Token infos"} </h4>
			<div>
				<h3>Name of the Token : {name}</h3>
                {/* <h3>Total Supply : {totalSupply()}</h3> */}
               <button onClick>Claim Token</button>
			</div>
		</div>
	);
}

export default FakeBAYC;
