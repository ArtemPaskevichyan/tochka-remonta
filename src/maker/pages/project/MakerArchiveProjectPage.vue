<template>
    <div class="headerPage">
        <UIHeader/>
        <span class="titleText pageTitle shortened" :class="{skeleton: !hasProject}">{{ project?.title ?? 'Название проекта'}}</span>
        <div class="projectSearchingPage backgroundCard">
            <UIGalery :imageNames="imageNames" :orientation="'h'"/>
            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">О проекте</div>
                <span class="projectSearchingPage__parameterTitle">Квадратура: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{(project?.square_meters ?? '100000') + " М²"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Возраст дома: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{houseNew ?? "skeleton new"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Тип дома: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.house_type ?? "skeleton type"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Город: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.city ?? "skeleton city"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Адрес объекта: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{project?.address ?? "skeleton address"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Стоимость: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                    {{(project?.planned_budget_down + ' — ' + project?.planned_budget_up + ' ₽') ?? "some skeleton budget"}}
                </span><br>
                <span class="projectSearchingPage__parameterTitle">Исполнитель: </span>
                <span class="projectSearchingPage__parameterValue" :class="{skeleton: !hasProject}">
                   {{ project?.contractor_uuid ?? "Не найден" }}
                </span><br>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Исполнитель</div>
                <div class="projectSearchingPage__makerCard">
                    <div class="projectSearchingPage__makerLogoHolder">
                        <img :src="avatarURL" alt="">
                    </div>
                    <div class="projectSearchingPage__makerInfo">
                        <div class="projectSearchingPage__makerTitle largeText">
                            {{ maker?.firstname ?? "TITLE"}}
                        </div>
                        <div class="projectSearchingPage__rating">
                            <UIRating :rating="maker?.rating ?? 0"/>
                        </div>
                        <div class="projectSearchingPage__controls">
                            <UIButton :style="'secondary'" @click="$router.push('/user/makerPage/' + this.project?.contractor_uuid)">Профиль</UIButton>
                            <UIButton :style="'primary'" @click="openSuggestModal">Предложить проект</UIButton>
                        </div>
                    </div>
                </div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Описание</div>
                <div class="projectSearchingPage__description" :class="{skeleton: !hasProject}">
                    {{project?.description ?? "some description for sceleton loader"}}
                </div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Отзыв</div>
                <div class="projectSearchingPage__review" :class="{skeleton: !hasProject}">
                    <Review :model="review"/>
                </div>
            </div>
        </div>

        <UIModal v-if="isSuggestModalShown" v-model:isOpened="isSuggestModalShown">
            <SuggestProject :makerModel="maker"/>
        </UIModal>
    </div>

    <UILoadingWall v-if="isLoading"/>
</template> 

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'
import UIHeader from '@/components/Header/UIHeader.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';
import UIRating from '@/components/FormComponents/UIRating.vue';
import { serverURL } from '@/preferenses';
import Review from '@/components/Supports/Review.vue';
import UIModal from '@/components/UIModal.vue';
import SuggestProject from '@/user/pages/components/SuggestProject.vue';


export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall, UIRating,
        UIModal, SuggestProject, Review,
    },
    data() {
        return {
            isLoading: false,
            isReviewLoading: false,
            isMakerLoading: false,
            isResponsesLoading: false,
            review: undefined,
            maker: {},
            avatarBaseURL: serverURL + '/api/v1/auth/get_avatar?filename=',
            isSuggestModalShown: false,
        }
    },
    props: {
        project: {
            type: Object,
            required: true,
        },
        imageNames: {
            type: Array,
            required: true,
        },
        projectController: {
            type: Object,
            required: true,
        },
    },
    computed: {
        hasProject: function() {
            return Boolean(this.project) 
        },
        houseNew: function() {
            if (this.project?.is_new_building == undefined) {
                return undefined
            } else {
                return this.project?.is_new_building ? "Новостройка" : "Вторичка"
            }
        },
        avatarURL: function() {
            return this.maker?.avatar ? this.avatarBaseURL + this.maker?.avatar : ''
        }
    },
    methods: {
        async getReview() {
            try {
                this.isReviewLoading = true
                const reviews = await this.projectController.getReview(this.project?.id)
                if (reviews?.length > 0) {
                    this.review = reviews[0]
                } else {
                    this.review = undefined
                }
            } catch(e) {
                //
            } finally {
                this.isReviewLoading = false
            }
        },
        async getMaker() {
            try {
                this.isMakerLoading = true
                this.maker = await this.projectController.getMaker(this.project?.contractor_uuid)
            } catch(e) {
                //
                console.log(e)
            } finally {
                this.isMakerLoading = false
            }
        },
        async getProjectRating() {
            await this.projectController.getProjectRating(this.project?.id)
                .then((response) => {
                    this.review.stars = response
                })
                .catch((error) => {
                    console.log("ERROR", error)
                })
            await this.projectController.getUserInfo(this.project?.customer_uuid)
                .then((response) => {
                    this.review.username = response?.firstname
                    this.review.img = response?.avatar
                })
                .catch((error) => {
                    console.log("ERROR", error)
                })
        },
        openSuggestModal() {
            this.isSuggestModalShown = true
        },
    },
    watch: {
        project: function() {
            if (!this.project?.id) { return }

            this.getMaker(this.project?.contractor_uuid)
            this.getReview(this.project?.id)
        }
    },
    mounted() {
        this.getMaker()
        this.getReview()
        this.getProjectRating()
    }
}
</script>

<style>

</style>