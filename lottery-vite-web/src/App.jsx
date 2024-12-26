import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Web3 from 'web3';

function App() {
  const [count, setCount] = useState(0);

  // Web3 초기화 함수
  const initWeb3 = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
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
  };

  // 컴포넌트가 처음 렌더링될 때 Web3 초기화
  useEffect(() => {
    initWeb3(); //지갑연결 
    const fetchAccounts = async() =>{
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      console.log("Accounts : ", accounts);
    }
    const fetchAccountsBalnce = async() =>{
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();

      let balance = await web3.eth.getBalance(accounts[0]);
      console.log(balance);
    }
    fetchAccounts(); //메타마스크 연결된 계좌주소 출력
    fetchAccountsBalnce(); //메타마스크의 연결된 계좌잔액 출력
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