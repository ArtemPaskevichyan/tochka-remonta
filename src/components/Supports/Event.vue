<template>
    <div class="event">
        <div class="event__content">
            <div class="event__date">
                {{ date }}
            </div>
            {{ model?.description ?? "Нет названия события"}}
        </div>

        <UILink :link="''">Посмотреть</UILink>
    </div>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue';

export default {
    components: {
        UILink,
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