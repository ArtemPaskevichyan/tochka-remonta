<template>
    <div class="negotiation" @click="$emit('open')">
        <div class="negotiation__content" :class="{skeleton: !model?.title}">
            {{ model?.title ?? "UNFINED"}}
            <span class="negotiation__date" :class="{skeleton: !model?.title}">
                {{ date }}
            </span>
        </div>

        <UIButton class="desktopOnly" :style="!model?.decision ? 'primary' : 'secondary'">Перейти</UIButton>
        <span class="negotiation__icon mobileOnly">
            <i class="icon-arrow-right"></i>
        </span>
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