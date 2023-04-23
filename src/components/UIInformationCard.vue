<template>
    <div class="infoCard">
        <div class="infoCard__image" :class="{skeleton: !imageSrc}">
            <img v-if="imageSrc" :src="imageSrc" alt="" loading="lazy">
        </div>
        <div class="infoCard__container">
            <div class="infoCard__title largeText" :class="{skeleton: isLoading}">
                {{ title ?? "DEFAULT TITLE"}}
            </div>
            <div class="infoCard__body" :class="{skeleton: isLoading}">
                <slot name="body"></slot>
            </div>
            <div class="infoCard__footer">
                <slot name="footer"></slot>
                <UIButton @click="$emit('action')" class="infoCard__button" :style="isLoading ? 'disabled' : buttonStyle">
                    <slot name="button"></slot>
                </UIButton>
            </div>
        </div>
    </div>
</template>

<script>
import UIButton from "./Buttons/UIButton.vue"
import { TokenHandler } from '@/helpers/TokenHandler'
import { serverURL } from '@/preferenses'
import axios from 'axios'

export default {
    components: {
        UIButton,
    },
    data() {
        return {
            imageError: false,
            imageSrc: '',
        }
    },
    props: {
        imageName: {
            required: true,
            type: String,
            default: ''
        },
        title: String,
        buttonStyle: {
            type: String,
            default: 'secondary',
        },
        isLoading: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        async fetchImage() {
            if (this.imageName == '') { 
                this.imageError = true
                return
            }
            this.imageSrc = `${serverURL}/api/v1/projects/get_event_photo?filename=${this.imageName}`
        }
    },
    mounted() {
        this.fetchImage()
    }
}
</script>

<style>

</style>