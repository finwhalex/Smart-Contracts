pragma solidity ^0.5.10;

import './common/Ownable.sol';
import './common/ERC20I.sol';
import './common/SafeMath.sol';

/**
 * @title Wallet contract for Token release schedule
 */
contract Wallet is Ownable {
    using SafeMath for uint256;

    ERC20I public FWX;
    uint256[] public UnlockDates;           // unlock time in timestamp format
    uint256[] public UnlockAmounts;         // unlocked amount
    uint256   public AlreadyTransferred;

    event AddedLockingPeriod(uint256 unlocktime, uint256 amount);
    event transferEther(address receiver, uint256 amount);

    function () external payable {}

    function AddLockPeriods(uint256[] calldata _unlocktimes, uint256[] calldata _unlockamounts) external onlyOwner {
        require(address(FWX) != address(0), "AddLockPeriods: contract is not linked!");
        uint256 dec = FWX.decimals();
        for (uint256 k = 0; k < _unlocktimes.length; k++) {
            if (UnlockDates.length > 0) {
                require(_unlocktimes[k] > UnlockDates[UnlockDates.length-1], "AddLockPeriods: add new unlock period can only be at the end of list");
            }
            UnlockDates.push(_unlocktimes[k]);
            UnlockAmounts.push(_unlockamounts[k].mul(uint(10)**dec));
            emit AddedLockingPeriod(_unlocktimes[k], _unlockamounts[k]);
        }
    }

    function GetUnlockedTokens(uint256 _date) internal view returns (uint256 _amount) {
        _amount = 0;
        for (uint256 k = 0; k < UnlockDates.length; k++) {
            if (UnlockDates[k] > _date) {
                break;
            }
            _amount = _amount.add(UnlockAmounts[k]);
        }
        return _amount;
    }

    // transfer tokens
    function TransferToken(address _receiver, uint256 _amount) external onlyOwner {

        uint256 FreeToken = GetUnlockedTokens(block.timestamp);
        require(AlreadyTransferred.add(_amount) <= FreeToken, "TransferToken: not enough free tokens");

        AlreadyTransferred = AlreadyTransferred.add(_amount);
        require(FWX.transfer(_receiver, _amount));
    }

    // transfer ether
    function TransferEther(address payable _receiver, uint256 _amount) external onlyOwner {
        require(_amount > 0);
        _receiver.transfer(_amount);

        emit transferEther(_receiver, _amount);
    }

    // Airdrop tokens
    function RunAirdropTokens(address[] calldata _recipient, uint256 _amount) external onlyOwner {

        uint256 FreeToken = GetUnlockedTokens(block.timestamp);
        require(AlreadyTransferred.add(_recipient.length.mul(_amount)) <= FreeToken, "RunAirdropTokens: not enough free tokens");

        AlreadyTransferred = AlreadyTransferred.add(_recipient.length.mul(_amount));
        require(FWX.AirdropTokens(_recipient, _amount));
    }

    // Set Token Contract
    function SetToken(address _contract) external onlyOwner {
        require(address(FWX) == address(0), "SetToken: contract is already linked");
        require(_contract != address(0), "SetToken: contract can't be a zero address");
        FWX = ERC20I(_contract);
        AlreadyTransferred = 0;
    }
}

// for deploying
contract Wallet_seed is Wallet {}
contract Wallet_private is Wallet {}
contract Wallet_public is Wallet {}
contract Wallet_team is Wallet {}
contract Wallet_marketing is Wallet {}
contract Wallet_reserve is Wallet {}
