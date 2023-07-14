<template>
    <div class="authorizationHolder">
        <div class="authorizationHolder__content">
            <div class="notFoundPage__giantTitle">
                404
            </div>
            <div class="caption notFoundPage__text">
                Страница не найдена. Корректно ли введена ссылка?
            </div>
            <UILink :link="'/login'">На главную</UILink>
        </div>
    </div>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue'

export default {
    components: {
        UILink,
    },
    data() {
        return {}
    },
}
</script>

