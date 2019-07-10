const SafeMath = artifacts.require("SafeMath");
const FWX = artifacts.require("FWX");

const Wallet_seed = artifacts.require("Wallet_seed");
const Wallet_private = artifacts.require("Wallet_private");
const Wallet_public = artifacts.require("Wallet_public");
const Wallet_team = artifacts.require("Wallet_team");
const Wallet_marketing = artifacts.require("Wallet_marketing");
const Wallet_reserve = artifacts.require("Wallet_reserve");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {

        await deployer.deploy(SafeMath, {overwrite: false});
        // link SafeMath library to contracts
        await deployer.link(SafeMath, [FWX, Wallet_seed, Wallet_private, Wallet_public, Wallet_team, Wallet_marketing, Wallet_reserve]);

        // deploy wallets
        let wallet_seed = await deployer.deploy(Wallet_seed);
        let wallet_private = await deployer.deploy(Wallet_private);
        let wallet_public = await deployer.deploy(Wallet_public);
        let wallet_team = await deployer.deploy(Wallet_team);
        let wallet_marketing = await deployer.deploy(Wallet_marketing);
        let wallet_reserve = await deployer.deploy(Wallet_reserve);

        if (network != "mainnet") {
            // for tests
            process.env.AMOUNT_SEED_WALLET = 10000000;
        }

        // deploy token
        await deployer.deploy(FWX,
            process.env.NAME,
            process.env.SYMBOL,
            process.env.EMISSION,
            wallet_seed.address, process.env.AMOUNT_SEED_WALLET,
            wallet_private.address, process.env.AMOUNT_PRIVATE_WALLET,
            wallet_public.address, process.env.AMOUNT_PUBLIC_WALLET,
            wallet_team.address, process.env.AMOUNT_TEAM_WALLET,
            wallet_marketing.address, process.env.AMOUNT_MARKETING_WALLET,
            wallet_reserve.address, process.env.AMOUNT_RESERVE_WALLET
        );
    });
};