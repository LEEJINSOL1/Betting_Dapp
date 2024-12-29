import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Web3 from 'web3';
                    //0xC89C4883D9206f011cC10AeB06558845BCe8Ddfd
let lotteryAddress = '0xC89C4883D9206f011cC10AeB06558845BCe8Ddfd';
let lotteryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      }
    ],
    "name": "BET",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes1",
        "name": "answer",
        "type": "bytes1"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      }
    ],
    "name": "DRAW",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes1",
        "name": "answer",
        "type": "bytes1"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      }
    ],
    "name": "FAIL",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      }
    ],
    "name": "REFUND",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes1",
        "name": "answer",
        "type": "bytes1"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      }
    ],
    "name": "WIN",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "answerForTest",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getPot",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "pot",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getBetInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "answerBlockNumber",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      }
    ],
    "name": "pushBet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "popBet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      }
    ],
    "name": "bet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "result",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      }
    ],
    "name": "betAndDistribute",
    "outputs": [
      {
        "internalType": "bool",
        "name": "result",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [],
    "name": "distribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "answer",
        "type": "bytes32"
      }
    ],
    "name": "setAnswerForTest",
    "outputs": [
      {
        "internalType": "bool",
        "name": "result",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenges",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "answer",
        "type": "bytes32"
      }
    ],
    "name": "isMatch",
    "outputs": [
      {
        "internalType": "enum Lottery.BettingResult",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  }
];


function App() {
  const [count, setCount] = useState(0);


  // Web3 초기화 함수
  const initWeb3 = async () => {
    let web3
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Web3 initialized:', web3);
      } catch (error) {
        console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];

    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);
    let pot = await lotteryContract.methods.getPot().call() //call 블록체인 스마트컨트랙트의 값을 변화시키지않고 부르는것 
    console.log('pot : ' , pot)

    let owner = await lotteryContract.methods.owner().call() //call 블록체인 스마트컨트랙트의 값을 변화시키지않고 부르는것 
    console.log('owner : ' ,owner);

  };



  const fetchAccountsBalnce = async() =>{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();

    let balance = await web3.eth.getBalance(accounts[0]);
    console.log(balance);
  }

  const fetchAccounts = async() =>{
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts : ", accounts);
  };
  // 컴포넌트가 처음 렌더링될 때 Web3 초기화
  useEffect(() => {
    initWeb3(); //지갑연결 

    //fetchAccounts(); //메타마스크 연결된 계좌주소 출력
    //fetchAccountsBalnce(); //메타마스크의 연결된 계좌잔액 출력
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;