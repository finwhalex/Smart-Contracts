const FWX = artifacts.require("FWX");

const Wallet_seed = artifacts.require("Wallet_seed");
const Wallet_private = artifacts.require("Wallet_private");
const Wallet_public = artifacts.require("Wallet_public");
const Wallet_team = artifacts.require("Wallet_team");
const Wallet_marketing = artifacts.require("Wallet_marketing");
const Wallet_reserve = artifacts.require("Wallet_reserve");

const BN = web3.utils.BN;

contract("Wallet test", async accounts => {

    it("Check wallet_seed balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_seed.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        let amount = new BN(parseInt(process.env.AMOUNT_SEED_WALLET));

        preсision = new BN(10).pow(decimals);
        amount = amount.mul(preсision);

        assert.equal(wallet_balance.toString(), amount.toString());
    });

    it("Check wallet_private balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_private.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        assert.equal(wallet_balance, process.env.AMOUNT_PRIVATE_WALLET * Math.pow(10, decimals));
    });

    it("Check wallet_public balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_public.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        assert.equal(wallet_balance, process.env.AMOUNT_PUBLIC_WALLET * Math.pow(10, decimals));
    });

    it("Check wallet_team balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_team.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        assert.equal(wallet_balance, process.env.AMOUNT_TEAM_WALLET * Math.pow(10, decimals));
    });

    it("Check wallet_marketing balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_marketing.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        assert.equal(wallet_balance, process.env.AMOUNT_MARKETING_WALLET * Math.pow(10, decimals));
    });

    it("Check wallet_reserve balance ", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_reserve.deployed();
        let wallet_balance = await instance.balanceOf.call(wallet.address);
        assert.equal(wallet_balance, process.env.AMOUNT_RESERVE_WALLET * Math.pow(10, decimals));
    });

    it("check private wallet unlock periods", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_private.deployed();
        let date = await wallet.UnlockDates.call(1);
        let amount = await wallet.UnlockAmounts.call(1);
        assert.equal(date, process.env.UNLOCKDATE_PRIVATE_WALLET.split(",")[1], "bad date");
        assert.equal(amount, process.env.UNLOCKAMOUNT_PRIVATE_WALLET.split(",")[1] * Math.pow(10, decimals), "bad amount");
    });

    it("check marketing wallet unlock periods", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let wallet = await Wallet_marketing.deployed();
        let date = await wallet.UnlockDates.call(0);
        let amount = await wallet.UnlockAmounts.call(0);
        assert.equal(date, process.env.UNLOCKDATE_MARKETING_WALLET.split(",")[0], "bad date");
        assert.equal(amount, process.env.UNLOCKAMOUNT_MARKETING_WALLET.split(",")[0] * Math.pow(10, decimals), "bad amount");
    });

    it("should send tokens from wallet correctly", async () => {
        let instance = await FWX.deployed();
        let decimals = await instance.decimals();

        let wallet = await Wallet_public.deployed();
        let recipient = web3.eth.accounts.create().address;

        let amount = new BN(2679197);
        preсision = new BN(10).pow(decimals);
        amount = amount.mul(preсision);

        // Get initial balances of first and second account.
        let balance = await instance.balanceOf.call(wallet.address);
        let account_one_starting_balance = new BN(balance);

        balance = await instance.balanceOf.call(recipient);
        let account_two_starting_balance = new BN(balance);

        // transfer tokens
        await wallet.TransferToken(recipient, amount);

        balance = await instance.balanceOf.call(wallet.address);
        let account_one_ending_balance = new BN(balance);

        balance = await instance.balanceOf.call(recipient);
        let account_two_ending_balance = new BN(balance);

        assert.equal(
            account_one_ending_balance.toString(),
            account_one_starting_balance.sub(amount).toString(),
            "Amount wasn't correctly taken from the sender"
        );
        assert.equal(
            account_two_ending_balance.toString(),
            account_two_starting_balance.add(amount).toString(),
            "Amount wasn't correctly taken from the receiver"
        );
    });
});