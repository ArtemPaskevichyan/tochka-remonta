<template>
    <div class="notification">
        <div class="notification__title largeText" :class="{skeleton: isLoading}">
            {{ title ?? "NO TITLE" }}
        </div>
        <div class="notification__body baseText" :class="{skeleton: isLoading}">
            {{ title ?? "NO BODY TEXT FOUND HERE" }}
        </div>
        <div class="notification__footer">
            <UIButton :style="isLoading ? 'disabled' : (watched ? 'secondary' : 'primary')" @click="$emit('action')">Посмотреть</UIButton>
        </div>
    </div>
</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue'

export default {
    components: {
        UIButton,
    },
    data() {
        return {

        }
    },
    props: {
        title: String,
        text: String,
        watched: {
            type: Boolean,
            default: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        }
    }
}
</script>