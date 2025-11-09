// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CompliantToken.sol";
import "./LendingContract.sol";

/**
 * @title BankFactory
 * @dev Factory contract to deploy Token and Lending contracts for each bank
 */
contract BankFactory is Ownable {
    constructor() Ownable(msg.sender) {}
    // Structure to store bank deployment info
    struct BankDeployment {
        address bankAddress;
        address tokenAddress;
        address lendingAddress;
        string bankName;
        uint256 deployedAt;
    }
    
    // Mapping from bank address to deployment info
    mapping(address => BankDeployment) public bankDeployments;
    
    // Array of all deployed banks
    address[] public deployedBanks;
    
    // Events
    event BankDeployed(
        address indexed bankAddress,
        address indexed tokenAddress,
        address indexed lendingAddress,
        string bankName
    );
    
    /**
     * @dev Deploy a new bank setup (Token + Lending contracts)
     * @param bankAddress Address of the bank
     * @param bankName Name of the bank
     * @param tokenName Name of the token
     * @param tokenSymbol Symbol of the token
     * @param maxSupply Maximum supply of tokens
     * @param collateralizationRatio Collateralization ratio for loans (in basis points)
     * @return tokenAddress Address of the deployed token contract
     * @return lendingAddress Address of the deployed lending contract
     */
    function deployBank(
        address bankAddress,
        string memory bankName,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 maxSupply,
        uint256 collateralizationRatio
    ) external onlyOwner returns (address tokenAddress, address lendingAddress) {
        require(bankAddress != address(0), "BankFactory: Invalid bank address");
        require(bytes(bankName).length > 0, "BankFactory: Invalid bank name");
        require(maxSupply > 0, "BankFactory: Invalid max supply");
        require(collateralizationRatio >= 10000, "BankFactory: Invalid collateralization ratio");
        
        // Deploy CompliantToken (factory is initial owner)
        CompliantToken token = new CompliantToken(
            tokenName,
            tokenSymbol,
            address(this)
        );
        token.initialize(bankAddress, maxSupply);
        tokenAddress = address(token);
        
        // Deploy LendingContract (factory is initial owner)
        LendingContract lending = new LendingContract(
            tokenAddress,
            bankAddress,
            collateralizationRatio,
            address(this)
        );
        lendingAddress = address(lending);
        
        // Authorize the caller (relayer) to verify customers before transferring ownership
        token.addAuthorizedVerifier(msg.sender);
        
        // Transfer ownership to bank
        token.transferOwnership(bankAddress);
        lending.transferOwnership(bankAddress);
        
        // Store deployment info
        bankDeployments[bankAddress] = BankDeployment({
            bankAddress: bankAddress,
            tokenAddress: tokenAddress,
            lendingAddress: lendingAddress,
            bankName: bankName,
            deployedAt: block.timestamp
        });
        
        deployedBanks.push(bankAddress);
        
        emit BankDeployed(bankAddress, tokenAddress, lendingAddress, bankName);
        
        return (tokenAddress, lendingAddress);
    }
    
    /**
     * @dev Get deployment info for a bank
     * @param bankAddress Address of the bank
     * @return deployment The deployment structure
     */
    function getBankDeployment(address bankAddress) 
        external 
        view 
        returns (BankDeployment memory) 
    {
        return bankDeployments[bankAddress];
    }
    
    /**
     * @dev Get all deployed banks
     * @return banks Array of bank addresses
     */
    function getAllDeployedBanks() external view returns (address[] memory) {
        return deployedBanks;
    }
    
    /**
     * @dev Check if a bank is deployed
     * @param bankAddress Address of the bank
     * @return isDeployed Whether the bank is deployed
     */
    function isBankDeployed(address bankAddress) external view returns (bool) {
        return bankDeployments[bankAddress].bankAddress != address(0);
    }
}

