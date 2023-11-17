import { Contract, utils, BigNumber, BigNumberish, Signer, PopulatedTransaction, ethers } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { log } from 'console';
// import biconomyHelper from '../commonServices/biconomy.gnosis';
// import { FACTORY_ABI } from '../abi/factoryabi';
// import { GNOSIS_ABI } from '../abi/gnosis';
// import { BRIDGE_ABI } from '../abi/bridgeABI';
// const { Biconomy } = require("@biconomy/mexa")

export const EIP_DOMAIN = {
  EIP712Domain: [
    { type: 'uint256', name: 'chainId' },
    { type: 'address', name: 'verifyingContract' },
  ],
};

export const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
};

export const EIP712_SAFE_MESSAGE_TYPE = {
  // "SafeMessage(bytes message)"
  SafeMessage: [{ type: 'bytes', name: 'message' }],
};

export interface MetaTransaction {
  to: string;
  value: string | number | BigNumber;
  data: string;
  operation: number;
}

export interface SafeTransaction extends MetaTransaction {
  safeTxGas: string | number;
  baseGas: string | number;
  gasPrice: string | number;
  gasToken: string;
  refundReceiver: string;
  nonce: string | number;
}

export interface SafeSignature {
  signer: string;
  data: string;
}

export const calculateSafeDomainSeparator = (safe: Contract, chainId: BigNumberish): string => {
  return utils._TypedDataEncoder.hashDomain({ verifyingContract: safe.address, chainId });
};

export const preimageSafeTransactionHash = (safe: Contract, safeTx: SafeTransaction, chainId: BigNumberish): string => {
  return utils._TypedDataEncoder.encode({ verifyingContract: safe.address, chainId }, EIP712_SAFE_TX_TYPE, safeTx);
};

export const calculateSafeTransactionHash = (
  safe: Contract,
  safeTx: SafeTransaction,
  chainId: BigNumberish,
): string => {
  return utils._TypedDataEncoder.hash({ verifyingContract: safe.address, chainId }, EIP712_SAFE_TX_TYPE, safeTx);
};

export const calculateSafeMessageHash = (safe: Contract, message: string, chainId: BigNumberish): string => {
  return utils._TypedDataEncoder.hash({ verifyingContract: safe.address, chainId }, EIP712_SAFE_MESSAGE_TYPE, {
    message,
  });
};

export const safeApproveHash = async (
  signer: Signer,
  safe: Contract,
  safeTx: SafeTransaction,
  skipOnChainApproval?: boolean,
): Promise<SafeSignature> => {
  if (!skipOnChainApproval) {
    if (!signer.provider) throw Error('Provider required for on-chain approval');
    const chainId = (await signer.provider.getNetwork()).chainId;
    const typedDataHash = utils.arrayify(calculateSafeTransactionHash(safe, safeTx, chainId));
    const signerSafe = safe.connect(signer);
    await signerSafe.approveHash(typedDataHash);
  }
  const signerAddress = await signer.getAddress();
  return {
    signer: signerAddress,
    data: `0x000000000000000000000000 ${signerAddress.slice(
      2,
    )} 000000000000000000000000000000000000000000000000000000000000000001`,
  };
};

export const safeSignTypedData = async (
  signer: any,
  safe: Contract,
  safeTx: SafeTransaction,
  chainId?: BigNumberish,
): Promise<SafeSignature> => {
  if (!chainId && !signer.provider) throw Error('Provider required to retrieve chainId');
  const cid = chainId || (await signer.provider!!.getNetwork()).chainId;
  const signerAddress = await signer.getAddress();
  return {
    signer: signerAddress,
    data: await signer._signTypedData({ verifyingContract: safe.address, chainId: cid }, EIP712_SAFE_TX_TYPE, safeTx),
  };
};

export const signHash = async (signer: Signer, hash: string): Promise<SafeSignature> => {
  const typedDataHash = utils.arrayify(hash);
  const signerAddress = await signer.getAddress();
  return {
    signer: signerAddress,
    data: (await signer.signMessage(typedDataHash)).replace(/1b$/, '1f').replace(/1c$/, '20'),
  };
};

export const safeSignMessage = async (
  signer: Signer,
  safe: Contract,
  safeTx: SafeTransaction,
  chainId?: BigNumberish,
): Promise<SafeSignature> => {
  const cid = chainId || (await signer.provider!!.getNetwork()).chainId;
  return signHash(signer, calculateSafeTransactionHash(safe, safeTx, cid));
};

export const buildSignatureBytes = (signs: SafeSignature[]): string => {
  // console.log(
  //   'signs :>> ',
  //   signs.sort((left, right) => left.signer.localeCompare(right.signer)),
  // );
  console.log('signs :>> ', signs);
  // signs.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()));


  let signatureBytes = '0x';
  for (const sig of signs) {
    signatureBytes += sig.data.slice(2);
  }
  return signatureBytes;
};

