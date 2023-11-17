let hre = require('hardhat')

async function main() {


  //////////////////ADMIN//////////////
  // await Hre.run("verify:verify", {
  //   //Deployed contract Factory proxy
  //   address: "0xC18c3B99aBe0a92b2ABb552EAeEf855dA60E996e",
  //   //Path of your main contract.
  //   contract: "contracts/Admin.sol:Admin"
  // });

  // //////////////////ADMIN PROXY///////////////////
  // await Hre.run("verify:verify", {
  //   //Deployed contract address
  //   address: "0x4400ce17901efab8d4b11ea1098d6C88B64b0F51",
  //   //Pass arguments as string and comma seprated values
  //   constructorArguments: [],
  //   //Path of your main contract.
  //   contract: "contracts/Periphery/OwnedUpgradeabilityProxy.sol:OwnedUpgradeabilityProxy",
  // });

  /////////////////tokenFACTORY PROXY/////////////////
  // await Hre.run("verify:verify", {
  //   //Deployed contract address
  //   address: "0xb0f66BdB89Dd6D8ddfc25102838FeccB38A5fBe9",
  //   //Pass arguments as string and comma seprated values
  //   constructorArguments: [],
  //   //Path of your main contract.
  //   contract: "contracts/Periphery/OwnedUpgradeabilityProxy.sol:OwnedUpgradeabilityProxy",
  // });


  // await hre.run("verify:verify",{
  //   //Deployed contract TokenFactory proxy
  //   address: "0xe9BCd9DAf7969e02c0cC3835A6BAEa142674CdD7",
  //   constructorArguments: ["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"],

  //   //Path of your main contract.
  //   contract: "contracts/samples/gnosis/EIP4337Manager.sol:EIP4337Manager"
  // });


  //   await hre.run("verify:verify", {
  //   //Deployed contract Factory address
  //   address: "0x78e358094BA0b8df0C557997eB873a9F9Ae2c609",
  //   constructorArguments: ["0x3b811aBdd20c246cEaC49444cE91B526864EaAF7","0x62750488370Ae86d53115B5651801E4BcfAbf960","0xe9BCd9DAf7969e02c0cC3835A6BAEa142674CdD7"],

  //   //Path of your main contract.
  //   contract: "contracts/samples/gnosis/GnosisAccountFactory.sol:GnosisSafeAccountFactory",
  // });

  //////////////////SAFEPROXY FACTORY///////////////////////////
  // await hre.run("verify:verify", {
  //   //Deployed contract MarketPlace proxy
  //   address: "0x3b811aBdd20c246cEaC49444cE91B526864EaAF7",
  //   //Path of your main contract.
  //   contract: '@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol:GnosisSafeProxyFactory'
  // });
  // // // ////////////////////SAFEL2//////////////////////
  // await Hre.run("verify:verify",{
  //   //Deployed contract MarketPlace proxy
  //   address: "0x434b592F96bde2ab571243187A87fd5dB21fE877",
  //   //Path of your main contract.
  //   contract: "contracts/GnosisSafeL2.sol:GnosisSafeL2"
  // });

  //////////////SAFE////////////////
  console.log('object');
  // await hre.run("verify:verify", {
  //   //Deployed contract MarketPlace proxy
  //   address: "0xf4a460821966DB6566cf64F24571C1787697Ca4D",
  //   //Path of your main contract.
  //   contract: "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol:GnosisSafe"
  // });

  await hre.run("verify:verify", {
    //Deployed contract MarketPlace proxy
    address: "0xf4a460821966DB6566cf64F24571C1787697Ca4D",
    //Path of your main contract.
    constructorArguments: ["0x62750488370Ae86d53115B5651801E4BcfAbf960"],

    contract: "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol:GnosisSafeProxy"
  });
  ////////////////////FORWARD/////////////////////////
  // await Hre.run("verify:verify", {
  //   //Deployed contract TokenFactory proxy
  //   address: "0xeFece3F2420fF9093AA2740c9d1620b3Ea5b34d5",
  //   //Path of your main contract.
  //   contract: "contracts/Core/Forward.sol:Forward"
  // });
  // //////////////////////RoobaNFT/////////////////////////

  //  await Hre.run("verify:verify", {
  //   //Deployed contract TokenFactory proxy
  //   address: "0x59651a6FCFa116D0c6fCb72a417F81506743a9b4",
  //   //Path of your main contract.
  //   contract: "contracts/Core/RoobaNFT.sol:RoobaNFT"
  // });

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });