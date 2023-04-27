<template>
    <div class="authPagination">
        <span class="authPagination__item" v-for="(i, index) in paginationList" v-html="i" :key="index" :class="{'active': currentPageIndex == index}" @click="$emit('update:currentPageIndex', index)">
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
        
        }
    },
    props: {
        paginationList: {
            type: Array,
            required: true,
        },
        currentPageIndex: {
            type: Number,
            required: true,
        }
    }
}
</script>