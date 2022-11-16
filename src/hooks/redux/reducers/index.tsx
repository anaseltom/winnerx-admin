import { combineReducers } from "redux";
import ProductsReducer from "./ProductsReducer";
import ProductVariantsReducer from "./ProductVariantsReducer";
import CategoriesReducer from "./CategoriesReducer";
import CustomersReducer from "./CustomersReducer";
import DealsReducer from "./DealsReducer";
import WinnersReducer from "./WinnersReducer";
import DealEntriesReducer from "./DealEntriesReducer";
import OrdersReducer from "./OrdersReducer";
import OrderReturnsReducer from "./OrderReturnsReducer";
import OrderFulfillmentsReducer from "./OrderFulfillmentsReducer";
import UserReducer from "./UserReducer";
// import MessagesReducer from "./MessagesReducer";

const rootReducer = combineReducers({
  user: UserReducer,
  allProducts: ProductsReducer,
  allProductVariants: ProductVariantsReducer,
  allCategories: CategoriesReducer,
  allCustomers: CustomersReducer,
  allDeals: DealsReducer,
  allWinners: WinnersReducer,
  allDealEntries: DealEntriesReducer,
  allOrders: OrdersReducer,
  allOrderReturns: OrderReturnsReducer,
  allOrderFulfillmentsReducer: OrderFulfillmentsReducer,
  // allMessages: MessagesReducer,
});

export default rootReducer;
