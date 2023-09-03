<template>
    <div class="headerPage tabBarPage">
        <UIHeader/>
        <UITabBar :page="'Новый проект'"/>
        <div class="titleText pageTitle">Добавление проекта</div>
        <div class="createProject backgroundCard">
            <div class="createProject__content" id="CPTitle">
                <div class="createProject__item" id="CPTitle">
                    <UIInput :placeholder="'Название'" :title="'Название проекта'" v-model:value="title" :class="{error: titleError}"></UIInput>
                </div>
                <div class="createProject__item" id="CPSquare">
                    <UIParamInput :placeholder="'60'" :title="'Квадратура'" v-model:value="square"
                    :suffix="'М²'" :size="'short'" :class="{error: squareError}"></UIParamInput>
                </div>
                <div class="createProject__item" id="CPTypeOfNew">
                    <UISelect :title="'Вид объекта'" v-model:value="typeOfNew" :selectArray="typesOfNew" :class="{error: typeOfNewError}"></UISelect>
                </div>
                <div class="createProject__item" id="CPTypeOfRepair">
                    <UISelect :title="'Вид ремонта'" v-model:value="typeOfRepair" :selectArray="typesOfRepair" :class="{error: typeOfNewError}"></UISelect>
                </div>
                <div class="createProject__item" id="CPTypeOfWork">
                    <UISelect :title="'Вид работы'" v-model:value="typeOfWork" :selectArray="typesOfWork" :class="{error: typeOfNewError}"></UISelect>
                </div>
                <div class="createProject__item" id="CPChoisesOfWalls">
                    <UIMultiChoise v-model:selectionData="choisesOfWalls" :title="'Покрытие стен'" :foldable="true"/>
                </div>
                <div class="createProject__item" id="CPChoisesOfFloor">
                    <UIMultiChoise v-model:selectionData="choisesOfFloor" :title="'Напольное покрытие'" :foldable="true"/>
                </div>
                <div class="createProject__item" id="CPChoisesOfTop">
                    <UIMultiChoise v-model:selectionData="choisesOfTop" :title="'Потолок'" :foldable="true"/>
                </div>
                <div class="createProject__item" id="CPChoisesOfNetworks">
                    <UIMultiChoise v-model:selectionData="choisesOfNetworks" :title="'Инженерные сети'" :foldable="true"/>
                </div>
                <div class="createProject__item" id="CPTypeOfHouse">
                    <UISelect :title="'Тип дома'" v-model:value="typeOfHouse" :selectArray="typesOfHouse" :class="{error: typeOfHouseError}"></UISelect>
                </div>
                <div class="createProject__item" id="CPCity">
                    <UIInput :placeholder="'Город'" :title="'Город'" v-model:value="city" :class="{error: cityError}"></UIInput>
                </div>
                <div class="createProject__item" id="CPAdress">
                    <UIInput class="adressHolder" :placeholder="'Адрес объекта'" :title="'Область, город, улица, дом'" v-model:value="adress" :class="{error: adressError}" :idOfInput="adressId"></UIInput>
                </div>
                <div class="createProject__item" id="CPStartDate">
                    <UISelect :title="'Когда хотите начать'" v-model:value="typeOfStart" :selectArray="typesOfStart" :class="{error: typeOfStartError}"></UISelect>
                </div>
                <div class="createProject__item" id="CPParamInput">
                    <UIRangeInput
                    v-model:startValue="costStartValue"
                    v-model:endValue="costEndValue"
                    :startInput="costStartConfig"
                    :endInput="costEndConfig"
                    :title="'Стоимость'"
                    :class="{error: costStartValueError || costEndValueError}">
                    </UIRangeInput>
                </div>
                <div class="createProject__item" id="CPHasDesign">
                    <UICheckbox v-model:value="hasDesignProject" :class="{error: hasDesignProjectError}">Есть дизайн проект</UICheckbox>
                </div>
                <!-- <div class="createProject__item" id="CPHostDocs">
                    <UIFileLoader :title="'Загрузка документов о правах собственности'" @fileLoaded="hostDocsLoaded" @cleared="hostDocsDeleted" :class="{error: hostDocsError}"></UIFileLoader>
                </div> -->
                <div class="createProject__item" id="CPDescription">
                    <UITextInput :title="'Описание'" :placeholder="'Описание проекта'" v-model:value="description" :class="{error: descriptionError}"></UITextInput>
                </div>
            </div>
            <div class="createProject__item" id="CPPhotos">
                <UIGaleryLoader :title="'Фото объекта'" :limit="10" :class="{error: imageListError}" @loadedImage="galeryImageLoaded" @remove="galeryImageRemoved"></UIGaleryLoader>                    
            </div>
            <SetReview class="createProject__item" :title="'Отзыв'" :textError="reviewError" v-model:text="reviewText" v-model:rating="reviewRating"/>
            <div class="createProject__submitButton">
                <UIButton :style="'primary'" @click="sendData">Создать</UIButton>
            </div>
        </div>
    </div>
    <UIProgressLoading v-if="isLoading" :status="uploadProgressStatus" v-model:progress="uploadProgress"></UIProgressLoading>
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
import UIMultiChoise from '@/components/FormComponents/UIMultiChoise.vue';

