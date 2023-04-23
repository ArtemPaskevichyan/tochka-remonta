<template>
    <div class="searchBar">
        <div class="searchBar__inputHolder">
            <input type="text" :placeholder="placeholder" v-model="innerText">
            <UIButton class="searchBar__inlineSearchButton" :style="'square primary'" @click="search">S</UIButton>
            <div class="searchBar__dropdown" v-if="suggestions?.length > 0">
            <div class="searchBar__dropdownItem" :key="index" v-for="(s, index) in suggestions" @click="choseItem(index)">
                {{s}}
            </div>
        </div>
        </div>
        <UIButton class="searchBar__searchButton" :style="'primary'" @click="search">Поиск</UIButton>
        <UINotificationIndicatiorHolder :amount="filtersCount" :displayZero="false">
            <UIButton class="searchBar__filterButton" v-if="filterExists" :style="'square'" @click="showHideFilters">F</UIButton>
        </UINotificationIndicatiorHolder>
        <div v-if="filterExists && filterIsOpened" class="searchBar__filter">
            <slot name="filterContent"></slot>
        </div>
    </div>
</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue';
import UINotificationIndicatiorHolder from '@/components/NotificationIndicator/UINotificationIndicatiorHolder.vue';

export default {
    components: {
        UIButton, UINotificationIndicatiorHolder
    },
    data() {
        return {
            filterIsOpened: false,
            innerText: "",
        }
    },
    methods: {
        choseItem(index) {
            try {
                this.innerText = this.suggestions[index]
                this.$emit('chosen', index)
            } catch(e) {
                console.log(e)
            }
        },
        showHideFilters() {
            this.$emit("update:suggestions", [])
            if (!this.filterIsOpened) {
                this.$emit("filtersWillBeOpened")
            } else {
                this.$emit("filtersWillBeClosed")
            }
            this.filterIsOpened = !this.filterIsOpened
            if (this.filterIsOpened) { this.$emit('filtersHasBeenOpened') }
        },
        search() {
            this.$emit("update:suggestions", [])
            this.$emit("search", this.innerText)
        },
    },
    props: {
        placeholder: String,
        text: {
            type: String,
            required: true,
            default: '',
        },
        suggestions: {
            type: Array,
            required: true,
            default: [],
        },
        filterExists: {
            type: Boolean,
            default: true,
        },
        filtersCount: {
            type: Number,
            default: 0,
        }
    },
    watch: {
        innerText: function() {
            this.$emit("update:text", this.innerText)
        },
        text: function() {
            this.innerText = this.text
        }
    },
}
</script>

<style>
</style>