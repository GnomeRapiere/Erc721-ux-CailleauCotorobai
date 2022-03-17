import React, {useState} from 'react'
import {ethers} from 'ethers'


const ChainInfo = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [block,setBlockNumber]=useState(null);

    

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
                getBlockNumber();
                checkNetwork();
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

    const getBlockNumber = () => {
		window.ethereum.request({method: 'eth_blockNumber'})
		.then(id => {
			setBlockNumber(ethers.utils.formatEther(id));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};



	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);


    // switches network to the one provided
    const switchNetwork = async () => {
    await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
    };


    // targets Rinkeby chain, id 4
    const targetNetworkId = '0x4';

    // checks if current chain matches with the one we need
    // and returns true/false
    const checkNetwork = async () => {
    if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
    });
    const targetNetworkId = '0x4';

    // return true if network id is the same
    if (currentChainId == targetNetworkId) return true;
    // return false is network id is different
    else{
        switchNetwork();
    }
    }
    };

	
	return (
		<div className='ChainInfo'>
		<h4> {"Connection to MetaMask using window.ethereum methods"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay'>
				<h3>Balance: {userBalance}</h3>
			</div>
            <div>
                <h3>ChainId : Rinkeby</h3>
            </div>
            <div>
                <h3>Block Number : {block}</h3>
            </div>
			{errorMessage}
		</div>
	);
}

export default ChainInfo;