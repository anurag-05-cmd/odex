// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Odex {

    enum State { Created, BuyerStaked, Active, Released, Completed, Cancelled }

    struct Trade {
        uint256 tradeId;
        address payable seller;
        address payable buyer;
        uint256 price;
        uint256 sellerStake;
        uint256 buyerStake;
        uint256 activationTime;
        State state;
    }

    struct Metadata {
        string itemName;
        string itemDescription;
        string category;
    }

    mapping(uint256 => Trade) public trades;
    mapping(uint256 => Metadata) public tradeMetadata;
    uint256 public tradeCounter;

    event ListingCreated(uint256 indexed tradeId, address seller, uint256 price, string itemName, string category);
    event BuyerStaked(uint256 indexed tradeId, address buyer, uint256 amount);
    event Active(uint256 indexed tradeId, uint256 timestamp);
    event ItemReleased(uint256 indexed tradeId);
    event TradeCompleted(uint256 indexed tradeId);
    event Refunded(uint256 indexed tradeId, string reason);

    modifier onlySeller(uint256 _tradeId) {
        require(msg.sender == trades[_tradeId].seller, "Only seller can call this");
        _;
    }

    modifier onlyBuyer(uint256 _tradeId) {
        require(msg.sender == trades[_tradeId].buyer, "Only buyer can call this");
        _;
    }

    modifier inState(uint256 _tradeId, State _state) {
        require(trades[_tradeId].state == _state, "Invalid state for this action");
        _;
    }

    function createListing(
        uint256 _price,
        string memory _itemName,
        string memory _itemDescription,
        string memory _category
    ) external {
        tradeCounter++;
        trades[tradeCounter] = Trade({
            tradeId: tradeCounter,
            seller: payable(msg.sender),
            buyer: payable(address(0)),
            price: _price,
            sellerStake: 0,
            buyerStake: 0,
            activationTime: 0,
            state: State.Created
        });

        tradeMetadata[tradeCounter] = Metadata({
            itemName: _itemName,
            itemDescription: _itemDescription,
            category: _category
        });

        emit ListingCreated(tradeCounter, msg.sender, _price, _itemName, _category);
    }

    function getMetadata(uint256 _tradeId) external view returns (Metadata memory) {
        return tradeMetadata[_tradeId];
    }

    function buyerDeposit(uint256 _tradeId) external payable inState(_tradeId, State.Created) {
        Trade storage trade = trades[_tradeId];
        require(msg.value == trade.price * 2, "Must stake exactly 2x the price");

        trade.buyer = payable(msg.sender);
        trade.buyerStake = msg.value;
        trade.state = State.BuyerStaked;

        emit BuyerStaked(_tradeId, msg.sender, msg.value);
    }

    function sellerDeposit(uint256 _tradeId) external payable onlySeller(_tradeId) inState(_tradeId, State.BuyerStaked) {
        Trade storage trade = trades[_tradeId];
        require(msg.value == (trade.price * 3) / 2, "Must stake exactly 1.5x the price");

        trade.sellerStake = msg.value;
        trade.activationTime = block.timestamp;
        trade.state = State.Active;

        emit Active(_tradeId, block.timestamp);
    }

    function markItemReleased(uint256 _tradeId) external onlySeller(_tradeId) inState(_tradeId, State.Active) {
        Trade storage trade = trades[_tradeId];
        
        require(block.timestamp <= trade.activationTime + 5 minutes, "Timeout: 5 minutes passed, funds must be refunded");

        trade.state = State.Released;
        emit ItemReleased(_tradeId);
    }

    function refundTimeout(uint256 _tradeId) external inState(_tradeId, State.Active) {
        Trade storage trade = trades[_tradeId];
        require(block.timestamp > trade.activationTime + 5 minutes, "Wait for 5 minute timer to expire");

        trade.state = State.Cancelled;

        address payable s = trade.seller;
        address payable b = trade.buyer;
        uint256 sStake = trade.sellerStake;
        uint256 bStake = trade.buyerStake;

    
        trade.sellerStake = 0;
        trade.buyerStake = 0;

        (bool successS, ) = s.call{value: sStake}("");
        require(successS, "Transfer to seller failed");

        (bool successB, ) = b.call{value: bStake}("");
        require(successB, "Transfer to buyer failed");

        emit Refunded(_tradeId, "Seller failed to release in 5 mins");
    }

    function confirmDelivery(uint256 _tradeId) external onlyBuyer(_tradeId) inState(_tradeId, State.Released) {
        Trade storage trade = trades[_tradeId];

        trade.state = State.Completed;
        
        uint256 sellerPayout = trade.sellerStake + trade.price; 
        uint256 buyerRefund = trade.buyerStake - trade.price;

        trade.sellerStake = 0;
        trade.buyerStake = 0;

        (bool successS, ) = trade.seller.call{value: sellerPayout}("");
        require(successS, "Transfer to seller failed");

        (bool successB, ) = trade.buyer.call{value: buyerRefund}("");
        require(successB, "Transfer to buyer failed");

        emit TradeCompleted(_tradeId);
    }
    
    function emergencyWithdrawBuyer(uint256 _tradeId) external onlyBuyer(_tradeId) inState(_tradeId, State.BuyerStaked) {
        Trade storage trade = trades[_tradeId];
        trade.state = State.Cancelled;
        uint256 amount = trade.buyerStake;
        
        trade.buyerStake = 0;

        (bool success, ) = trade.buyer.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Refunded(_tradeId, "Buyer withdrew before Seller staked");
    }
}