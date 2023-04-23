<template>
    <div class="rating">
        <img :class="{mutating: changable}" :src="'../../src/assets/images/starIcon' + ((rating > 0.5) ? 'Fill' : 'Empty') + '.png'" alt="" width="24" height="24" @click="setRating(1)">
        <img :class="{mutating: changable}" :src="'../../src/assets/images/starIcon' + ((rating > 1.5) ? 'Fill' : 'Empty') + '.png'" alt="" width="24" height="24" @click="setRating(2)">
        <img :class="{mutating: changable}" :src="'../../src/assets/images/starIcon' + ((rating > 2.5) ? 'Fill' : 'Empty') + '.png'" alt="" width="24" height="24" @click="setRating(3)">
        <img :class="{mutating: changable}" :src="'../../src/assets/images/starIcon' + ((rating > 3.5) ? 'Fill' : 'Empty') + '.png'" alt="" width="24" height="24" @click="setRating(4)">
        <img :class="{mutating: changable}" :src="'../../src/assets/images/starIcon' + ((rating > 4.5) ? 'Fill' : 'Empty') + '.png'" alt="" width="24" height="24" @click="setRating(5)">
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        rating: {
            type: Number,
            required: true,
        },
        changable: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        setRating(rate) {
            if (!this.changable) { return }
            this.$emit('update:rating', rate)
        }
    }
}
</script>