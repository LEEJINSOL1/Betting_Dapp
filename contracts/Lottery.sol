// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Lottery {
    
    //배팅정보에 대한 구조체(내가 답한블록넘버, 뱃팅하는사람주소, 뱃팅하는사람의 정답)
    struct BetInfo{
        uint256 answerBlockNumber;
        address payable bettor;
        bytes challenges; //동적바이트
    }

    mapping(uint256 => BetInfo) private _bets; //키-쌍으로 데이터를 저장하는 데이터구조

    constructor() {
        owner = payable(msg.sender);
    }


    uint256 private _tail; //큐
    uint256 private _head;
    uint256 private _pot;

    uint256 constant internal BET_AMOUNT = 5*10**15;
    uint256 constant internal BET_BLOCK_INTERVAL = 3;
    uint256 constant internal BLOCK_LIMIT = 256;

    address payable public owner;
    bytes32 public answerForTest;
    bool private mode = false; // false: use answer for test mode , true : real block hash

    enum BlockStatus {Checkable, NotRevealed, BlockLimitPassed}
    enum BettingResult{Fail,Win,Draw}

    event BET(uint256 index, address bettor , uint256 amount, bytes challenges, uint256 answerBlockNumber);
    event WIN(uint256 index, address bettor, uint256 amount, bytes challenges, bytes1 answer, uint256 answerBlockNumber);
    event FAIL(uint256 index, address bettor, uint256 amount, bytes challenges, bytes1 answer, uint256 answerBlockNumber);
    event DRAW(uint256 index, address bettor, uint256 amount, bytes challenges, bytes1 answer, uint256 answerBlockNumber);
    event REFUND(uint256 index, address bettor, uint256 amount, bytes challenges, uint256 answerBlockNumber);
 

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
        
        b.bettor =  payable(msg.sender); //20byte
        b.answerBlockNumber = block.number + BET_BLOCK_INTERVAL; //unt256 = 32byte 20000
        b.challenges = challenges; //byte 20000

        _bets[_tail] = b; //여기서 실제로 블록체인에 연산이 ㅇ됨됨
        _tail++;  // 20000
        //총 60000가스  = 96802 

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
        emit BET(_tail -1 , msg.sender, msg.value, challenges, block.number+BET_BLOCK_INTERVAL); // 375 가스 x 파라미터 계수 , 약4000~6000가스 
        
        return true;
    }
    
    /**
     * @dev 배팅과 정답 체크를 한다.
     * 졸리다...
     * @param challenges 유저가 배팅하는 글자 
     * @return result  함수가 잘 수행되었는지 확인하는 bool값 
     */
    function betAndDistribute(bytes memory challenges) public payable returns (bool result){
        bet(challenges);
        distribute();

        return true;
    }

    // Distribue 검증
    
    /**
     * @dev 배팅결과값을 확인 하고 팟머니를 분배한다. 
     * 정답 실패 : 팟머니 축적, 정답 맞춤 : 팟머니 획등, 한글자 맞춤, 정답확인불가 : 배틍금액만 획득, 
     */
    function distribute() public{
        // head 4 5 6 7 8 9 10 11 12 tail
        uint256 cur; 
        BetInfo memory b;
        BlockStatus currentBlockStatus;

        for(cur =_head; cur<_tail; cur++){
            b = _bets[cur];
            uint256 transferAmount;
            currentBlockStatus = getBlockStatus(b.answerBlockNumber);
            BettingResult currentBettingResult;


            // Checkable : block.number > AnswerBlockNumber && block.number  <   AnswerBlockNumber  + Blick_Limit
            if(currentBlockStatus == BlockStatus.Checkable){

                bytes32 answerBlockHash = getAnswerBlockHash(b.answerBlockNumber);
                currentBettingResult = isMatch(b.challenges, answerBlockHash);


                // if win , bettor gets pot
                if(currentBettingResult == BettingResult.Win){
                    //transfer pot 
                     transferAmount= transferAfterPayingFee(b.bettor, _pot + BET_AMOUNT);
                    //pot = 0 
                    _pot = 0;
                    // emit event(WIN)
                    
                    emit WIN(cur, b.bettor, transferAmount, b.challenges, answerBlockHash[0], b.answerBlockNumber);
                }

                // if fail, beetor's money goes pot
                if(currentBettingResult == BettingResult.Fail){
                    //pot = pot + BET_AMOUNT
                    _pot += BET_AMOUNT;

                    // emit event(FAIL)
                    emit FAIL(cur, b.bettor, 0 , b.challenges, answerBlockHash[0], b.answerBlockNumber);

                }
                    //
                // if draw, refund bettors' money
                if(currentBettingResult == BettingResult.Draw){
                    // transfer only BET_AMOUNT
                     transferAmount= transferAfterPayingFee(b.bettor, BET_AMOUNT);
                    // emit event(DRAW)
                    emit DRAW(cur, b.bettor, transferAmount , b.challenges, answerBlockHash[0], b.answerBlockNumber);

                }
            }
            // Not Revealed : block.number <= AnswerBlocknumber 
            if(currentBlockStatus == BlockStatus.NotRevealed){
                break;
            }

            // Block Limit papssed : block.number >= AnswerBlockNumber + Block_LIMIT
            if(currentBlockStatus == BlockStatus.BlockLimitPassed){
                // refund
                transferAmount= transferAfterPayingFee(b.bettor, BET_AMOUNT);

                // emit refund 
                emit REFUND(cur, b.bettor, transferAmount , b.challenges, b.answerBlockNumber);

            }     

            popBet(cur);

        }
        _head = cur;
    }
    function transferAfterPayingFee(address payable addr, uint256 amount) internal returns(uint256){
        
        //uint256 fee = amount / 100;
        uint256 fee = 0;
        
        uint256 amountWithoutFee = amount - fee;
        //transfer to addr 
        addr.transfer(amountWithoutFee);
        
        //transfer to owner
        owner.transfer(fee);

        //call(), send , transfer 
        return amountWithoutFee;
    }

    function setAnswerForTest(bytes32 answer) public returns (bool result){
        require(msg.sender == owner, "only owener can set the answer for test mode");
        answerForTest = answer;
        return true;
    }
    function getAnswerBlockHash(uint256 answerBlockNumber) internal view returns (bytes32 answer){
        return mode ? blockhash(answerBlockNumber) : answerForTest;
    }
    /**
     * @dev 배팅글자와 정답을 확인단다
     * @param challenges 배팅글자
     * @param answer 블락해쉬
     * @return 정답결과 
     */
    function isMatch(bytes memory challenges, bytes32 answer) public pure returns (BettingResult) {
        // Create bytes memory for comparison
        bytes memory c1 = new bytes(1);
        bytes memory c2 = new bytes(1);
        bytes memory a1 = new bytes(1);
        bytes memory a2 = new bytes(1);

        c1[0] = challenges[0] >> 4 << 4; // Extract first nibble
        c2[0] = challenges[0] << 4 >> 4; // Extract second nibble

        a1[0] = answer[0] >> 4 << 4; // Extract first nibble
        a2[0] = answer[0] << 4 >> 4; // Extract second nibble

        if (a1[0] == c1[0] && a2[0] == c2[0]) {
            return BettingResult.Win;
        }
        if (a1[0] == c1[0] || a2[0] == c2[0]) {
            return BettingResult.Draw;
        }
        return BettingResult.Fail;
    }


    function getBlockStatus(uint256 answerBlockNumber) internal view returns (BlockStatus){
        if(block.number > answerBlockNumber && block.number  <   answerBlockNumber  + BLOCK_LIMIT){
            return BlockStatus.Checkable;
        }
        if(block.number <= answerBlockNumber ){
            return BlockStatus.NotRevealed;
        }
        if(block.number >= answerBlockNumber + BLOCK_LIMIT){
            return BlockStatus.BlockLimitPassed;
        }
        return BlockStatus.BlockLimitPassed;

    }
        
    
}