// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ERC20 {
    function transfer(
        address recepient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address sender,
        address recepient,
        uint256 amount
    ) external returns (bool);
    function totalSupply() external view returns (uint256);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract TokenICO {
    address public owner;
    address public tokenAddress;
    uint256 public tokenSalePrice;
    uint256 public soldTokens;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updateToken(address _tokenAddress) public onlyOwner {
        tokenAddress = _tokenAddress;
    }

    function updateTokenSalePrice(uint256 _tokenSalePrice) public onlyOwner {
        tokenSalePrice = _tokenSalePrice;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "Multiplication overflow");
    }

    function buyToken(uint256 _tokenAmount) public payable {
        require(msg.value >= _tokenAmount * tokenSalePrice, "Not enough ETH");

        ERC20 token = ERC20(tokenAddress);
        require(
            _tokenAmount <= token.balanceOf(msg.sender),
            "Not enough tokens"
        );

        require(
            token.transfer(msg.sender, _tokenAmount * 1e18),
            "Failed to transfer tokens"
        );

        payable(owner).transfer(msg.value);
        soldTokens += _tokenAmount;
    }

    function getTokenDetails()
        public
        view
        returns (
            string memory name,
            string memory symbol,
            uint256 balance,
            uint256 supply,
            uint256 tokenPrice,
            address tokenAddr
        )
    {
        ERC20 token = ERC20(tokenAddress);

        return (
            token.name(),
            token.symbol(),
            token.balanceOf(msg.sender),
            token.totalSupply(),
            tokenSalePrice,
            tokenAddress
        );
    }

    function withdrawAllTokens() public onlyOwner {
        ERC20 token = ERC20(tokenAddress);
        require(
            token.transfer(msg.sender, token.balanceOf(msg.sender)),
            "Failed to transfer tokens"
        );
    }
}
