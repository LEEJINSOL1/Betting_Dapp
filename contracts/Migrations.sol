// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    constructor() {
        owner = msg.sender;
    }

    function setCompleted(uint completed) public {
        require(msg.sender == owner, "Only the owner can set the migration.");
        lastCompletedMigration = completed;
    }
}