<template>
  <div class="input">
    <div class="input__title" :class="{ small: style == 'small' }">
      {{ title }}
    </div>
    <div class="paramInput__holder" :class="{short: size == 'short'}">
      <span v-if="prefix" class="paramInput__label">{{ prefix }}</span>
      <Cleave
        v-model="innerValue"
        :options="innerOptions"
        :placeholder="placeholder"
        class="cleave"
      />
      <span v-if="suffix" class="paramInput__label">{{ suffix }}</span>
    </div>
  </div>
</template>

<script>
import Cleave from "vue-cleave-component"

export default {
  components: {
    Cleave,
  },
  data() {
    return {
      inputType: "text",
      innerValue: "",
      innerOptions: {
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        numeralDecimalMark: ',',
        delimiter: ' '
      }
    }
  },
  props: {
    title: String,
    value: {
      type: String,
      required: true,
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
    prefix: String,
    suffix: String,
    options: Object,
    role: String,
    size: String,
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
    setOptions(role) {
      if (!this.role) return
      const optionsList = {
        "number": {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
          numeralDecimalMark: ',',
          delimiter: ' '
        },
        "positiveNumber": {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
          numeralDecimalMark: ',',
          delimiter: ' ',
          numeralPositiveOnly: true,
        },
        "positiveInt": {
          numeral: true,
          numeralDecimalMark: '',
          numeralThousandsGroupStyle: '',
          delimiter: '',
          numeralPositiveOnly: true,
        },
        "phone": {
          numericOnly: true,
          prefix: '+7',
          blocks: [2, 3, 3, 2, 2],
          delimiters: [' (', ') ', '-', '-'],
          delimiterLazyShow: true,
        },
        "date": {
          date: true,
          datePattern: ['d', 'm', 'Y'],
        },
      }

      this.innerOptions = optionsList[role]
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
    if (this.options) this.innerOptions = this.options
    else this.setOptions(this.role)
  },
};

</script>

