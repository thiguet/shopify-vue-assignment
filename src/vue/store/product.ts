const initialState = {
  currentVariant: {
    price: 0,
    compare_at_price: 0,
  },
};

const formatCurrency = (price?: number) =>
  price
    ? `$${price % 100 === 0 ? price / 100 : Number(price / 100).toFixed(2)}`
    : `$0`;

const getters = {
  getPrice: (currentState: typeof initialState) =>
    formatCurrency(
      currentState.currentVariant && currentState.currentVariant.price,
    ),
  getCompareAtPrice: (currentState: typeof initialState) =>
    formatCurrency(
      currentState.currentVariant &&
        currentState.currentVariant.compare_at_price,
    ),
  getDiscount: (currentState: typeof initialState) =>
    Math.round(
      currentState.currentVariant &&
        100 -
          (currentState.currentVariant.price * 100) /
            currentState.currentVariant.compare_at_price,
    ),
};

/**
 * mutations
 */
const mutations = {
  UPDATE_VARIANT(
    state: typeof initialState,
    payload: (typeof initialState)["currentVariant"],
  ) {
    state.currentVariant = payload;
  },
};

const actions = {
  variant({ commit }: any, payload: any) {
    commit("UPDATE_VARIANT", payload);
  },
};

/**
 * export
 */
export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
};
