// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Balance is Ownable{
    mapping(address => uint256) private balances;
    address actionFactory;

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor(address _actionFactory) Ownable(msg.sender){
        actionFactory=_actionFactory;
    }

    receive() external payable { 
        require(msg.value > 0, "Amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
    function getBalance(address account) external view returns (uint256) {
        return balances[account];
    }
    function transferBalance(address _from, address _to, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(balances[_from] >= _amount, "Insufficient balance");
        require(msg.sender==actionFactory, "you are not authorized to transfer the Balance");
        balances[_from]-=_amount;
        balances[_to]+=_amount;
    }
}
