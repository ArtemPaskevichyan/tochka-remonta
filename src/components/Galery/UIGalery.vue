<template>
    <div class="galery">
        <div v-if="title" class="galery__title" :class="titleSize">
            {{ title }}
        </div>
        <div class="galery__holder" :class="{vertical: orientation=='v', horizontal: orientation=='h'}">
            <div v-if="!hideBaseImage" class="galery__baseImage">
                <img :src="baseSrc" alt="">
            </div>
            <div class="galery__images">
                <GaleryImage :src="imgName ? srcBase+imgName : ''" :key="index" v-for="(imgName, index) in imageNames" @click="chose(index)" :class="{active: index == pickedImage}"/>
                <!-- <GaleryImage :src="'/src/assets/images/JVS_0526 2.jpg'" :key="index" v-for="(imgName, index) in imageNames"/> -->
            </div>
        </div>
    </div>
</template>

<script>
import GaleryImage from '@/components/Galery/GaleryImage.vue'
import {serverURL} from '@/preferenses.js'

export default {
    components: {
        GaleryImage,
    },
    data() {
        return {
            srcBase: serverURL + '/api/v1/projects/get_event_photo?filename=',
            pickedImage: 0,
        }
    },
    computed: {
        baseSrc: function() {
            try {
                return this.srcBase+this.imageNames[this.pickedImage]
                throw new Error()
            } catch(e) {
                return "/src/assets/images/JVS_0526 2.jpg"
            }
                
        }
    },
    methods: {
        chose(index) {
            this.pickedImage = index
        },
    },
    props: {
        orientation: {
            type: String,
            default: 'v',
        },
        imageNames: {
            type: Array,
            required: true,
            default: [undefined, undefined, undefined,
                      undefined, undefined, undefined]
        },
        title: String,
        titleSize: {
            type: String,
            default: 'small',
        },
        hideBaseImage: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style>

</style>