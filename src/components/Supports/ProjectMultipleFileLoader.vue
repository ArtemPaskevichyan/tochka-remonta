<template>
  <div class="fileLoader">
    <div class="fileLoader__title">
      {{ title }}
    </div>
    <input type="file" ref="input" :accept="accept" @change="fetchFile" multiple="multiple"/>
    <div class="fileLoader__inner">
      <span class="fileLoader__fileName" v-if="isLoading" :class="{skeleton: isLoading}">Документ загружается...</span>
      <div v-else class="fileLoader__fileInfo multiple" v-for="(f, index) in files" :key="index">
        <span class="fileLoader__fileName" :class="{skeleton: isLoading}">{{  !isLoading ? f.name : "Документ загружается..."  }}</span>
        <span class="fileLoader__controls">
          <UIButton
            @click="watchFile(f)"
            class="fileLoader__destructive"
            :style="'square default'"
            v-if="!isLoading"
          >
            <i class="icon-eye"></i>
          </UIButton>
          <!-- <UIButton
            @click="clearFile"
            class="fileLoader__destructive"
            :style="'destructive'"
            >Удалить</UIButton
          > -->
        </span>
      </div>
      <UIButton
        v-if="!isLoading"
        @click="$refs.input.click()"
        class="fileLoader__button"
      >
        Выбрать файлы
      </UIButton>
    </div>
  </div>
</template>

<script>
import UIButton from "@/components/Buttons/UIButton.vue";

export default {
  components: {
    UIButton,
  },
  data() {
    return {
      files: [],
      inputId: this._uid + "-input",
    };
  },
  props: {
    title: String,
    accept: Array,
    preview: Boolean,
    loadedFiles: Object,
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    fetchFile(event) {
      try {
        for (let f of event.target.files) {
          console.log(this.files)
          let file = {
            name: f.name,
            link: window.URL.createObjectURL(f)
          }
          this.files.push(file)
        }
        this.$emit("filesLoaded", event.target.files);
      } catch (e) {
        console.log("ERROR", e)
        this.$emit("error", e);
      }
    },
    clearFile() {
      this.files = [];
      this.$refs("input").value = null;
      this.$emit("cleared");
    },
    watchFile(f) {
      if (f.link) window.open(f.link, "_blank");
    },
  },
  mounted() {
    if (this.loadedFiles) {
      this.files = this.loadedFiles
    }
  },
  watch: {
    loadedFiles: function () {
      this.files = this.loadedFiles
    },
  },
};
</script>
