<template>
    <div class="notification">
        <div class="notification__title largeText" :class="{skeleton: isLoading}">
            {{ model?.title ?? "NO TITLE" }}
        </div>
        <div class="notification__body baseText" :class="{skeleton: isLoading}">
            {{ model?.body ?? "NO BODY TEXT FOUND HERE" }}
        </div>
        <div class="notification__footer">
            <UIButton :style="isLoading ? 'disabled' : (model?.watched ? 'secondary' : 'primary')" @click="$emit('action', model)">Посмотреть</UIButton>
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
        model: {
            required: true,
            type: Object,
        },
        isLoading: {
            type: Boolean,
            default: false,
        }
    }
}
</script>