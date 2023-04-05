<template>
    <div class="headerPage">
        <UIHeader></UIHeader>
        <div class="titleText pageTitle">Создание проекта</div>
        <div class="createProject backgroundCard">
            <div class="createProject__content">
                <div class="createProject__item">
                    <UIInput :placeholder="'Название'" :title="'Название проекта'" v-model:value="title" :class="{error: titleError}"></UIInput>
                </div>
                <div class="createProject__item">
                    <UIParamInput :placeholder="'60'" :title="'Квадратура'" v-model:value="square"
                    :suffix="'М²'" :size="'short'" :class="{error: squareError}"></UIParamInput>
                </div>
                <div class="createProject__item">
                    <UISelect :title="'Возраст дома'" v-model:value="typeOfNew" :selectArray="typesOfNew" :class="{error: typeOfNewError}"></UISelect>
                </div>
                <div class="createProject__item">
                    <UISelect :title="'Тип дома'" v-model:value="typeOfHouse" :selectArray="typesOfHouse" :class="{error: typeOfHouseError}"></UISelect>
                </div>
                <div class="createProject__item">
                    <UIInput :placeholder="'Город'" :title="'Город'" v-model:value="city" :class="{error: cityError}"></UIInput>
                </div>
                <div class="createProject__item">
                    <UIInput class="adressHolder" :placeholder="'Адрес объекта'" :title="'Область, город, улица, дом'" v-model:value="adress" :class="{error: adressError}" :idOfInput="adressId"></UIInput>
                </div>
                <div class="createProject__item">
                    <UISelect :title="'Когда хотите начать'" v-model:value="typeOfStart" :selectArray="typesOfStart" :class="{error: typeOfStartError}"></UISelect>
                </div>
                <div class="createProject__item">
                    <UIRangeInput
                    v-model:startValue="costStartValue"
                    v-model:endValue="costEndValue"
                    :startInput="costStartConfig"
                    :endInput="costEndConfig"
                    :title="'Стоимость'"
                    :class="{error: costStartValueError || costEndValueError}">
                    </UIRangeInput>
                </div>
                <div class="createProject__item">
                    <UICheckbox v-model:value="hasDesignProject" :class="{error: hasDesignProjectError}">Есть дизайн проект</UICheckbox>
                </div>
                <div class="createProject__item">
                    <UIFileLoader :title="'Загрузка документов о правах собственности'" @fileLoaded="hostDocsLoaded" @cleared="hostDocsDeleted" :class="{error: hostDocsError}"></UIFileLoader>
                </div>
                <div class="createProject__item">
                    <UITextInput :title="'Описание'" :placeholder="'Описание проекта'" v-model:value="description" :class="{error: descriptionError}"></UITextInput>
                </div>
            </div>
            <div class="createProject__item">
                <UIGaleryLoader :title="'Фото объекта'" :limit="10" :class="{error: imageListError}" @loadedImage="galeryImageLoaded" @remove="galeryImageRemoved"></UIGaleryLoader>                    
            </div>
            <div class="createProject__submitButton">
                <UIButton :style="'primary'" @click="sendData">Создать</UIButton>
            </div>
        </div>
    </div>
    <UILoadingWall v-if="isLoading"/>
</template>

<script>
import UIInput from '@/components/FormComponents/UIInput.vue';
import UISelect from '@/components/FormComponents/UISelect.vue';
import UIParamInput from '@/components/FormComponents/UIParamInput.vue';
import UICheckbox from '@/components/FormComponents/UICheckbox.vue';
import UIFileLoader from '@/components/FormComponents/UIFileLoader.vue';
import UITextInput from '@/components/FormComponents/UITextInput.vue';
import UIRangeInput from '@/components/FormComponents/UIRangeInput.vue';
import GaleryImage from '@/components/FormComponents/ImageLoaders/GaleryImage.vue';
import UIGaleryLoader from '@/components/FormComponents/ImageLoaders/UIGaleryLoader.vue';
import UIButton from '@/components/Buttons/UIButton.vue';

import UIHeader from '@/components/Header/UIHeader.vue'
import UILoadingWall from '@/components/UILoadingWall.vue'
import { AdressHelper } from '@/helpers/AdressHelper';
import {ProjectListController} from "@/helpers/projectListController.js"


