const asserRevert = require("./asserRevert");

const Lottery = artifacts.require("Lottery");

const expectEvent = require('./expectEvent');

contract("Lottery", function([deployer, user1, user2]) {
    //let lottery;
    let betAmount = 5 *10**15;
    let bet_block_interval = 3;
    
    it("getpot should teturn current pot", async () => {
        // Deploy the contract
        const lottery = await Lottery.deployed();
        let pot = await lottery.getPot();
        assert.equal(pot,0)
    });

    describe.only('Bet', function() {
        it("should fail when the bet money is not 0.005 ETH", async () => {
            // Deploy the contract
            const lottery = await Lottery.deployed();

            //FAIL TRANSACTION
            await asserRevert(lottery.bet('0xab', {from: user1, value:4000000000000000}))

            // transaction object {chainid, value, to , from, gaslimit, gasprice}


        });
        
        it("should put the bet to the bet queue with 1 bet", async () => {
            // Deploy the contract
            const lottery = await Lottery.deployed();
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
        });

    })
});