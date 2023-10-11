<script>
import { toRefs, ref } from "vue"
import { useStore } from "vuex"

export default {
  props: {
    currentVariant: {
      type: Object,
      required: true,
    },
    productOptions: {
      type: Object,
      required: true,
    },
    productVariants: {
      type: Object,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { currentVariant, productOptions, productVariants } = toRefs(props)

    const store = useStore()
    const selectedVariant = ref(currentVariant.value)

    const selectOption = ({ name }, $event) => {
      const selectedValue = $event.target.value
      const selectedOption = productOptions.value.find(
        (option) => option.name === name
      )
      const allOptionValuesWithoutSelected = selectedOption.values.filter(
        (value) => value !== selectedValue
      )

      const targetOptions = [
        selectedValue,
        ...selectedVariant.value.options.filter(
          (value) => !allOptionValuesWithoutSelected.includes(value)
        ),
      ]

      productVariants.value.some((variant) => {
        if (variant.options.every((option) => targetOptions.includes(option))) {
          selectedVariant.value = variant
          store.dispatch("product/variant", variant)

          goToVariant(selectedVariant.value.id)
          updateVariant($event.target, name)
          return true
        }
      })
    }

    const goToVariant = function (value) {
      const url = new URL(window.location)
      url.searchParams.set("variant", value)
      window.history.pushState(null, "", url)
    }

    const updateVariant = function (target, optionName) {
      document
        .querySelector(`[data-option="${optionName}"] label.active`)
        .classList.remove("active")
      target.parentElement.querySelector("label").classList.add("active")
    }

    return () =>
      slots.default({
        selectedVariant: selectedVariant.value,
        selectOption,
      })
  },
  mounted() {
    const store = useStore()
    store.dispatch("product/variant", this.productVariants[0])
  },
}
</script>
