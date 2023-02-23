<template>
    <div class="switch">
        <div class="switch__options">
            <button class="switch__option" :class="{ active: opt.id == pickedId}"
            @click="selectOption(opt.id)" :key="opt.id" v-for="opt in data">
            {{ opt.title }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    
    data() {
        return {
            pickedId: 0,
        }
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    methods: {
        selectOption(id) {
            this.pickedId = id
            this.$emit("selectedId", id)
        }
    }
}
</script>

<style>

</style>