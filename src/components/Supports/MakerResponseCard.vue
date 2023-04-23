<template>
<div class="makerResponse">
    <div class="makerResponse__header">
        <img :src="src" alt="">
        {{ model.firstname ?? "TITLE"}}
    </div>

    <div class="makerResponse__text">
        {{ model.description ?? "TEXT"}}
    </div>

    <div class="makerResponse__footer">
        <UIButton :style="'secondary'" @click="$emit('goToMaker')">Аккаунт исполнителя</UIButton>
        <UIButton :style="'primary'" @click="$emit('setMaker')">Назначить исполнителем</UIButton>
    </div>
</div>
</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue'
import {serverURL} from '@/preferenses.js'

export default {
    components: {
        UIButton,
    },

    data() {
        return {
            baseSrc: serverURL + '/api/v1/auth/get_avatar?filename=',
        }
    },
    props: {
        model: {
            type: Object,
            required: true,
        }
    },
    computed: {
        src: function() {
            return this.model.avatar ? this.baseSrc + this.model.avatar : undefined
        }
    }
    
}
</script>

<style>
</style>