<template>
  <div class="negotiationList">
    <div class="modal__defaultTitle">Согласования</div>
    <div class="negotiationList__list">
      <Negotiation
        v-for="n in negotiationList"
        @open="$emit('open', n)"
        :key="n.id"
        :model="n"
      />
    </div>
  </div>
</template>

<script>
import Negotiation from "@/components/Supports/Negotiation.vue";

export default {
  components: {
    Negotiation,
  },
  data() {
    return {}
  },
  props: {
    negotiationList: {
      type: Array,
      default: [],
      required: true,
    }
  }
}
</script>