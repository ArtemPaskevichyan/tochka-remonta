<template>
    <div class="projectPhotos">
        <div class="projectPhotos__title modal__defaultTitle">Галерея</div>
        <UIGalery class="projectPhotos__galery" :imageNames="imageNames"/>
    </div>
</template>

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'

export default {
    components: {
        UIGalery,
    },
    data() {
        return {}
    },
    props: {
        imageNames: {
            type: Array,
            required: true,
        }
    }
}
</script>