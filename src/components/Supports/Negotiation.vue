<template>
    <div class="negotiation">
        <div class="negotiation__content" :class="{skeleton: !model?.title}">
            {{ model?.title ?? "UNFINED"}}
            <span class="negotiation__date" :class="{skeleton: !model?.title}">
                {{ date }}
            </span>
        </div>

        <UIButton :style="!model?.decision ? 'primary' : 'secondary'" @click="$emit('open')">Перейти</UIButton>
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
            return this.model?.date ? new Date(this.model?.date).toISOString().slice(0,10).replace(/-/g,".") : "00.00.00"
        }
    }
}
</script>