<script>
import { ref, toRefs } from "vue"
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

      const targetOptions = [
        selectedValue,
        ...selectedVariant.value.options.filter(
          (value) => !allOptionValuesWithoutSelected.includes(value),
        ),
      ]

      productVariants.value.some((variant) => {
        if (variant.options.every((option) => targetOptions.includes(option))) {
          selectedVariant.value = variant
          store.dispatch("product/variant", variant)

          goToVariant(selectedVariant.value.id)
          updateVariant($event.target, name)
          return true
        } else {
          updateVariant($event.target, name)
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

      hideImpossibleVariantOptions(optionName, target.value)
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

    return () =>
      slots.default({
        selectedVariant: selectedVariant.value,
        selectOption,
      })
  },
}
</script>
