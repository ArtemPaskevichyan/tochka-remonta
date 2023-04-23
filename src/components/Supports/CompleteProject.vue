<template>
    <div class="completeProject">
        <div class="completeProject__title titleText">Завершить проект</div>
        <div class="completeProject__text baseText">
            При завершении проекта, исполнитель получит уведомление о завершении. При этом статус проекта будет установлен в "завершенный"<br>
            Вам необходимо оставить отзыв о работе заказчика, чтобы завершить проект.
        </div>
        <SetReview v-model:text="reviewText" v-model:rating="reviewRating"/>
        <div class="completeProject__footer">
            <UIButton :style="'primary'" @click="completeProject">Завершить проект</UIButton>
        </div>
    </div>
</template>

<script>
import SetReview from '@/components/Supports/SetReview.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

export default {
    components: {
        SetReview, UIButton, 
    },
    data() {
        return {
            reviewText: "",
            reviewRating: undefined,
        }
    },
    methods: {
        completeProject() {
            if (this.reviewText == '') {
                alert('Поле с отзывом обязательно для заполнения')
                return
            }

            if (!this.reviewRating) {
                alert('Пожалуйста, поставьте оценку исполнителю')
                return
            }

            var model = {
                rating: this.reviewRating,
                text: this.reviewText,
            }
            this.$emit('complete', model)
        }
    },
    watch: {
        reviewText: function() {
            this.textError = false
        }
    }
}
</script>