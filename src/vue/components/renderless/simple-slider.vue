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
    const slider = (): HTMLElement =>
      document.querySelector(`.${props.sliderClass}`)!
    const sliderContainer = (): HTMLElement =>
      document.querySelector(`.${props.sliderContainerClass}`)!
    const activeSlide = ref(0)

    const highlightActiveSlide = () => {
      const activeBubble = slider().querySelector(`.bubble.active`)!
      const bubbleToActivate = slider().querySelector(
        `.bubble[data-index="${activeSlide.value}"]`,
      )!

      activeBubble.classList.remove("active")
      bubbleToActivate?.classList.add("active")
    }

    const slideTo = (index: number) => {
      if (
        index >= sliderContainer()?.childNodes.length ||
        index < 0 ||
        index == activeSlide.value
      )
        return

      const slideWidth = sliderContainer().querySelector(
        `.slide:nth-child(${index + 1})`,
      )!.clientWidth
      slider().scrollLeft = slideWidth * index
      activeSlide.value = index
      highlightActiveSlide()
    }

    const slideNext = () => {
      slideTo(activeSlide.value + 1)
    }

    const slidePrev = () => {
      slideTo(activeSlide.value - 1)
    }

    // Watch user scroll:
    return () =>
      slots.default &&
      slots.default({
        activeSlide: activeSlide.value,
        slideNext,
        slidePrev,
        slideTo,
      })
  },
  data: () => ({
    observerList: [] as IntersectionObserver[],
    activeSlide: 0,
  }),
  mounted() {
    const sliderContainerClass = (this as any).sliderContainerClass
    const slider = (): HTMLElement =>
      document.querySelector(`.${(this as any).sliderClass}`)!
    const sliderContainer = (): HTMLElement =>
      document.querySelector(`.${sliderContainerClass}`)!

    const highlightActiveSlide = () => {
      const activeSlide = (this as any).activeSlide
      const activeBubble = slider().querySelector(`.bubble.active`)
      const bubbleToActivate = slider().querySelector(
        `.bubble[data-index="${activeSlide}"]`,
      )

      if (!activeBubble) return

      activeBubble.classList.remove("active")
      bubbleToActivate?.classList.add("active")
    }
    if (sliderContainer()) {
      Array.from(sliderContainer().querySelectorAll(".slide")).forEach((el) => {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const newIndex = entry.target.getAttribute("data-index")
                if (Number.isNaN(newIndex)) return
                ;(this as any).activeSlide = Number(newIndex)
                highlightActiveSlide()
                break
              }
            }
          },
          {
            rootMargin: "0% -40% 0% -40%",
          },
        )
        ;(this as any).observerList.push(observer)
        if (el) {
          observer.observe(el)
        }
      })
    }
  },
  unmounted() {
    const sliderContainerClass = (this as any).sliderContainerClass
    const sliderContainer = (): HTMLElement =>
      document.querySelector(`.${sliderContainerClass}`)!

    const bubbles = Array.from(sliderContainer().children)

    if (bubbles.length && (this as any).observerList) {
      bubbles.forEach((el, i) => {
        if (el) {
          const observer = (this as any).observerList[i]
          if (observer) {
            observer.unobserve(el)
          }
        }
      })
    }
  },
}
</script>