export default {
    components: {
        UIInput, UISelect, UIHeader, UIParamInput, UICheckbox,
        UIFileLoader, UITextInput, UIRangeInput, GaleryImage,
        UIGaleryLoader, UIButton, UILoadingWall,
    },
    data() {
        return {
            viewModel: new ProjectListController(),
            city: "",
            title: "",
            adress: "",
            adressId: "user_createProject_Adress",
            typeOfHouse: 0,
            square: '',
            typeOfNew: 0,
            typeOfStart: 0,
            hasDesignProject: false,
            costStartValue: '',
            costEndValue: '',
            hostDocs: undefined,
            designProject: undefined,
            imageList: [],
            description: '',
            typesOfNew: [
                {id: 0, label: "Вторичка"},
                {id: 1, label: "Новостройка"}
            ],
            typesOfStart: [
                {id: 0, label: "В ближайшую неделю", offset: 7},
                {id: 1, label: "В ближайший месяц", offset: 30},
                {id: 2, label: "Более, чем через месяц", offset: 90},
            ],
            typesOfHouse: [
                {id: 0, label: "Квартира"},
                {id: 1, label: "Дом"}
            ],
            costStartConfig: {placeholder: '100000', prefix: 'от', suffix: '₽'},
            costEndConfig: {placeholder: '150000', prefix: 'до', suffix: '₽'},

            cityError: false,
            titleError: false,
            adressError: false,
            typeOfHouseError: false,
            squareError: false,
            typeOfNewError: false,
            typeOfStartError: false,
            hasDesignProjectError: false,
            costStartValueError: false,
            costEndValueError: false,
            hostDocsError: false,
            imageListError: false,
            descriptionError: false,

            isLoading: false,
        }
    },
    methods: {
        hostDocsLoaded(file) {
            this.hostDocs = file
        },

        hostDocsDeleted() {
            this.hostDocs = undefined
        },

        galeryImageLoaded(img) {
            this.imageList.push(img)
        },

        galeryImageRemoved(id) {
            this.imageList = this.imageList.filter(i => i.id != id)
        },

        async sendData() {
            try {
                this.isLoading = true
                const data = {
                    address: this.adress,
                    city: this.city,
                    description: this.description,
                    design_project_exists: this.hasDesignProject,
                    house_type: this.typesOfHouse.find(i => i.id == this.typeOfHouse),
                    is_new_building: this.typeOfNew == 0 ? false : true,
                    planned_budget_down: this.costStartValue,
                    planned_budget_up: this.costEndValue,
                    repair_type: "string",
                    square_meters: this.square,
                    start_date: this.typesOfStart.find(i => i.id == this.typeOfStart),
                    title: this.title,
                    // imageModel: {id: Number, file: File, scr: String}
                    imageList: this.imageList,
                    hostDocs: this.hostDocs,
                    designProject: this.designProject
                }
                await this.viewModel.createProject(data)
                this.$router.push("/user/myProjects")
            } catch(e) {
                console.log(e.message, e.code)
                switch (e.code) {
                    case 435:
                        this.adressError = true
                        break;
                    case 436:
                        this.cityError = true
                        break;
                    case 437:
                        this.descriptionError = true
                        break;
                    case 438:
                        this.hasDesignProjectError = true
                        break;
                    case 439:
                        this.typeOfHouseError = true
                        break;
                    case 440:
                        this.typeOfNewError = true
                        break;
                    case 441:
                        this.costStartValueError = true
                        break;
                    case 442:
                        this.costEndValueError = true
                        break;
                    case 443:
                        break;
                    case 444:
                        this.squareError = true
                        break;
                    case 445:
                        this.typeOfStartError = true
                        break;
                    case 446:
                        this.titleError = true
                        break;
                    default:
                        alert(e.message)
                        break;
                }
            } finally {
                this.isLoading = false
            }
        }
    },
    watch: {
        city() {
            this.cityError = false
        },
        title() {
            this.titleError = false
        },
        adress() {
            this.adressError = false
        },
        square() {
            this.squareError = false
        },
        costStartValue() {
            this.costStartValueError = false
        },
        costEndValue() {
            this.costEndValueError = false
        },
        hostDocs() {
            this.hostDocsError = false
        },
        imageList() {
            this.imageListError = false
        },
        descriptionError() {
            this.descriptionError = false
        }
    },
    mounted() {
        AdressHelper.shared.addToYMAP(this.adressId)
    },
}
</script>

<style>
</style>