import SetReview from '@/components/Supports/SetReview.vue';
import UIHeader from '@/components/Header/UIHeader.vue';
import UITabBar from '@/components/UITabBar.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import UIProgressLoading from '@/components/UIProgressLoading.vue';
import { AdressHelper } from '@/helpers/AdressHelper';
import { UserDataController } from '@/helpers/UserDataController';
import {ProjectListController} from "@/helpers/projectListController.js"
import { ERROR_CODES } from '@/helpers/ErrorMaker';


export default {
    components: {
        UIInput, UISelect, UIHeader, UIParamInput, UICheckbox,
        UIFileLoader, UITextInput, UIRangeInput, GaleryImage,
        UIGaleryLoader, UIButton, UILoadingWall, SetReview,
        UITabBar, UIMultiChoise, UIProgressLoading, 
    },
    data() {
        return {
            viewModel: new ProjectListController(),
            city: "",
            title: "",
            adress: "",
            adressId: "user_createProject_Adress",
            typeOfHouse: 0,
            square: "",
            typeOfWork: 0,
            typeOfRepair: 0,
            typeOfNew: 0,
            typeOfStart: 0,
            hasDesignProject: false,
            costStartValue: '',
            costEndValue: '',
            hostDocs: undefined,
            designProject: undefined,
            imageList: [],
            description: "",

            typesOfNew: [
                {id: 0, label: "Вторичка"},
                {id: 1, label: "Новостройка"},
            ],
            typesOfWork: [
                {id: 0, label: "Только черновые"},
                {id: 1, label: "Только чистовые"},
                {id: 2, label: "Комплекс"},
            ],
            typesOfRepair: [
                {id: 0, label: "Под ключ"},
                {id: 1, label: "Частичный"},
            ],
            typesOfStart: [
                {id: 0, label: "В ближайшую неделю", offset: 7},
                {id: 1, label: "В ближайший месяц", offset: 30},
                {id: 2, label: "Более, чем через месяц", offset: 90},
            ],
            typesOfHouse: [
                {id: 0, label: "Квартира"},
                {id: 1, label: "Дом"},
            ],

            choisesOfWalls: [
                {id: 0, label: "Обои", active: false},
                {id: 1, label: "Обои под покраску", active: false},
                {id: 2, label: "Покраска", active: false},
                {id: 3, label: "Декоративная штукатурка", active: false},
                {id: 4, label: "Плитка", active: false},
                {id: 5, label: "Другое", active: false},
            ],
            choisesOfFloor: [
                {id: 0, label: "Ламинат", active: false},
                {id: 1, label: "Линолиум", active: false},
                {id: 2, label: "Кварцвинил", active: false},
                {id: 3, label: "Плитка", active: false},
                {id: 4, label: "Паркет", active: false},
                {id: 5, label: "Инженерная доска", active: false},
                {id: 6, label: "Другое", active: false},
            ],
            choisesOfTop: [
                {id: 0, label: "Натяжной", active: false},
                {id: 1, label: "ГКЛ (Гибсокартоновый лист)", active: false},
                {id: 2, label: "Побелка", active: false},
                {id: 3, label: "Другое", active: false},
            ],
            choisesOfNetworks: [
                {id: 0, label: "Электрика", active: false},
                {id: 1, label: "Сантехника", active: false},
                {id: 2, label: "Климототехника", active: false},
                {id: 3, label: "Другое", active: false},
            ],
            costStartConfig: {placeholder: '100000', prefix: 'от', suffix: '₽'},
            costEndConfig: {placeholder: '150000', prefix: 'до', suffix: '₽'},

            reviewText: "",
            reviewRating: undefined,
            reviewError: false,

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
            uploadProgress: 0,
            uploadProgressStatus: "",
            isLoading: false,
            choiseOfTopError: false,
            choiseOfFloorError: false,
            choiseOfNetworksError: false,
            choiseOfWallsError: false,
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

        smoothScrollTo(selector) {
            // document.querySelector(selector).scrollIntoView({behavior: 'smooth', block: 'center', duration: 200,})

            $([document.documentElement, document.body]).animate({
                scrollTop: $(selector).offset().top - 200
            }, 350);
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
                    ceiling: this.getCeiling,
                    engineering_networks: this.getEngineeringNetworks,
                    floor_covering: this.getFloorCovering,
                    wall_covering: this.getWallCovering,
                    // imageModel: {id: Number, file: File, scr: String}
                    imageList: this.imageList,
                    hostDocs: this.hostDocs,
                    // designProject: this.designProject
                }

                let review = {
                    text: this.reviewText,
                    rating: this.reviewRating,
                }
                await this.viewModel.createProject(data, review, this)
                this.$router.push("/maker/myProjects")
            } catch(e) {
                console.log(e.message, e.code)
                switch (e.code) {
                    case ERROR_CODES.CPVAddressFailed:
                        this.adressError = true
                        this.smoothScrollTo("#CPAdress")
                        break;
                    case ERROR_CODES.CPVCityFailed:
                        this.cityError = true
                        this.smoothScrollTo("#CPCity")
                        break;
                    case ERROR_CODES.CPVDescriptionFailed:
                        this.descriptionError = true
                        this.smoothScrollTo("#CPDescription")
                        break;
                    case ERROR_CODES.CPVDesignProjectFailed:
                        this.hasDesignProjectError = true
                        this.smoothScrollTo("#CPHasDesign")
                        break;
                    case ERROR_CODES.CPVHouseTypeFailed:
                        this.typeOfHouseError = true
                        this.smoothScrollTo("#CPTypeOfHouse")
                        break;
                    case ERROR_CODES.CPVNewBuildingFailed:
                        this.typeOfNewError = true
                        this.smoothScrollTo("#CPTypeOfNew")
                        break;
                    case ERROR_CODES.CPVPlanedBudgetDownFailed:
                        this.costStartValueError = true
                        this.smoothScrollTo("#CPParamInput")
                        break;
                    case ERROR_CODES.CPVPlanedBudgetUpFailed:
                        this.costEndValueError = true
                        this.smoothScrollTo("#CPParamInput")
                        break;
                    case ERROR_CODES.CPVRepairTypeFailed:
                        this.smoothScrollTo("#CPParamInput")
                        break;
                    case ERROR_CODES.CPVSquareFailed:
                        this.squareError = true
                        this.smoothScrollTo("#CPSquare")
                        break;
                    case ERROR_CODES.CPVStartDateFailed:
                        this.typeOfStartError = true
                        this.smoothScrollTo("#CPStartDate")
                        break;
                    case ERROR_CODES.CPVTitleFailed:
                        this.titleError = true
                        this.smoothScrollTo("#CPTitle")
                        break;
                    case ERROR_CODES.CPVImageListFailed:
                        this.imageListError = true
                        this.smoothScrollTo("#CPPhotos")
                        break;
                    case 448:
                        this.reviewError = true
                        break;
                    case 449:
                        alert(e.message)
                        break;
                    case ERROR_CODES.CPVCeiligFailed:
                        this.choiseOfTopError = true,
                        this.smoothScrollTo("#CPChoisesOfTop")
                        break;
                    case ERROR_CODES.CPVNetworksFailed:
                        this.choiseOfNetworksError = true,
                        this.smoothScrollTo("#CPChoisesOfNetworks")
                        break;
                    case ERROR_CODES.CPVFloorsFailed:
                        this.choiseOfFloorError = true,
                        this.smoothScrollTo("#CPChoisesOfFloor")
                        break;
                    case ERROR_CODES.CPVWallsFailed:
                        this.choiseOfWallsError = true,
                        this.smoothScrollTo("#CPChoisesOfWalls")
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
        description() {
            this.descriptionError = false
        },
        reviewText() {
            this.reviewError = false
        },
        choisesOfFloor: {
            deep: true,
            handler() { this.choiseOfFloorError = false },
        },
        choisesOfTop: {
            deep: true,
            handler() { this.choiseOfTopError = false },
        },
        choisesOfWalls: {
            deep: true,
            handler() { this.choiseOfWallsError = false },
        },
        choisesOfNetworks: {
            deep: true,
            handler() { this.choiseOfNetworksError = false },
        },
    },
    mounted() {
        AdressHelper.shared.addToYMAP(this.adressId, (data) => {
            this.adress = data
        })
        UserDataController.shared.getData()
            .then((response) => {
                this.city = response.city
            })
    },
    computed: {
        getCeiling() {
            let filteredList = []
            for (let e of this.choisesOfTop) {
                if (e.active) filteredList.push(e.label)
            }
            return filteredList
        },
        getFloorCovering() {
            let filteredList = []
            for (let e of this.choisesOfFloor) {
                if (e.active) filteredList.push(e.label)
            }
            return filteredList
        },
        getEngineeringNetworks() {
            let filteredList = []
            for (let e of this.choisesOfNetworks) {
                if (e.active) filteredList.push(e.label)
            }
            return filteredList
        },
        getWallCovering() {
            let filteredList = []
            for (let e of this.choisesOfWalls) {
                if (e.active) filteredList.push(e.label)
            }
            return filteredList
        }
    }
}
</script>

<style>
</style>