import Web3 from "web3";
declare const web3: Web3<import("web3-eth").RegisteredSubscription>;
declare const contractOwner: string | undefined;
declare const contractOwnerPkey: string | undefined;
declare const contractAddress: string;
declare const votingContract: import("web3").Contract<import("web3").AbiFragment[]>;
export { web3, votingContract, contractOwner, contractOwnerPkey, contractAddress, };
