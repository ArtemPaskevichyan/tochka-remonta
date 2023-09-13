<template>
  <div class="fileLoader">
    <div class="fileLoader__title">
      {{ title }}
    </div>
    <input type="file" ref="input" :accept="accept" @change="fetchFile" />
    <div class="fileLoader__inner">
      <div class="fileLoader__fileInfo">
        <span class="fileLoader__fileName" :class="{skeleton: isLoading}">{{  !isLoading ? fileName : "Документ загружается..."  }}</span>
        <span class="fileLoader__controls">
          <UIButton
            @click="watchFile"
            class="fileLoader__destructive"
            :style="'square default'"
            v-if="!isLoading"
          >
            <i class="icon-eye"></i>
          </UIButton>
        </span>
      </div>
      <UIButton
        v-if="!isLoading"
        @click="$refs.input.click()"
        class="fileLoader__button"
      >
        Выбрать файл
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
      file: undefined,
      fileName: undefined,
      inputId: this._uid + "-input",
      fileLink: undefined,
    };
  },
  props: {
    title: String,
    accept: Array,
    preview: Boolean,
    loadedFile: Object,
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    fetchFile(event) {
      try {
        this.file = event.target.files[0];
        this.fileName = event.target.files[0].name;
        this.fileLink = window.URL.createObjectURL(this.file);
        this.$emit("fileLoaded", event.target.files[0]);
      } catch (e) {
        this.$emit("error", e);
      }
    },
    clearFile() {
      this.file = undefined;
      this.fileName = undefined;
      this.fileLink = undefined;
      this.$refs("input").value = null;
      this.$emit("cleared");
    },
    watchFile() {
      if (this.fileLink) window.open(this.fileLink, "_blank");
    },
  },
  mounted() {
    if (this.loadedFile) {
      this.fileLink = this.loadedFile.link;
      this.fileName = this.loadedFile.name;
    }
  },
  watch: {
    loadedFile: function () {
      this.fileLink = this.loadedFile.link;
      this.fileName = this.loadedFile.name;
    },
  },
};
</script>
