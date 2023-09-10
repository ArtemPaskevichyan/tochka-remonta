<template>
  <div class="input">
    <div class="input__title" :class="{ small: style == 'small' }">
      {{ title }}
    </div>
    <div class="input__holder">
    <input
        v-if="idOfInput"
        :type="inputType"
        v-model="innerValue"
        :placeholder="placeholder"
        :id="idOfInput"
        @keypress="handleSymbolInput"
      />
      <input
        v-else
        :type="inputType"
        v-model="innerValue"
        :placeholder="placeholder"
        @keypress="handleSymbolInput"
      />
      <button
        v-if="role == 'password'"
        class="input__passwordShowHideButton"
        @click="showHidePassword"
      >
        <i
          :class="{
            'icon-eye': inputType == 'password',
            'icon-eye-cross': inputType != 'password',
          }"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputType: "text",
      innerValue: "",
    };
  },
  props: {
    title: String,
    value: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "text",
    },
    placeholder: String,
    style: {
      type: String,
      default: "text",
    },
    idOfInput: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    showHidePassword() {
      if (this.inputType == "password") this.inputType = "text";
      else if (this.inputType == "text") this.inputType = "password";
    },
    handleSymbolInput(e) {
            switch (e.code) {
                case "Enter":
                    this.$emit("enterPressed", e)
                    break;
            }
        },
  },
  watch: {
    innerValue: function () {
      this.$emit("update:value", this.innerValue);
    },
    value: function () {
      this.innerValue = this.value;
    },
  },
  mounted() {
    this.innerValue = this.value;
    this.inputType = this.role;
  },
};


</script>

<style></style>
