pragma solidity ^0.5.10;

import './common/Agent.sol';
import './common/ERC20.sol';

/**
 * @title FinWhaleX Token based on ERC20 token
 */
contract FWX is ERC20, Agent {

    string public name;
    string public symbol;

    uint public decimals = 18;

    mapping(address => uint256) public airdrop_recipient;

    /**
    * Name and symbol were updated.
    */
    event UpdatedTokenInformation(string _name, string _symbol);

    constructor(string memory _name, string memory _symbol, uint _emission,
        address wallet_seed, uint amount_seed,
        address wallet_private, uint amount_private,
        address wallet_public, uint amount_public,
        address wallet_team, uint amount_team,
        address wallet_marketing, uint amount_marketing,
        address wallet_reserve, uint amount_reserve) public {

        // set name of token
        name = _name;
        symbol = _symbol;

        // creating initial tokens
        _mint (msg.sender, _emission*uint(10)**decimals);

        // initial distribution of tokens to wallets
        require(transfer(wallet_seed, amount_seed*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
        require(transfer(wallet_private, amount_private*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
        require(transfer(wallet_public, amount_public*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
        require(transfer(wallet_team, amount_team*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
        require(transfer(wallet_marketing, amount_marketing*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
        require(transfer(wallet_reserve, amount_reserve*uint(10)**decimals), "FWX Constructor: can't initial transfer to wallet");
    }

    /**
    * Owner can update token information here.
    */
    function UpdateTokenInformation(string memory _name, string memory _symbol) public onlyOwner {
        name = _name;
        symbol = _symbol;
        emit UpdatedTokenInformation(_name, _symbol);
    }

    /**
    * Airdrop tokens
    */
    function AirdropTokens(address[] calldata _recipient, uint256 amount) external returns(bool result) {
        require(_recipient.length.mul(amount) <= balanceOf(msg.sender), "FWX AirdropTokens: not enough balance");
        for(uint256 k = 0; k < _recipient.length; k++)
        {
            if (airdrop_recipient[_recipient[k]] == 0) {
                airdrop_recipient[_recipient[k]] = amount;
                require(transfer(_recipient[k], amount), "FWX AirdropTokens: can't transfer token");
            }
        }
        return true;
    }

    /**
    * Make P2P Deal through conversion in FWX token
    */
    function MakeP2PDeal(address _from, address _to, uint256 _amount) external {
        require(balanceOf(msg.sender) >= _amount, "FWX MakeP2PDeal: not enough balance");

        emit Transfer(msg.sender, _from, _amount);
        emit Transfer(_from, _to, _amount);
        emit Transfer(_to, msg.sender, _amount);
    }
}