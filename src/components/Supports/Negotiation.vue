<template>
    <div class="negotiation">
        <div class="negotiation__content">
            {{ model?.title }}
            <span class="negotiation__date">
                {{ date }}
            </span>
        </div>

        <UIButton :style="'secondary'" @click="$emit('open')">Перейти</UIButton>
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
            type: Object,
            required: true,
        }
    },
    computed: {
        date: function() {
            return new Date(this.model?.date).toISOString().slice(0,10).replace(/-/g,".");
        }
    }
}
</script>