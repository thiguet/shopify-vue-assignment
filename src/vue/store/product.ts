const initialState = {
  currentVariant: {
    price: 0,
  },
}

const getters = {
  getPrice: (currentState: typeof initialState) =>
    currentState.currentVariant
      ? `$${
          currentState.currentVariant.price % 100 === 0
            ? currentState.currentVariant.price / 100
            : Number(currentState.currentVariant.price / 100).toFixed(2)
        }`
      : `$0`,
}

/**
 * mutations
 */
const mutations = {
  UPDATE_VARIANT(
    state: typeof initialState,
    payload: (typeof initialState)["currentVariant"]
  ) {
    state.currentVariant = payload
  },
}

const actions = {
  variant({ commit }: any, payload: any) {
    commit("UPDATE_VARIANT", payload)
  },
}

/**
 * export
 */
export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
}
