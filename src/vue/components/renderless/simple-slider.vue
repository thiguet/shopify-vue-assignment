<script lang="ts">
import { ref } from "vue"

export default {
  props: {
    sliderContainerClass: {
      type: String,
      default: "slider-container",
    },
    sliderClass: {
      type: String,
      default: "slider",
    },
  },
  // @ts-ignore
  setup(props, { slots }) {
    const activeSlide = ref(0)

    const slider = (): HTMLElement =>
      document.querySelector(`.${props.sliderClass}`)!
    const sliderContainer = (): HTMLElement =>
      document.querySelector(`.${props.sliderContainerClass}`)!

    const highlightActiveSlide = () => {
      const bubbles = slider().querySelectorAll(`.bubble`)
      const activeBubble = slider().querySelector(
        `.bubble[data-index="${activeSlide.value}"]`
      )!

      bubbles.forEach((element) => {
        element.classList.remove("active")
      })
      activeBubble?.classList.add("active")
    }

    const slideNext = function () {
      if (activeSlide.value < sliderContainer()?.childNodes.length - 1) {
        const slideWidth = slider().clientWidth
        sliderContainer().scrollLeft += slideWidth
        activeSlide.value += 1
        highlightActiveSlide()
      }
    }

    const slidePrev = function () {
      if (activeSlide.value > 0) {
        const slideWidth = slider().clientWidth
        sliderContainer().scrollLeft -= slideWidth
        activeSlide.value -= 1
        highlightActiveSlide()
      }
    }

    return () =>
      slots.default &&
      slots.default({
        activeSlide: activeSlide.value,
        slideNext,
        slidePrev,
      })
  },
}
</script>
