const FWX = artifacts.require("FWX");

const Wallet_seed = artifacts.require("Wallet_seed");
const Wallet_private = artifacts.require("Wallet_private");
const Wallet_public = artifacts.require("Wallet_public");
const Wallet_team = artifacts.require("Wallet_team");
const Wallet_marketing = artifacts.require("Wallet_marketing");
const Wallet_reserve = artifacts.require("Wallet_reserve");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {

        let token = await FWX.deployed();

        let wallet_seed = await Wallet_seed.deployed();
        let wallet_private = await Wallet_private.deployed();
        let wallet_public = await Wallet_public.deployed();
        let wallet_team = await Wallet_team.deployed();
        let wallet_marketing = await Wallet_marketing.deployed();
        let wallet_reserve = await Wallet_reserve.deployed();

        // set token contract in wallets
        await wallet_seed.SetToken(token.address);
        await wallet_private.SetToken(token.address);
        await wallet_public.SetToken(token.address);
        await wallet_team.SetToken(token.address);
        await wallet_marketing.SetToken(token.address);
        await wallet_reserve.SetToken(token.address);

        // set unlock date & amount
        await wallet_seed.AddLockPeriods(process.env.UNLOCKDATE_SEED_WALLET.split(","), process.env.UNLOCKAMOUNT_SEED_WALLET.split(","));
        await wallet_private.AddLockPeriods(process.env.UNLOCKDATE_PRIVATE_WALLET.split(","), process.env.UNLOCKAMOUNT_PRIVATE_WALLET.split(","));
        await wallet_public.AddLockPeriods(process.env.UNLOCKDATE_PUBLIC_WALLET.split(","), process.env.UNLOCKAMOUNT_PUBLIC_WALLET.split(","));
        await wallet_team.AddLockPeriods(process.env.UNLOCKDATE_TEAM_WALLET.split(","), process.env.UNLOCKAMOUNT_TEAM_WALLET.split(","));
        await wallet_marketing.AddLockPeriods(process.env.UNLOCKDATE_MARKETING_WALLET.split(","), process.env.UNLOCKAMOUNT_MARKETING_WALLET.split(","));
        await wallet_reserve.AddLockPeriods(process.env.UNLOCKDATE_RESERVE_WALLET.split(","), process.env.UNLOCKAMOUNT_RESERVE_WALLET.split(","));

        // set owners
        await token.transferOwnership(process.env.OWNER);

        if (network == "mainnet") {
            await wallet_seed.transferOwnership(process.env.OWNER_SEED_WALLET);
            await wallet_private.transferOwnership(process.env.OWNER_PRIVATE_WALLET);
            await wallet_public.transferOwnership(process.env.OWNER_PUBLIC_WALLET);
            await wallet_team.transferOwnership(process.env.OWNER_TEAM_WALLET);
            await wallet_marketing.transferOwnership(process.env.OWNER_MARKETING_WALLET);
            await wallet_reserve.transferOwnership(process.env.OWNER_RESERVE_WALLET);
        }
    });
};