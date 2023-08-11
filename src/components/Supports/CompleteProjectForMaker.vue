<template>
    <div class="completeProject">
        <div class="completeProject__title modal__defaultTitle">Завершить проект</div>
        <div class="completeProject__text baseText">
            При завершении проекта, заказчик получит уведомление о завершении. При этом статус проекта будет установлен в "завершенный"<br>
        </div>
        <div class="completeProject__footer">
            <UIButton :style="'primary'" @click="completeProject">Завершить проект</UIButton>
        </div>
    </div>
</template>

<script>
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        UIButton, 
    },
    data() {
        return {
        }
    },
    methods: {
        completeProject() {
            this.$emit('complete')
        }
    },
}
</script>