// contracts/JavierToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JavierToken is ERC20 {
    // new members will be added after initial mint
    mapping(address => bool) members;
    uint constant _initial_supply = 1000 * (10 ** 18);
    uint constant _initial_allowance = 5 * (10 ** 18);
    uint constant _initial_contract_pool = 500 * (10 ** 18);
    uint constant _bet_factor = 8;
    uint maxRandomNumber = 9;
    address _owner;

    // events
    event AddNewMember(address indexed member);
    event BetOutcome(address indexed player, uint guess, uint result);

    constructor() ERC20("JavierToken", "JTR") {
        // save owner address
        _owner = msg.sender;

        // assigns all tokesn to owner
        _mint(_owner, _initial_supply);

        // send some tokens to the contract
        _transfer(_owner, address(this), _initial_contract_pool);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier notAMember() {
        require(members[msg.sender] == false);
        _;
    }

    modifier contractHasEnoughFunds(uint amount) {
        require(balanceOf(address(this)) >= amount);
        _;
    }

    modifier userHasEnoughFunds(uint amount) {
        require(balanceOf(msg.sender) >= amount);
        _;
    }

    function setMaxRandomNumber(uint number) external onlyOwner {
        maxRandomNumber = number;
    }

    function getMaxRandomNumber() external view returns (uint) {
        return maxRandomNumber;
    }

    function getContractFunds() external view returns (uint) {
        return balanceOf(address(this));
    }

    /**
     * @dev Mint tokens for new members
     */
    function mintForNewMember() external {
        address memberAddress = msg.sender;
        members[memberAddress] = true;
        _mint(msg.sender, _initial_allowance);

        emit AddNewMember(memberAddress);
    }

    /**
     * @dev Deposit tokens to the contract address
     */
    function deposit(uint amount) external {
        _transfer(msg.sender, address(this), amount);
    }

    /**
     * @dev The user provides a number and a token bet on it
     * an iteration of the game is played and reward is transfered
     * to user or contract.
     */
    function playBet(
        uint guess,
        uint amount
    )
        external
        contractHasEnoughFunds(amount * _bet_factor)
        userHasEnoughFunds(amount)
    {
        address player = msg.sender;
        // this way of generating random numbers is flawed, and can be exlpoited
        // the robust way will be to set the random seed off-chain, by means of an oracle
        // since this is for a toy project, I don't care
        uint randNo = 1 +
            (uint(keccak256(abi.encodePacked(player, block.timestamp))) %
                maxRandomNumber); // random number between 1 and maxRandomNumber

        if (guess == randNo) {
            // user won the bet
            _transfer(address(this), player, amount * _bet_factor);
        } else {
            _transfer(player, address(this), amount);
        }

        emit BetOutcome(player, guess, randNo);
    }
}
