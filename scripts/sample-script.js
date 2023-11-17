// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main () {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"


  const GnosisSafe = await hre.ethers.getContractFactory('GnosisSafe')
  const singleton = await GnosisSafe.deploy()
  await singleton.deployed()
  console.log('Singleton deployed to:', singleton.address)
  await sleep(8000);

  const SimpleAccount = await hre.ethers.getContractFactory('SimpleAccount')
  const simpleAccount = await SimpleAccount.deploy(entryPoint)
  await simpleAccount.deployed()
  console.log('SimpleAccount deployed to:', simpleAccount.address)
  await sleep(8000);


  const ERC4337Manager = await hre.ethers.getContractFactory('EIP4337Manager')
  const erc4337manager = await ERC4337Manager.deploy(entryPoint);
  await erc4337manager.deployed()
  console.log('ERC4337Manager deployed to:', erc4337manager.address)

  await sleep(8000);

  const GnosisSafeProxyFactory = await hre.ethers.getContractFactory('GnosisSafeProxyFactory')
  const gnosisSafeProxyFactory = await GnosisSafeProxyFactory.deploy()
  await gnosisSafeProxyFactory.deployed()
  console.log('GnosisSafeProxyFactory deployed to:', gnosisSafeProxyFactory.address)

  await sleep(20000);

  const GnosisAccountFactory = await hre.ethers.getContractFactory('GnosisSafeAccountFactory')
  const gnosisAccountFactory = await GnosisAccountFactory.deploy(gnosisSafeProxyFactory.address,singleton.address,erc4337manager.address)
  await gnosisAccountFactory.deployed()
  console.log('GnosisAccountFactory deployed to:', gnosisAccountFactory.address)



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
