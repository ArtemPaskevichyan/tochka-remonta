<template>
  <div class="eventList">
    <div class="modal__defaultTitle">Согласования</div>
    <div class="eventList__list">
      <Event
        v-for="e in eventList"
        :key="e.id"
        :model="e"
      />
    </div>
  </div>
</template>

<script>
import Event from '@/components/Supports/Event.vue'

export default {
  components: {
    Event,
  },
  data() {
    return {}
  },
  props: {
    eventList: {
      type: Array,
      default: [],
      required: true,
    }
  }
}
</script>