export const logGas = async (message: string, tx: Promise<any>, skip?: boolean): Promise<any> => {
  return tx.then(async (result) => {
    await result.wait();
    if (!skip) return result;
  });
};

export const executeTx = async (sp: any, safe: Contract, safeTx: SafeTransaction, signs: any, overrides?: any): Promise<any> => {
  console.log('1 :>>================== dsad', 1)
  // const signatureBytes = await buildSignatureBytes(signs);
  const signatureBytes = signs;
  // console.log('safe :>> ', safe);
  // const txn = await safe.execTransaction(safeTx.to, safeTx.value, safeTx.data, safeTx.operation, safeTx.safeTxGas, safeTx.baseGas, safeTx.gasPrice, safeTx.gasToken, safeTx.refundReceiver, signs, overrides || { gasLimit: 9000000 })
  
  // return txn;
  return {
    to: safeTx.to, value: safeTx.value, data: safeTx.data, operation: safeTx.operation, safeTxGas: safeTx.safeTxGas, baseGas: safeTx.baseGas, gasPrice: safeTx.gasPrice, gasToken: safeTx.gasToken, refundReceiver: safeTx.refundReceiver, signatureBytes: signatureBytes
  }

};

export const populateExecuteTx = async (
  safe: Contract,
  safeTx: SafeTransaction,
  signatures: SafeSignature[],
  overrides?: any,
): Promise<PopulatedTransaction> => {
  const signatureBytes = buildSignatureBytes(signatures);
  return safe.populateTransaction.execTransaction(
    safeTx.to,
    safeTx.value,
    safeTx.data,
    safeTx.operation,
    safeTx.safeTxGas,
    safeTx.baseGas,
    safeTx.gasPrice,
    safeTx.gasToken,
    safeTx.refundReceiver,
    signatureBytes,
    overrides || {},
  );
};

export const buildContractCall = (
  contract: Contract,
  method: string,
  params: any[],
  nonce: number,
  delegateCall?: boolean,
  overrides?: Partial<SafeTransaction>,
): SafeTransaction => {
  const data = contract.interface.encodeFunctionData(method, params);

  return buildSafeTransaction(
    Object.assign(
      {
        to: contract.address,
        data,
        operation: delegateCall ? 1 : 0,
        nonce,
      },
      overrides,
    ),
  );
};

export const executeTxWithSigners = async (sp: any, safe: Contract, tx: SafeTransaction, signs: any[], overrides?: any) => {
  return executeTx(sp, safe, tx, signs, overrides);
};

export const executeContractCallWithSigners = async (
  sp: any,
  safe: Contract,
  contract: Contract,
  method: string,
  params: any[],
  signs: any[],
  delegateCall?: boolean,
  overrides?: Partial<SafeTransaction>,
) => {
  console.log("in execute");
  const nonce = await safe.nonce();
  console.log("nonce", nonce);
  const tx = buildContractCall(contract, method, params, nonce, delegateCall, overrides);
  console.log('after tx');
  const arr: any[] = await executeTxWithSigners(sp, safe, tx, signs, overrides)
  // console.log('first,second :>> ', arr);
  return executeTxWithSigners(sp, safe, tx, signs);
};

export const executeContractCallWithSignersBuy = async (
  sp: any,
  safe: Contract,
  contract: Contract,
  method: string,
  params: any[],
  signs: any[],
  delegateCall?: boolean,
  overrides?: Partial<SafeTransaction>,
) => {
  const nonceMain = await safe.nonce();
  let non = parseFloat(nonceMain) + 1;
  const nonce: any = {
    type: 'BigNumber',
    hex: '0x0' + non,
  };
  const tx = buildContractCall(contract, method, params, nonce, delegateCall, overrides);
  //console.log('tx :>> ', tx);
  return executeTxWithSigners(sp, safe, tx, signs);
};

export const buildSafeTransaction = (template: {
  to: string;
  value?: BigNumber | number | string;
  data?: string;
  operation?: number;
  safeTxGas?: number | string;
  baseGas?: number | string;
  gasPrice?: number | string;
  gasToken?: string;
  refundReceiver?: string;
  nonce: number;
}): SafeTransaction => {
  return {
    to: template.to,
    value: template.value || 0,
    data: template.data || '0x',
    operation: template.operation || 0,
    safeTxGas: template.safeTxGas || 100000,
    baseGas: template.baseGas || 10000000,
    gasPrice: template.gasPrice || 0,
    gasToken: template.gasToken || AddressZero,
    refundReceiver: template.refundReceiver || AddressZero,
    nonce: template.nonce,
  };
};
