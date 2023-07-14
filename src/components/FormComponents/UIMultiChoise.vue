<template>
  <div class="multiChoise">
    <div class="multiChoise__title">
      {{ title }}
    </div>
    <div class="multiChoise__content">
      <UICheckbox class="multiChoise__checkbox" :style="'slim'" v-model:value="item.active" v-for="item in selectionData" :key="item.id">
        {{item.label}}
      </UICheckbox>
    </div>
  </div>
</template>

<script>
import UICheckbox from "@/components/FormComponents/UICheckbox.vue";

export default {
  components: {
    UICheckbox,
  },
  data() {
    return {

    }
  },
  props: {
    title: {
      type: String,
    },
    selectionData: {
      type: Array,
      required: true,
    },
    selectedList: {
      type: Array,
    },
  },
}
</script>