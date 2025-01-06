import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Web3 from 'web3';


let lotteryAddress = '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7';
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
    // 상태 선언
    const [count, setCount] = useState(0);
    const [betRecords, setBetRecords] = useState([]);
    const [winRecords, setWinRecords] = useState([]);
    const [failRecords, setFailRecords] = useState([]);
    const [pot, setPot] = useState("0");
    const [challengs, setChallengs] = useState(["A", "B"]);
    const [finalRecords, setFinalRecords] = useState([
      {
        bettor: "0xabcd...",
        index: "0",
        challengs: "ab",
        answer: "ab",
        targetBlockNumber: "10",
        pot: "0",
      },
    ]);
  
  // Web3 초기화 함수
  const initWeb3 = async () => {
    let web3;
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

    // Web3 인스턴스를 통해 스마트 컨트랙트 정보 호출
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];

    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);
    let pot = await lotteryContract.methods.getPot().call();
    console.log('pot:', pot);

    let owner = await lotteryContract.methods.owner().call();
    console.log('owner:', owner);
  };

  // bet 함수
  const bet = async () => {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    let nonce = await web3.eth.getTransactionCount(account)

    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);
    let receipt = await lotteryContract.methods.betAndDistribute('0xab').send({
      from: account,
      value: 5000000000000000,
      gas: 300000,
      gasPrice: 2000000000,
      nonce:nonce
    });
    console.log("Receipt:", receipt);
  };

  const getBetEvent = async() =>{
    const records = [];
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);

    let events = await lotteryContract.getPastEvents('BET',{fromBlock:0, toBlock:'latest'});
    console.log("events : " , events)

  }



  // 컴포넌트가 처음 렌더링될 때 Web3 초기화
  useEffect(() => {
    const init = async () => {
      
      await initWeb3(); // Web3 초기화가 완료될 때까지 기다림
      await bet();  // bet 함수 호출 (Web3 초기화가 완료된 후)
      await getBetEvent();
    };

    init();  // 비동기 함수 호출
  }, []);  // 빈 배열로 한 번만 실행되도록 설정

  //Pot money 확인

  // bet button 

  // bet 글자 선택 ui(버튼)

  // history table(index, address, challenge answer pot  status answerblocknumber) 

  
  return (
    
    <>
    
      <div className='App'>
        
       

          {/* Header - pot , betting characters  */}
          <h1>Current Pot : {pot}</h1>
          <h1>Lottery</h1>
          <p>Lottery tutorial</p>
          <p>Your Bet</p>
          <p>{challengs[0]} , {challengs[1]}</p>

        <div className='container'>
          <div className='card-group'>

          <button className='card bg-primary'>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>A</p>
                <p className='card-text'></p>
              </div>
            </button>   


            <button className='card bg-warning'>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>B</p>
                <p className='card-text'></p>
              </div>
            </button>   

            <button className='card bg-danger'>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>C</p>
                <p className='card-text'></p>
              </div>
            </button>   

            <button className='btn card bg-success'>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>C</p>
                <p className='card-text'></p>
              </div>
            </button>   

                
          </div>
        </div>        
      <br></br>

      <div className='container'>
        <button className='btn btn-danger btn-lg'>BET!</button>
      </div>


      <br></br>
      <div className='container'>
        <table className='table table-dark table-striped'>
          <thead>
            <tr>
              <th>Index</th>
              <th>Address</th>
              <th>Challenge</th>
              <th>Answer</th>
              <th>Pot</th>
              <th>Status</th>
              <th>AnswerBlockNumber</th>
            </tr>
          </thead>
          <tbody>
            {finalRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.index}</td>
                <td>{record.bettor}</td>
                <td>{record.challengs}</td>
                <td>{record.answer}</td>
                <td>{record.pot}</td>
                <td>{record.status || "Pending"}</td>
                <td>{record.targetBlockNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>
    
    
    </>
  );
}


export default App;