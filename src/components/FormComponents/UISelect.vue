<template>
    <div class="select">
        <div class="select__title">
            {{ title }}
        </div>
        <div @click="isSelectShown = !isSelectShown" class="select__holder">
            <div class="select__value">{{ selectArray[value].label }}</div>
            <button class="select__arrow">
                >
            </button>
            <div :class="{active: isSelectShown}" class="select__list">
                <div @click="changeValue(opt.id)" :key="opt.id" v-for="opt in selectArray" class="select__item">
                    {{ opt.label }}
                    <span v-if="opt.id == value">V</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isSelectShown: false,
        }
    },
    props: {
        title: String,
        selectArray: {
            type: Array,
            required: true,
            default: []
        },
        value: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    methods: {
        changeValue(id) {
            console.log(id)
            this.$emit("update:value", id)
        }
    }
}
</script>

<style>
</style>