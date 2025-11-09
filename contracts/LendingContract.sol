// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CompliantToken.sol";

/**
 * @title LendingContract
 * @dev Contract for issuing loans against tokenized assets
 */
contract LendingContract is Ownable, ReentrancyGuard {
    // Reference to the compliant token
    CompliantToken public token;
    
    // Bank address
    address public bankAddress;
    
    // Loan structure
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 interestRate; // in basis points (e.g., 500 = 5%)
        uint256 startTime;
        uint256 maturityTime;
        bool isActive;
        bool isRepaid;
    }
    
    // Mapping from loan ID to loan details
    mapping(uint256 => Loan) public loans;
    
    // Mapping from borrower to active loan IDs
    mapping(address => uint256[]) public borrowerLoans;
    
    // Loan counter
    uint256 public loanCounter;
    
    // Collateralization ratio (e.g., 150 = 150% = 1.5x)
    uint256 public collateralizationRatio; // in basis points
    
    // Events
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate
    );
    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 repaymentAmount
    );
    event CollateralLiquidated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 collateralAmount
    );
    
    modifier onlyBankOrOwner() {
        require(
            msg.sender == bankAddress || msg.sender == owner(),
            "LendingContract: Not authorized"
        );
        _;
    }
    
    modifier validLoan(uint256 loanId) {
        require(loans[loanId].loanId != 0, "LendingContract: Loan does not exist");
        _;
    }
    
    constructor(
        address _tokenAddress,
        address _bankAddress,
        uint256 _collateralizationRatio,
        address initialOwner
    ) Ownable(initialOwner) ReentrancyGuard() {
        require(_tokenAddress != address(0), "LendingContract: Invalid token address");
        require(_bankAddress != address(0), "LendingContract: Invalid bank address");
        require(_collateralizationRatio >= 10000, "LendingContract: Invalid collateralization ratio"); // Min 100%
        
        token = CompliantToken(_tokenAddress);
        bankAddress = _bankAddress;
        collateralizationRatio = _collateralizationRatio;
        loanCounter = 1;
    }
    
    /**
     * @dev Create a new loan
     * @param borrower Address of the borrower
     * @param collateralAmount Amount of tokens to use as collateral
     * @param loanAmount Amount to lend
     * @param interestRate Interest rate in basis points
     * @param duration Duration of the loan in seconds
     * @return loanId The ID of the created loan
     */
    function createLoan(
        address borrower,
        uint256 collateralAmount,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 duration
    ) external onlyBankOrOwner nonReentrant returns (uint256) {
        require(borrower != address(0), "LendingContract: Invalid borrower");
        require(collateralAmount > 0, "LendingContract: Invalid collateral amount");
        require(loanAmount > 0, "LendingContract: Invalid loan amount");
        require(duration > 0, "LendingContract: Invalid duration");
        
        // Check collateralization ratio
        require(
            (collateralAmount * 10000) >= (loanAmount * collateralizationRatio),
            "LendingContract: Insufficient collateral"
        );
        
        // Transfer collateral from borrower to this contract
        require(
            token.transferFrom(borrower, address(this), collateralAmount),
            "LendingContract: Collateral transfer failed"
        );
        
        uint256 loanId = loanCounter++;
        
        loans[loanId] = Loan({
            loanId: loanId,
            borrower: borrower,
            collateralAmount: collateralAmount,
            loanAmount: loanAmount,
            interestRate: interestRate,
            startTime: block.timestamp,
            maturityTime: block.timestamp + duration,
            isActive: true,
            isRepaid: false
        });
        
        borrowerLoans[borrower].push(loanId);
        
        // Transfer loan amount to borrower
        require(
            token.transfer(borrower, loanAmount),
            "LendingContract: Loan transfer failed"
        );
        
        emit LoanCreated(loanId, borrower, collateralAmount, loanAmount, interestRate);
        
        return loanId;
    }
    
    /**
     * @dev Repay a loan
     * @param loanId ID of the loan to repay
     */
    function repayLoan(uint256 loanId) external nonReentrant validLoan(loanId) {
        Loan storage loan = loans[loanId];
        
        require(loan.isActive, "LendingContract: Loan is not active");
        require(loan.borrower == msg.sender, "LendingContract: Not the borrower");
        require(!loan.isRepaid, "LendingContract: Loan already repaid");
        
        uint256 interest = (loan.loanAmount * loan.interestRate * (block.timestamp - loan.startTime)) / (10000 * 365 days);
        uint256 repaymentAmount = loan.loanAmount + interest;
        
        // Transfer repayment from borrower
        require(
            token.transferFrom(msg.sender, address(this), repaymentAmount),
            "LendingContract: Repayment transfer failed"
        );
        
        // Return collateral to borrower
        require(
            token.transfer(loan.borrower, loan.collateralAmount),
            "LendingContract: Collateral return failed"
        );
        
        loan.isActive = false;
        loan.isRepaid = true;
        
        emit LoanRepaid(loanId, loan.borrower, repaymentAmount);
    }
    
    /**
     * @dev Liquidate collateral for a defaulted loan
     * @param loanId ID of the loan to liquidate
     */
    function liquidateCollateral(uint256 loanId) external onlyBankOrOwner validLoan(loanId) {
        Loan storage loan = loans[loanId];
        
        require(loan.isActive, "LendingContract: Loan is not active");
        require(block.timestamp > loan.maturityTime, "LendingContract: Loan not yet matured");
        require(!loan.isRepaid, "LendingContract: Loan already repaid");
        
        loan.isActive = false;
        
        // Collateral stays in the contract (can be transferred by bank/owner)
        emit CollateralLiquidated(loanId, loan.borrower, loan.collateralAmount);
    }
    
    /**
     * @dev Get loan details
     * @param loanId ID of the loan
     * @return loan The loan structure
     */
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
    
    /**
     * @dev Get all loans for a borrower
     * @param borrower Address of the borrower
     * @return loanIds Array of loan IDs
     */
    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return borrowerLoans[borrower];
    }
    
    /**
     * @dev Calculate interest for a loan
     * @param loanId ID of the loan
     * @return interest The calculated interest
     */
    function calculateInterest(uint256 loanId) external view validLoan(loanId) returns (uint256) {
        Loan memory loan = loans[loanId];
        if (!loan.isActive || loan.isRepaid) {
            return 0;
        }
        uint256 timeElapsed = block.timestamp - loan.startTime;
        return (loan.loanAmount * loan.interestRate * timeElapsed) / (10000 * 365 days);
    }
}

