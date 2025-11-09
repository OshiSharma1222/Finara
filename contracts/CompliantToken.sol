// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CompliantToken
 * @dev ERC-3643 inspired compliant token that only allows verified KYCed customers
 * to hold and transfer tokens. This is a simplified implementation focusing on
 * the core compliance features.
 */
contract CompliantToken is ERC20, Ownable, ReentrancyGuard {
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {}

    // Mapping to track KYC-verified addresses
    mapping(address => bool) public isVerified;
    
    // Mapping to track frozen addresses (for compliance)
    mapping(address => bool) public isFrozen;
    
    // Mapping to track authorized verifiers (e.g., relayers)
    mapping(address => bool) public isAuthorizedVerifier;
    
    // Bank address that deployed this token
    address public bankAddress;
    
    // Total supply cap
    uint256 public maxSupply;
    
    // Events
    event AddressVerified(address indexed account, bool verified);
    event AddressFrozen(address indexed account, bool frozen);
    event TokenMinted(address indexed to, uint256 amount);
    event TokenBurned(address indexed from, uint256 amount);
    
    modifier onlyVerified(address account) {
        require(isVerified[account], "CompliantToken: Address not verified");
        require(!isFrozen[account], "CompliantToken: Address is frozen");
        _;
    }
    
    modifier onlyBankOrOwner() {
        require(
            msg.sender == bankAddress || msg.sender == owner() || isAuthorizedVerifier[msg.sender],
            "CompliantToken: Not authorized"
        );
        _;
    }
    
    function initialize(
        address _bankAddress,
        uint256 _maxSupply
    ) external onlyOwner {
        require(_bankAddress != address(0), "CompliantToken: Invalid bank address");
        require(bankAddress == address(0), "CompliantToken: Already initialized");
        bankAddress = _bankAddress;
        maxSupply = _maxSupply;
    }
    
    /**
     * @dev Add an authorized verifier (e.g., relayer)
     * @param verifier Address to authorize
     */
    function addAuthorizedVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "CompliantToken: Invalid verifier address");
        isAuthorizedVerifier[verifier] = true;
    }
    
    /**
     * @dev Remove an authorized verifier
     * @param verifier Address to remove
     */
    function removeAuthorizedVerifier(address verifier) external onlyOwner {
        isAuthorizedVerifier[verifier] = false;
    }
    
    /**
     * @dev Verify an address (KYC compliance)
     * @param account Address to verify
     */
    function verifyAddress(address account) external onlyBankOrOwner {
        require(account != address(0), "CompliantToken: Invalid address");
        isVerified[account] = true;
        emit AddressVerified(account, true);
    }
    
    /**
     * @dev Batch verify addresses
     * @param accounts Array of addresses to verify
     */
    function batchVerifyAddresses(address[] calldata accounts) external onlyBankOrOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                isVerified[accounts[i]] = true;
                emit AddressVerified(accounts[i], true);
            }
        }
    }
    
    /**
     * @dev Revoke verification of an address
     * @param account Address to revoke
     */
    function revokeVerification(address account) external onlyBankOrOwner {
        isVerified[account] = false;
        emit AddressVerified(account, false);
    }
    
    /**
     * @dev Freeze an address (compliance action)
     * @param account Address to freeze
     */
    function freezeAddress(address account) external onlyBankOrOwner {
        isFrozen[account] = true;
        emit AddressFrozen(account, true);
    }
    
    /**
     * @dev Unfreeze an address
     * @param account Address to unfreeze
     */
    function unfreezeAddress(address account) external onlyBankOrOwner {
        isFrozen[account] = false;
        emit AddressFrozen(account, false);
    }
    
    /**
     * @dev Mint tokens to a verified address
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyBankOrOwner onlyVerified(to) {
        require(totalSupply() + amount <= maxSupply, "CompliantToken: Exceeds max supply");
        _mint(to, amount);
        emit TokenMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from an address
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external onlyBankOrOwner {
        _burn(from, amount);
        emit TokenBurned(from, amount);
    }
    
    /**
     * @dev Override transfer to enforce compliance
     */
    function transfer(address to, uint256 amount) 
        public 
        virtual 
        override 
        onlyVerified(msg.sender) 
        onlyVerified(to) 
        returns (bool) 
    {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to enforce compliance
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        virtual 
        override 
        onlyVerified(from) 
        onlyVerified(to) 
        returns (bool) 
    {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Get verification status of an address
     * @param account Address to check
     * @return verified Whether address is verified
     * @return frozen Whether address is frozen
     */
    function getVerificationStatus(address account) 
        external 
        view 
        returns (bool verified, bool frozen) 
    {
        return (isVerified[account], isFrozen[account]);
    }
}

