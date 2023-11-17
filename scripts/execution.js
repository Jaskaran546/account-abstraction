// const { executeContractCallWithSigners } = require("@gnosis.pm/safe-contracts");
const { executeContractCallWithSigners } = require("../scripts/gnosis-utils");
// const { executeContractCallWithSigners as execute}  = require("../scripts/gnosis-utils-execute");
// import { executeContractCallWithSigners as execute } from './gnosis-utils-execute';
const gnosisUtils = require("./gnosis-utils-execute");
const execute = gnosisUtils.executeContractCallWithSigners;
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");
const gnosisSafeABI = require("../scripts/gnosisSafe.json");
async function main() {
  const owner = "0x1671fc001505af8433B259a60dc2638ae6DaBf0b";
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );
  async function get_signer_n_provider(key, rpc) {
    let p = null,
      s = null;
    p = new ethers.providers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, p);
    return {
      signer: wallet,
      provider: p,
    };
  }
  const sp = await get_signer_n_provider(
    "f3d1aaea7abad660f00d3e5f39d0680e37196b7f794cafc335f29bd62406838f",
    "https://rpc-mumbai.maticvigil.com"
  );
  // console.log('sp.signer :>> ', sp.signer);
  const signer = new Wallet(
    "f3d1aaea7abad660f00d3e5f39d0680e37196b7f794cafc335f29bd62406838f",
    provider
  );
  let signer2 = new ethers.Wallet(
    "7833fff1c4ae6856f8622884a4e537f093732b278ce7e90726a1f3a0a476ca56",
    provider
  );

  const GnosisSafe = await hre.ethers.getContractFactory("GnosisSafe");

  const SimpleAccount = await hre.ethers.getContractFactory("SimpleAccount");

  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.attach(
    "0x623140575Dac3e9734046Fbcc84cAD20F0797B85"
  );
  const ERC4337Manager = await hre.ethers.getContractFactory("EIP4337Manager");

  const GnosisSafeProxyFactory = await hre.ethers.getContractFactory(
    "GnosisSafeProxyFactory"
  );

  const GnosisAccountFactory = await hre.ethers.getContractFactory(
    "GnosisSafeAccountFactory"
  );
  const gnosisAccountFactory = await GnosisAccountFactory.attach(
    "0x78e358094BA0b8df0C557997eB873a9F9Ae2c609"
  );

  const estimateAddress = await gnosisAccountFactory.getAddress(owner, 1);
  console.log("initializer :>> ", estimateAddress);

  //   const response = await gnosisAccountFactory.createAccount(owner, 1);
  //   console.log("response", response);
  const safeContract = new ethers.Contract(
    estimateAddress,
    gnosisSafeABI,
    provider
  );
  const mintCallData = await testToken.interface.encodeFunctionData("mint", [
    "0x1671fc001505af8433B259a60dc2638ae6DaBf0b",
    1000000,
  ]);
  console.log("mintCallData :>> ", mintCallData);

  const gnosisSafeAccount = await GnosisSafe.attach(estimateAddress);
  // console.log("gnosisSafeAccount :>> ", gnosisSafeAccount);

  const response = await executeContractCallWithSigners(
    safeContract,
    safeContract,
    "enableModule",
    ["0xe9BCd9DAf7969e02c0cC3835A6BAEa142674CdD7"],
    [sp.signer, signer2],
    provider,
    false
  );
  console.log("response", response);

  const txnHash = await execute(
    sp,
    safeContract,
    safeContract,
    "enableModule",
    ["0xe9BCd9DAf7969e02c0cC3835A6BAEa142674CdD7"],
    response,
    false
  );
  console.log("here");

  // const result = await gnosisSafeAccount.execTransaction(
  //   txnHash.to,
  //   txnHash.value,
  //   txnHash.data,
  //   txnHash.operation,
  //   txnHash.safeTxGas,
  //   txnHash.baseGas,
  //   txnHash.gasPrice,
  //   txnHash.gasToken,
  //   txnHash.refundReceiver,
  //   txnHash.signatureBytes
  // );


  // const result = await gnosisSafeAccount.execTransactionFromModuleReturnData(
  //   "0x623140575Dac3e9734046Fbcc84cAD20F0797B85",
  //   0,
  //   mintCallData,
  //   0
  // );
  // console.log("result", result);

  const Accountowner = await safeContract.getOwners();
  const threshold = await safeContract.getThreshold();

  const moduleCheck = await safeContract.isModuleEnabled(
    "0xe9BCd9DAf7969e02c0cC3835A6BAEa142674CdD7"
  );
  console.log("owner :>> ", Accountowner, threshold, moduleCheck);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
