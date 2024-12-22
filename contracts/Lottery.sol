// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
    
    //배팅정보에 대한 구조체(내가 답한블록넘버, 뱃팅하는사람주소, 뱃팅하는사람의 정답)
    struct BetInfo{
        uint256 answerBlockNumber;
        address payable bettor;
        bytes challenges; //동적바이트
    }

    uint256 private _tail; //큐
    uint256 private _head;
    mapping(uint256 => BetInfo) private _bets; //키-쌍으로 데이터를 저장하는 데이터구조

    address public owner;
    uint256 private _pot;

    event BET(uint256 index, address bettor , uint256 amount, bytes challenges, uint256 answerBlockNumber);

    uint256 constant internal BET_AMOUNT = 5*10**15;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BLOCK_LIMIT = 256;

    

    constructor() {
        owner = msg.sender;
    }

 

    function getPot() public view returns (uint256 pot){
        return _pot;
    }
    
    function getBetInfo(uint256 index) public view returns (uint256 answerBlockNumber, address bettor, bytes memory challenges) {
        BetInfo memory b = _bets[index];
        answerBlockNumber = b.answerBlockNumber;
        bettor = b.bettor;
        challenges = b.challenges;
    }


    function pushBet(bytes memory challenges) public returns (bool){
        BetInfo memory b;
        b.bettor =  payable(msg.sender);
        
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL;
        b.challenges = challenges;

        _bets[_tail] = b;
        _tail++;

        return true;
    }

    function popBet(uint256 index) public returns (bool){
        delete _bets[index];
        return true;
    }
    //BET 배팅
        // save the bet to the queue
    
    /**
     * @dev 배팅을한다. 유저는 0.005ETH를 보내야하고, 배팅용 1byte글자를 보낸다.
     * 큐에 저장된 배팅 정보는 이후 distribute 함수에서 해결된다.
     * @param challenges 유저가 정답을 보내는 1byte글자
     * @return result 함수가 잘 수행되었는지 확인하는 bool 값
     */
    function bet(bytes memory challenges) public payable returns(bool result){
        //check the proper eth is sent

        require(msg.value == BET_AMOUNT, "NOT Enough ETH!!");
        
        //push bet the queue
        require(pushBet(challenges), "Fail to add a new bet info");
        // emit event log
        emit BET(_tail -1 , msg.sender, msg.value, challenges, block.number+BET_BLOCK_INTERVAL);
        

        return true;
    }
    
    // Distribue 검증
        // check the answer
        //
    
}