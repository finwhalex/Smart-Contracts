const FWX = artifacts.require("FWX");

const Wallet_seed = artifacts.require("Wallet_seed");
const Wallet_private = artifacts.require("Wallet_private");
const Wallet_public = artifacts.require("Wallet_public");
const Wallet_team = artifacts.require("Wallet_team");
const Wallet_marketing = artifacts.require("Wallet_marketing");
const Wallet_reserve = artifacts.require("Wallet_reserve");

const BN = web3.utils.BN;

contract("FWX test", async accounts => {

    // it("Check balance initial account", async () => {
    //     let instance = await FWX.deployed();
    //     let account_one = await instance.balanceOf.call(accounts[0]);
    //     assert.equal(account_one, 0);
    // });

    it("should send tokens correctly", async () => {
        // Get initial balances of first and second account.
        let account_one = accounts[0];
        let account_two = accounts[1];

        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let amount = new BN(254191);

        preсision = new BN(10).pow(decimals);
        amount = amount.mul(preсision);

        let balance = await instance.balanceOf.call(account_one);
        let account_one_starting_balance = new BN(balance);

        balance = await instance.balanceOf.call(account_two);
        let account_two_starting_balance = new BN(balance);

        // transfer tokens
        await instance.transfer(account_two, amount);

        balance = await instance.balanceOf.call(account_one);
        let account_one_ending_balance = new BN(balance);

        balance = await instance.balanceOf.call(account_two);
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

    it("check AirDrop tokens", async () => {

        let wallet = await Wallet_marketing.deployed();

        var recipients = [];
        // generate addresses for airdrop
        for (let k=0; k < 130; k++) {
            recipients.push(web3.eth.accounts.create().address);
        }

        let token = await FWX.deployed();
        let decimals = await token.decimals();
        let amount = new BN(15);

        preсision = new BN(10).pow(decimals);
        amount = amount.mul(preсision);

        // Get initial balances
        let balance = await token.balanceOf.call(wallet.address);
        let account_airdrop_starting_balance = new BN(balance);

        // Run AirDrop
        await wallet.RunAirdropTokens(recipients, amount);

        // Get ending balances
        balance = await token.balanceOf.call(wallet.address);
        let account_airdrop_ending_balance = new BN(balance);

        assert.equal(
            account_airdrop_starting_balance.toString(),
            account_airdrop_ending_balance.add(amount.mul(new BN(recipients.length))).toString(),
            "Airdrop failed!"
        );
    });

    it("Check P2P Deals", async () => {

        let instance = await FWX.deployed();
        let decimals = await instance.decimals();
        let amount = new BN(1501);

        preсision = new BN(10).pow(decimals);
        amount = amount.mul(preсision);

        // Run P2P Deal
        await instance.MakeP2PDeal(accounts[5], accounts[7], amount);

        // If there were no exceptions within the contract, then all is well
        assert.equal(0, 0, "Nothing to break");
    });
});