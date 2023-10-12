<script>
import { useStore } from "vuex"

export default {
  props: {
    currentVariant: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const store = useStore()
    store.dispatch("product/variant", this.currentVariant)
  },
}
</script>
