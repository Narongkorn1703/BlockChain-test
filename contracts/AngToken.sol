//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ANG is ERC20 {
    constructor() ERC20("ANGPAO Coins", "ANG") {
        _mint(msg.sender, 10 * (10**uint256(decimals())));
    }

    function mint() public returns (bool) {
        _mint(msg.sender, 1000);
        return true;
    }
}
