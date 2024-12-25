const asserRevert = require("./asserRevert");

const Lottery = artifacts.require("Lottery");

const expectEvent = require('./expectEvent');

contract("Lottery", function([deployer, user1, user2]) {
    //let lottery;
    let betAmount = 5 *10**15;
    let bet_block_interval = 3;
    
    let lottery;
    let betAmountBN = new web3.utils.BN("5000000000000000");

    before(async () => {
        lottery = await Lottery.deployed();
    });
    
    it("getpot should teturn current pot", async () => {
        // Deploy the contract
        //const lottery = await Lottery.deployed();
        let pot = await lottery.getPot();
        assert.equal(pot,0)
    });

    describe('Bet', function() {


        

        it("should fail when the bet money is not 0.005 ETH", async () => {
            // Deploy the contract
            //const lottery = await Lottery.deployed();

            //FAIL TRANSACTION
            await asserRevert(lottery.bet('0xab', {from: user1, value:4000000000000000}))

            // transaction object {chainid, value, to , from, gaslimit, gasprice}


        });
        
        it("should put the bet to the bet queue with 1 bet", async () => {
            // Deploy the contract
            //const lottery = await Lottery.deployed();
            let receipt = await lottery.bet('0xab', {from : user1, value:betAmount})
            
            //bet
            //await lottery.bet("0xab",{from:user1, value:betAmount})
            
            let pot = await lottery.getPot();
            assert.equal(pot, 0);

            // check contract balance == 0.005ETH
            let contractBalnce = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalnce, betAmount);
            
            
            // check bet info
            let currentBlockNumber = await web3.eth.getBlockNumber();
            
            let bet = await lottery.getBetInfo(0);
            assert.equal(bet.answerBlockNumber, currentBlockNumber + bet_block_interval);
            assert.equal(bet.bettor , user1)
            assert.equal(bet.challenges, '0xab')
            
            

            //assertbet.answerBlcokNumber
            //bet.bettor
            //bet.challenges

            // check log
            //await expectEvent.inLogs(receipt.logs, 'BET')
            assert.equal(receipt.logs[0]['event'],"BET")
        })
    })
    describe.only('Distribute', function(){
        describe.only('When the answer is checkable', function(){
            it('should give the user the pot, when the answer mathches', async() =>{
                //두글자 다 맞췄을떄 

                await lottery.setAnswerForTest('0xabcd20752858481bfe9a9aedcc75e40b8110b797ea4b193f4737f74276015934',{from:deployer});
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//1  -> 4번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//2 -> 5번블록에 배팅
                await lottery.betAndDistribute('0xab',{from:user1, value:betAmount})//3 -> 6번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//4 -> 7번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//5 -> 8번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//6 -> 9번블록에 배팅
                
                let potBefore = await lottery.getPot(); // == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7=  await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//7 -> 10번블록에 배팅 여기서 3번블록이 배팅한사람은 돈 받음
                let potAfter = await lottery.getPot(); // == 0 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == beofore + 0.015 ETH
                
                //pot 의 변화량 확인
                assert.equal(potBefore.toString() , new web3.utils.BN('10000000000000000').toString());
                assert.equal(potAfter.toString() , new web3.utils.BN('0').toString());

                //asserRevert.equal(potBefore,  )
                
                // user(winner)의 밸런스를 확인 
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(user1BalanceBefore.add(potBefore).add(betAmountBN).toString(), new web3.utils.BN(user1BalanceAfter).toString() )
            })
    
            it('should give the user the betaMount, when the answer single mathches', async() =>{
                //한 글자 다 맞췄을떄 

                await lottery.setAnswerForTest('0xabcd20752858481bfe9a9aedcc75e40b8110b797ea4b193f4737f74276015934',{from:deployer});
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//1  -> 4번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//2 -> 5번블록에 배팅
                await lottery.betAndDistribute('0xaf',{from:user1, value:betAmount})//3 -> 6번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//4 -> 7번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//5 -> 8번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//6 -> 9번블록에 배팅
                
                let potBefore = await lottery.getPot(); // == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7=  await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//7 -> 10번블록에 배팅 여기서 3번블록이 배팅한사람은 돈 받음
                let potAfter = await lottery.getPot(); // == 0.01 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == beofore + 0.005 ETH
                
                //pot 의 변화량 확인
                assert.equal(potBefore.toString() , potAfter.toString() );

                //asserRevert.equal(potBefore,  )
                
                // user(winner)의 밸런스를 확인 
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore);
                assert.equal(user1BalanceBefore.add(betAmountBN).toString(), new web3.utils.BN(user1BalanceAfter).toString() )
            

            })

            it.only('should get the eth of user when the answer does not match at all', async() =>{
                //두글자 다 틀렸을 때

                await lottery.setAnswerForTest('0xabcd20752858481bfe9a9aedcc75e40b8110b797ea4b193f4737f74276015934',{from:deployer});
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//1  -> 4번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//2 -> 5번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user1, value:betAmount})//3 -> 6번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//4 -> 7번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//5 -> 8번블록에 배팅
                await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//6 -> 9번블록에 배팅
                
                let potBefore = await lottery.getPot(); // == 0.01 ETH
                let user1BalanceBefore = await web3.eth.getBalance(user1);
                let receipt7=  await lottery.betAndDistribute('0xef',{from:user2, value:betAmount})//7 -> 10번블록에 배팅 여기서 3번블록이 배팅한사람은 돈 받음
                let potAfter = await lottery.getPot(); // == 0.015 ETH
                let user1BalanceAfter = await web3.eth.getBalance(user1); // == beofore + 0.005 ETH
                
                //pot 의 변화량 확인
                assert.equal(potBefore.add(betAmountBN).toString() , potAfter.toString() );

                //asserRevert.equal(potBefore,  )
                
                // user(winner)의 밸런스를 확인 
                user1BalanceBefore = new web3.utils.BN(user1BalanceBefore); //before
                assert.equal(user1BalanceBefore.toString(), new web3.utils.BN(user1BalanceAfter).toString() )

            })
        })
    
        describe('When the answer is not revealed(Not Mined)', function(){
            
        })



        describe('When the answer is not revealed(block limit is passed)', function(){
            
        })
    })
    describe('isMathch', function(){

        let blockHash = '0xabcd2075b858481bfe9a9aedcc75e40b8110b797ea4b193f4737f74276015934'


        

        it.only('should be BettingResult.win when two characters math', async() =>{


            let matchingResult = await lottery.isMatch('0xab', blockHash)
            assert.equal(matchingResult,1);
        })

        it('should be BettingResult.Fail when two characters math', async() =>{


            let matchingResult = await lottery.isMatch('0xcd', blockHash)
            assert.equal(matchingResult,0);
        })

        it('should be BettingResult.Draw when two characters math', async() =>{

            let matchingResult = await lottery.isMatch('0xad', blockHash)
            assert.equal(matchingResult,2);

            matchingResult = await lottery.isMatch('0xfb', blockHash)
            assert.equal(matchingResult,2);
        })
    })
});