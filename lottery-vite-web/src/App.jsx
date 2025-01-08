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
    
    let [account_globalVariable, setAccount_globalVariable] = useState([]);
    let [lotteryContract_globalVariable,setLotteryContract_globalVariable] = useState([]);
    let [web4, setWeb4] = useState([]);
    let [count, setCount] = useState(0);
    const [betRecords, setBetRecords] = useState([]);
    const [winRecords, setWinRecords] = useState([]);
    const [failRecords, setFailRecords] = useState([]);
    let [pot, setPot] = useState("0");
    let [challengs, setChallengs] = useState(["A", "B"]);
    let [finalRecords, setFinalRecords] = useState([]);
    let [global_web3, setGlobal_web3] = useState([]);
 
  
  const getPot_ = async() =>{
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {

        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        //console.error('User denied wallet access', error);
      }
    } else {
      //console.error('No Ethereum browser extension detected, install MetaMask!');
    }
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);
    let pot = await lotteryContract.methods.getPot().call();
    //console.log("pot : ", pot)
    let potString = web3.utils.fromWei(pot.toString(), 'ether');
    setPot(potString);
  };

  // Web3 초기화 함수
  const initWeb3 = async () => {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    // Web3 인스턴스를 통해 스마트 컨트랙트 정보 호출
    const accounts = await web3.eth.getAccounts();
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);

    let account = accounts[0];

    let pot = await lotteryContract.methods.getPot().call();
    //console.log('pot:', pot);

    let owner = await lotteryContract.methods.owner().call();
    //console.log('owner:', owner);
    //console.log("lottey ", lotteryContract)
    //console.log("lottey ", )
    
    setLotteryContract_globalVariable(lotteryContract);
    setGlobal_web3(web3);
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

    let challenge = '0x' + challengs[0].toLowerCase() + challengs[1].toLowerCase();

    let receipt = await lotteryContract.methods.betAndDistribute(challenge).send({
      from: account,
      value: 5000000000000000,
      gas: 300000,
      gasPrice: 2000000000,
      nonce:nonce
    }).on('transactionHash', (hash) =>{
      console.log(hash)
    })
  };

  const getBetEvents = async () => {
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        //console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    // Web3 인스턴스를 통해 스마트 컨트랙트 정보 호출
    const accounts = await web3.eth.getAccounts();
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);

    const records = [];
    let events = await lotteryContract.getPastEvents('BET', {fromBlock:0, toBlock:'latest'});
    
    for(let i=0;i<events.length;i+=1){
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.bettor = events[i].returnValues.bettor.slice(0,4) + '...' + events[i].returnValues.bettor.slice(40,42);
      record.betBlockNumber = events[i].blockNumber;
      record.targetBlockNumber = events[i].returnValues.answerBlockNumber.toString();
      record.challenges = events[i].returnValues.challenges;
      record.win = 'Not Revealed';
      record.answer = '0x00';
      records.unshift(record);
    }
    console.log("bet : ", records)
    setBetRecords(records);
  }
  const getFailEvents = async () => {
    console.log("fail ")
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        //console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    // Web3 인스턴스를 통해 스마트 컨트랙트 정보 호출
    const accounts = await web3.eth.getAccounts();
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);

    const records = [];
    let events = await lotteryContract.getPastEvents('FAIL', {fromBlock:0, toBlock:'latest'});
    
    for(let i=0;i<events.length;i+=1){
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.answer = events[i].returnValues.answer;
      records.unshift(record);
    }
    //console.log(records);
    setFailRecords(records)
    console.log("fail : " , records)
  }

  const getWinEvents = async () => {
    //console.log("win")
    let web3;
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // 사용자로부터 지갑 연결 요청
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log('Web3 initialized:', web3);
      } catch (error) {
        //console.error('User denied wallet access', error);
      }
    } else {
      console.error('No Ethereum browser extension detected, install MetaMask!');
    }

    // Web3 인스턴스를 통해 스마트 컨트랙트 정보 호출
    const accounts = await web3.eth.getAccounts();
    const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);

    const records = [];
    let events = await lotteryContract.getPastEvents('WIN', {fromBlock:0, toBlock:'latest'});
    
    for(let i=0;i<events.length;i+=1){
      const record = {}
      record.index = parseInt(events[i].returnValues.index, 10).toString();
      record.amount = parseInt(events[i].returnValues.amount, 10).toString();
      records.unshift(record);
    }
    setWinRecords(records)
    console.log("win : ", records)
  }

  const makeFinalRecords = () => {
    console.log("betbet : " ,betRecords)
    console.log("winwin : ", winRecords)
    console.log("failfail : " , failRecords);
    if (!betRecords || !betRecords.length) return; // betRecords가 비어 있으면 실행하지 않음
    
    let f = 0, w = 0;
    let records = [...betRecords]; // betRecords 복사
    for (let i = 0; i < betRecords.length; i++) {
      if (winRecords.length > 0 && betRecords[i].index === winRecords[w]?.index) {
        records[i].win = 'WIN';
        records[i].answer = records[i].challenges;
        records[i].pot = global_web3.utils.fromWei(winRecords[w].amount, 'ether');
        if (winRecords.length - 1 > w) w++;
      } else if (failRecords.length > 0 && betRecords[i].index === failRecords[f]?.index) {
        records[i].win = 'FAIL';
        records[i].answer = failRecords[f].answer;
        records[i].pot = 0;
        if (failRecords.length - 1 > f) f++;
      } else {
        records[i].answer = 'Not Revealed';
      }
    }
    setFinalRecords(records);
    //console.log(records);
      
  };


  useEffect(() => {
    const init = async () => {
      await initWeb3();
    };
  
    const pollData = async () => {
      await getPot_();
      await getBetEvents();
      await getWinEvents();
      await getFailEvents();
  
      // 상태 업데이트가 완료된 후에 makeFinalRecords 호출
      setTimeout(() => {
        makeFinalRecords();
      }, 5000); // 500ms 정도 기다린 후 makeFinalRecords 호출
    };
  
    init();
    const intervalId = setInterval(() => {
      pollData();
    }, 5000); // 5000ms = 5초
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행
  



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
          <p>{challengs[0]} / {challengs[1]}</p>

        <div className='container'>
          <div className='card-group'>

          <button className='card bg-primary' onClick={() =>{
            let newChallengs = [challengs[1], "A"]
            setChallengs(newChallengs);
          }}>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>A</p>
                <p className='card-text'></p>
              </div>
            </button>   


            <button className='card bg-warning' onClick={() =>{
              let newChallengs = [challengs[1],'B']
              
              setChallengs(newChallengs);
              
            }}>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>B</p>
                <p className='card-text'></p>
              </div>
            </button>   

            <button className='card bg-danger' onClick={() =>{
              let newChallengs = [challengs[1], "C"]
              setChallengs(newChallengs);
            }}>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>C</p>
                <p className='card-text'></p>
              </div>
            </button>   

            <button className='btn card bg-success' onClick={() =>{
              let newChallengs = [challengs[1], "D"]
              setChallengs(newChallengs);
            }}>
              <div className='card-body text-center'>
                <p className='card-text'></p>
                <p className='card-text text-center'>D</p>
                <p className='card-text'></p>
              </div> 
            </button>   

                
          </div>
        </div>        
      <br></br>

      <div className='container'>
        <button className='btn btn-danger btn-lg' onClick={bet}>BET!</button>
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
            {finalRecords.map((record, index) => { 
              return (
              <tr key={index}>
                <td>{record.index}</td>
                <td>{record.bettor}</td>
                <td>{record.challenges}</td>
                <td>{record.answer}</td>
                <td>{record.pot}</td>
                <td>{record.win}</td>
                <td>{record.targetBlockNumber}</td>
              </tr>
            )
          }) 
          }
          </tbody>
        </table>
      </div>

      </div>
     
    </>
  );
}


export default App;