const NFY = artifacts.require('NFY');
const IBSCswapFactory = artifacts.require('IBSCswapFactory');
// const Funding = artifacts.require("Funding");
const NFYStakingNFTV2 = artifacts.require('NFYStakingNFTV2');
const LPStakingNFTV2 = artifacts.require('LPStakingNFTV2');
const NFYStakingV2 = artifacts.require('NFYStakingV2');
const LPStaking = artifacts.require('LPStaking');
const LPStakingV2 = artifacts.require('LPStakingV2');

const RewardPool = artifacts.require('RewardPool');
const NFYTradingPlatform = artifacts.require('NFYTradingPlatform');

const NFYStaking = artifacts.require('NFYStaking');

module.exports = async function (deployer, networks, accounts) {
  // Owner address
  const owner = '0x0aE7971DD94c5E39d21Da0D9C6a3B3C429360EC1';

  //this snippet is used to transfer NFY to any address
  //{
  // const tok = await NFY.deployed();
  // await tok.transfer(
  //   '0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c',
  //   web3.utils.toWei('10000')
  // );
  // return;
  //}

  // Address of NFY token
  // constructor(address _NFYToken, address _StakingNFT, address _staking, address _rewardPool, uint256 _dailyReward) Ownable() public {

  //   deployer.deploy(
  //     NFYStaking,
  //     '0xF94413cF315cb461637BE61c2b9CF2a4b457a466',
  //     '0x52f63273007f0beAc03465bE563668DCFD0877C1',
  //     '0x52f63273007f0beAc03465bE563668DCFD0877C1',
  //     '0x12E2aC008006660B93Aa48141b6b7111FAdBC97A',
  //     '0'
  //   );

  //Address of NFY/ETH LP token
  //const LPAddress = '0xAA47A8ee701cc64577a153D32537A450408C9AaA';

  // Token details
  let tokenName = 'Non-Fungible Yearn';
  let tokenSymbol = 'NFY';

  // Supply converted to 18 decimal places in constructor
  let totalSupply = 100000; // 100,000

  // Tokens before conversion to 18 decimals
  let initialLiquidityBefore = 4000; // 4,000
  let fundingSupplyBefore = 30000; // 30,000
  let rewardTokensBefore = 60000; // 60,000
  let teamTokensBefore = 6000; // 6,000
  let softCapBefore = 100; // 100 ETH
  const rewardLockLength = 1209600; // 14 days
  const teamLockLength = 2592000; // 30 days

  // Tokens after being converted to 18 decimals
  initialLiquidity = web3.utils.toWei(
    initialLiquidityBefore.toString(),
    'ether'
  );
  fundingSupply = web3.utils.toWei(fundingSupplyBefore.toString(), 'ether');
  rewardTokens = web3.utils.toWei(rewardTokensBefore.toString(), 'ether');
  teamTokens = web3.utils.toWei(teamTokensBefore.toString(), 'ether');
  softCap = web3.utils.toWei(softCapBefore.toString(), 'ether');

  // Funding details
  const fundingLength = 604800; // 7 day

  // Days 1-4
  const tokenPrice1 = web3.utils.toWei('0.03', 'ether'); // 0.03 ether

  // Days 5-7
  const tokenPrice2 = web3.utils.toWei('0.0375', 'ether'); // 0.0375 ether

  // Token deployment
  await deployer.deploy(NFY, tokenName, tokenSymbol, totalSupply);

  const token = await NFY.deployed();
  const NFYAddress = token.address;

  const factory = await IBSCswapFactory.at(
    '0xCe8fd65646F2a2a897755A1188C04aCe94D2B8D0'
  );

  await factory.createPair(
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    NFYAddress
  );
  const LPAddress = await factory.getPair(
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    NFYAddress
  );
  console.log('LPAddress: ', LPAddress);
  //const token = await NFY.at(NFYAddress);

  // Funding deployment
  // await deployer.deploy(Funding, token.address, fundingLength, tokenPrice1, tokenPrice2, softCap, fundingSupply, teamTokens, teamLockLength, rewardTokens, rewardLockLength);

  // const funding = await Funding.deployed()

  // Transfer ownership to secured secured account
  // await token.transferOwnership(owner);
  // await funding.transferOwnership(owner);

  // Send tokens to be sold to funding smart contract
  // await token.transfer(funding.address, fundingSupply);

  // Send team tokens to funding smart contract
  // await token.transfer(funding.address, teamTokens);

  // Send initial liquidity to owner so can add to UniSwap
  // await token.transfer(owner, initialLiquidity);

  // Send reward tokens to funding address
  // await token.transfer(funding.address, rewardTokens);

  ////////staking

  // Deploy reward pool
  await deployer.deploy(RewardPool, NFYAddress);

  const rewardPool = await RewardPool.deployed();
  // const rewardPool = await RewardPool.at('0x061867Bf6D879E2fCeE53A849969209a17D59a8f');

  // NFY Staking NFT deployment
  await deployer.deploy(NFYStakingNFTV2);

  // NFY/ETH LP Staking NFT deployment
  await deployer.deploy(LPStakingNFTV2);

  const nfyStakingNFT = await NFYStakingNFTV2.deployed();
  const lpStakingNFT = await LPStakingNFTV2.deployed();

  // const nfyStakingNFT = await NFYStakingNFTV2.at('0x76aa02173127b01B91a6875DEB52c88631CFB9bE');
  // const lpStakingNFT = await LPStakingNFTV2.at('0x50663B055019b11F4dFA3f6bf04F08dC10271762')

  // NFY Staking deployment
  await deployer.deploy(
    NFYStakingV2,
    NFYAddress,
    nfyStakingNFT.address,
    nfyStakingNFT.address,
    rewardPool.address,
    10
  );

  // NFY/ETH LP Staking deployment
  await deployer.deploy(
    LPStakingV2,
    LPAddress,
    NFYAddress,
    lpStakingNFT.address,
    lpStakingNFT.address,
    rewardPool.address,
    30
  );

  const nfyStaking = await NFYStakingV2.deployed();
  const lpStaking = await LPStakingV2.deployed();
  // const nfyStaking = await NFYStakingV2.at('0x96f0A75e2C6e077f0E541f2dEd3c7767D92F1943');
  // const lpStaking = await LPStakingV2.at('0x59772Ee6de32D4891d38e56c9f79500fb3A8A95e');

  await nfyStakingNFT.addPlatformAddress(nfyStaking.address);
  await lpStakingNFT.addPlatformAddress(lpStaking.address);

  // *** WILL NOT COMPILE LOCALLY WITH THIS --- DOES NOT RECOGNIZE ERC20 ADDRESS *** \\
  await rewardPool.allowTransferToStaking(
    nfyStaking.address,
    '11579208923731619542357098500868790785326998'
  );
  await rewardPool.allowTransferToStaking(
    lpStaking.address,
    '11579208923731619542357098500868790785326998'
  );

  // Transfer ownership to secured secured account
  await nfyStakingNFT.transferOwnership(owner);
  await lpStakingNFT.transferOwnership(owner);
  await nfyStaking.transferOwnership(owner);
  await lpStaking.transferOwnership(owner);
  await rewardPool.transferOwnership(owner);

  ////////////////////////////////////////////////////////////////////

  const rewardPoolAddress = rewardPool.address;
  // const nfyAddress = "0xF94413cF315cb461637BE61c2b9CF2a4b457a466";
  // const owner = "0x0aE7971DD94c5E39d21Da0D9C6a3B3C429360EC1";

  const devFeeAddress = '0x0aE7971DD94c5E39d21Da0D9C6a3B3C429360EC1';
  const communityAddress = '0xe5cb3c3d0871543a2072e70B66051A1E1bE81482';

  // TRADING PLATFORM //

  // Deploy Trading Platform
  await deployer.deploy(
    NFYTradingPlatform,
    NFYAddress,
    rewardPoolAddress,
    web3.utils.toWei('0.25', 'ether'),
    devFeeAddress,
    communityAddress,
    owner
  );
  const tradingPlatform = await NFYTradingPlatform.deployed();

  // Transfer ownership
  await tradingPlatform.transferOwnership(owner);
};
