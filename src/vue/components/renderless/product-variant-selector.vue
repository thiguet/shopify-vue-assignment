<script>
import { ref, toRefs, onMounted } from "vue"
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
        (option) => option.name === name,
      )
      const allOptionValuesWithoutSelected = selectedOption.values.filter(
        (value) => value !== selectedValue,
      )

      const otherOptions = [
        ...selectedVariant.value.options.filter(
          (value) => !allOptionValuesWithoutSelected.includes(value),
        ),
      ]

      const targetOptions = [selectedValue, ...otherOptions]

      const hasVariantBeenUpdated = productVariants.value.some((variant) => {
        if (variant.options.every((option) => targetOptions.includes(option))) {
          selectedVariant.value = variant
          store.dispatch("product/variant", variant)

          goToVariant(selectedVariant.value.id)
          updateVariant($event.target, name)
          return true
        }
      })

      if (!hasVariantBeenUpdated) {
        const variant = productVariants.value.find((variant) =>
          variant.options.includes(selectedValue),
        )
        selectedVariant.value = variant
        store.dispatch("product/variant", variant)
        goToVariant(selectedVariant.value.id)
        updateOptionsByVariant(variant, $event.target, name)

        return true
      }
    }

    const goToVariant = function (value) {
      const url = new URL(window.location)
      url.searchParams.set("variant", value)
      window.history.pushState(null, "", url)
    }

    const updateOptionsByVariant = (variant, target, optionName) => {
      document.querySelectorAll(`label.active`).forEach((el) => {
        el.classList.remove("active")
      })
      document.querySelectorAll("[data-option-index]").forEach((el, i) => {
        const activeOption = el.querySelector(
          `label.option[data-value="${variant["option" + (i + 1)]}"]`,
        )

        activeOption.classList.add("active")
      })

      showSizesByGender(optionName, target.value)
    }

    const updateVariant = (target, optionName) => {
      document
        .querySelector(`[data-option="${optionName}"] label.active`)
        .classList.remove("active")

      target.parentElement.querySelector("label").classList.add("active")

      showSizesByGender(optionName, target.value)
    }

    const hideImpossibleVariantOptions = function (optionName, value) {
      const optionsToUnhide = document.querySelectorAll(
        `[data-option]:not([data-option="${optionName}"]) .option`,
      )

      optionsToUnhide.forEach((el) => {
        el.parentElement.classList.remove("hidden")
      })

      const otherOptions = document.querySelectorAll(
        `[data-option]:not([data-option="${optionName}"])`,
      )

      const allOptions = document.querySelectorAll(`[data-option]`)

      const optionIndex =
        Array.from(allOptions).findIndex(
          (el) => el.getAttribute("data-option") == optionName,
        ) + 1

      const possibleOptions = productVariants.value.filter(
        (variant, i) => variant[`option${optionIndex}`] === value,
      )

      const valuesToHide = possibleOptions.reduce(
        (acc, next) => {
          return {
            option1: Array.from(new Set(acc["option1"].concat(next.option1))),
            option2: Array.from(new Set(acc["option2"].concat(next.option2))),
            option3: Array.from(new Set(acc["option3"].concat(next.option3))),
          }
        },
        {
          option1: [],
          option2: [],
          option3: [],
        },
      )

      for (const key in valuesToHide) {
        if (key === `option${optionIndex}`) {
          continue
        }

        document
          .querySelectorAll(`[data-option-index="${key}"] .option`)
          .forEach((el) => {
            if (!valuesToHide[key].includes(el.getAttribute("data-value"))) {
              el.parentElement.classList.add("hidden")
            }
          })
      }
    }

    const showSizesByGender = function (optionName, value) {
      if (optionName === "Gender") {
        hideImpossibleVariantOptions(optionName, value)
      }
    }

    onMounted(() => showSizesByGender("Gender", currentVariant.value.option2))

    return () =>
      slots.default({
        selectedVariant: selectedVariant.value,
        selectOption,
      })
  },
  methods: {},
}
</script>
