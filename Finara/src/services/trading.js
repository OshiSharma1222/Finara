// Lightweight frontend trading service using localStorage to persist listings and trades
const STORAGE_KEY = 'finara_trading_v1';

function uid(prefix = ''){
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function read(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { marketplace: [], trades: [] };
    return JSON.parse(raw);
  }catch(e){
    console.error('trading: read error', e);
    return { marketplace: [], trades: [] };
  }
}

function write(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getMarketplace(){
  const s = read();
  return s.marketplace || [];
}

function getTrades(){
  const s = read();
  return s.trades || [];
}

function getHistoryForAccount(accountId){
  if(!accountId) return [];
  const trades = getTrades();
  return trades.filter(t => t.buyerId === accountId || t.sellerId === accountId).sort((a,b)=>b.timestamp-a.timestamp);
}

function listAsset({ sellerId, assetId, assetType, quantity, tokens, price, percentage }){
  const state = read();
  const listing = {
    listingId: uid('L_'),
    sellerId,
    assetId,
    assetType,
    quantity,
    tokens,
    price: Number(price) || 0,
    percentage: Number(percentage) || 100,
    status: 'Listed',
    timestamp: Date.now()
  };
  state.marketplace = state.marketplace || [];
  state.marketplace.push(listing);
  write(state);
  return listing;
}

function buyAsset({ buyerId, listingId, priceOverride }){
  const state = read();
  state.marketplace = state.marketplace || [];
  state.trades = state.trades || [];

  const idx = state.marketplace.findIndex(l => l.listingId === listingId);
  if(idx === -1) throw new Error('Listing not found');

  const listing = state.marketplace[idx];
  // Create trade record
  const trade = {
    tradeId: uid('T_'),
    listingId: listing.listingId,
    assetId: listing.assetId,
    assetType: listing.assetType,
    sellerId: listing.sellerId,
    buyerId,
    price: Number(priceOverride != null ? priceOverride : listing.price) || 0,
    quantity: listing.quantity,
    tokens: listing.tokens,
    timestamp: Date.now()
  };
  state.trades.push(trade);

  // Mark listing as filled
  listing.status = 'Filled';
  listing.filledAt = Date.now();

  write(state);
  return trade;
}

function cancelListing(listingId, accountId){
  const state = read();
  state.marketplace = state.marketplace || [];
  const idx = state.marketplace.findIndex(l => l.listingId === listingId && l.sellerId === accountId);
  if(idx === -1) return false;
  state.marketplace[idx].status = 'Cancelled';
  state.marketplace[idx].cancelledAt = Date.now();
  write(state);
  return true;
}

function clearAll(){
  localStorage.removeItem(STORAGE_KEY);
}

export default {
  getMarketplace,
  getTrades,
  getHistoryForAccount,
  listAsset,
  buyAsset,
  cancelListing,
  clearAll
};
