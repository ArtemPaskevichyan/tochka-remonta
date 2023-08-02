<template>
  <div class="multiChoise" :class="{foldable: foldable, folded: folded}">
    <div class="multiChoise__title" @click="foldChange()">
      <span>
        {{ title }}
        <span class="multiChoise__subtitle" v-if="foldable && selectedCount > 0">{{ selectedCount }}</span>
      </span>
      <i class="icon-arrow-down multiChoise__arrow" :class="{unfolded: !folded}"></i>
    </div>
    <div class="multiChoise__content" ref="content">
      <UICheckbox class="multiChoise__checkbox" :style="'slim'" v-model:value="item.active" v-for="item in selectionData" :key="item.id" @change="selected(item.id)">
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
      folded: true,
    }
  },
  methods: {
    foldChange() {
      if (!this.foldable) return
      this.$emit("foldChange", !this.folded)
      this.folded = !this.folded
    },
    selected(emitterId) {
      if (!this.single) return
      for (let i of this.selectionData) {
        if (i.id == emitterId) { continue }
        i.active = false
      }
    },
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
    foldable: {
      type: Boolean,
      default: false,
    },
    single: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    selectedCount() {
      return this.selectionData.filter(e => e.active).length
    }
  },
}
</script>