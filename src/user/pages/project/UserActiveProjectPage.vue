<template>
    <div class="headerPage">
        <UIHeader/>
        <span class="titleText pageTitle shortened" :class="{skeleton: !hasProject}">{{ project?.title ?? 'Название проекта'}}</span>
        <div class="projectSearchingPage backgroundCard">
            <UIGalery :imageNames="imageNames" :orientation="'h'"/>
            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Согласование ключевых вопросов</div>
                <Negotiation v-for="n in negotiations?.slice(0, 3)" :key="n.id" :model="n" @open="openNegotiation(n)"/>
                <div class="projectSearchingPage__caption" v-if="negotiations?.length == 0  || negotiations == null">Вопросов для согласования пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">События</div>
                <Event v-for="e in eventList?.slice(-3)" :key="e.id" :model="e"/>
                <div class="projectSearchingPage__caption" v-if="eventList?.length == 0">Событий пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">План работы</div>
                <div class="projectSearchingPage__gantDiagram" :id="ganttId" :class="{skeleton: gantIsLoading}">
                    <div v-if="gantTasksList?.length == 0" class="projectSearchingPage__gantDiagramMessage">{{ gantMessage }}</div>
                </div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Фото архив</div>
                <div class="projectSearchingPage__photos">
                    <GaleryImage :src="imgName ? srcBase+imgName : ''" :key="index" v-for="(imgName, index) in eventImageNames" @click="chose(index)"/>
                </div>
                <UIButton class="projectSearchingPage__photosButton" :style="'primary'" @click="openPhotos">Смотреть галерею</UIButton>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Действия</div>
                <div class="projectSearchingPage__controls">
                    <UIButton @click="goToMaker">Профиль исполнителя</UIButton>
                    <UIButton @click="openCompletion">Завершить проект</UIButton>
                </div>
            </div>
        </div>
    </div>

    <UIModal v-if="isModalOpened" v-model:isOpened="isModalOpened">
        <NegotiationView v-if="modalContentType == 'neg'" :model="negotiationModel" @allow="negotiationAllowed" @deny="negotiationDenied"/>
        <ProjectPhotosView v-if="modalContentType == 'pts'" :imageNames="eventImageNames"/>
        <CompleteProject v-if="modalContentType == 'cpl'" @complete="completeProject"/>
    </UIModal>

    <UILoadingWall v-if="isLoading"/>
</template> 

<script>
import UIGalery from '@/components/Galery/UIGalery.vue'
import UIHeader from '@/components/Header/UIHeader.vue';
import UILink from '@/components/FormComponents/UILink.vue';
import UIButton from '@/components/Buttons/UIButton.vue';
import UIModal from '@/components/UIModal.vue';
import UILoadingWall from '@/components/UILoadingWall.vue';

import Negotiation from '@/components/Supports/Negotiation.vue';
import NegotiationView from '@/components/Supports/NegotiationView.vue';
import ProjectPhotosView from '@/components/Supports/ProjectPhotosView.vue';
import Event from '@/components/Supports/Event.vue';
import GaleryImage from '@/components/Galery/GaleryImage.vue';
import CompleteProject from '@/components/Supports/CompleteProject.vue';
import { serverURL } from '@/preferenses';

import { GanttHelper } from '@/helpers/GanttHelper';


export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall,
        Negotiation, NegotiationView, Event, GaleryImage, UIModal,
        ProjectPhotosView, CompleteProject,
    },
    data() {
        return {
            srcBase: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            isModalOpened: false,
            modalContentType: undefined,
            negotiationModel: undefined,
            negotiations: [],
            isLoading: false,
            isResponsesLoading: false,
            ganttId: "__gantt__",
            gantHelper: new GanttHelper(),
            gantMessage: "Загрузка плана работ...",
            gantTasksList: [
            {
                    id: '0',
                    name: 'Заливка фундамента',
                    start: '2023-07-20',
                    end: '2023-07-27',
                    progress: 100,
                    custom_class: 'bar-milestone'
                },
                {
                    id: '1',
                    name: 'Выравнивание полов',
                    start: '2023-07-28',
                    end: '2023-07-30',
                    progress: 100,
                    custom_class: 'bar-milestone'
                },
                {
                    id: '2',
                    name: 'Возведение каркаса',
                    start: '2023-08-01',
                    end: '2023-08-10',
                    progress: 100,
                    custom_class: 'bar-milestone'
                },
                {
                    id: '3',
                    name: 'Очистка территории',
                    start: '2023-08-04',
                    end: '2023-08-12',
                    progress: 100,
                    custom_class: 'bar-milestone'
                },
                {
                    id: '4',
                    name: 'Установка кровли',
                    start: '2023-08-11',
                    end: '2023-08-14',
                    progress: 100,
                    custom_class: 'bar-milestone'
                },
                {
                    id: '5',
                    name: 'Внутренняя работа',
                    start: '2023-08-15',
                    end: '2023-08-27',
                    progress: 70,
                    custom_class: 'bar-milestone'
                },
            ],
            gantIsLoading: true,
        }
    },
    methods: {
        async getNegotiations() {
            try {
                this.negotiations = await this.projectController.getNegotiations(this.project?.id)
            } catch(e) {
                //
            }
        },
        openNegotiation(n) {
            this.modalContentType = 'neg'
            this.isModalOpened = true
            this.negotiationModel = n
        },
        openPhotos() {
            this.modalContentType = 'pts'
            this.isModalOpened = true
        },
        openCompletion() {
            this.modalContentType = 'cpl'
            this.isModalOpened = true
        },
        async negotiationDenied() {
            if (!confirm("Вы уверены, что хотите отказать исполнителю на это согласие?")) { return }

            try {
                this.isLoading = true
                await this.projectController.setNegotiationDecision(this.negotiationModel?.id, false)
            } catch(e) {
                //
                console.log(e)
            } finally {
                this.isLoading = false
                this.isModalOpened = false
                this.$router.go()
            }
        },
        async negotiationAllowed() {
            if (!confirm("Вы уверены, что хотите согласовать это заявление с исполнителем?")) { return }

            try {
                this.isLoading = true
                await this.projectController.setNegotiationDecision(this.negotiationModel?.id, true)
                this.isModalOpened = false
            } catch(e) {
                //
                console.log(e)
            } finally {
                this.isLoading = false
                this.isModalOpened = false
                this.$router.go()
            }
        },
        async completeProject(model) {
            if (!confirm("Вы уверены, что хотите завершить выполнение проекта?")) { return }

            try {
                this.isLoading = true
                await this.projectController.completeProject(this.project?.id, model?.rating, model?.text)
                this.isModalOpened = false
                this.$router.go()
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },
        goToMaker() {
            this.$router.push('/user/makerPage/' + this.project?.contractor_uuid)
        },
        async loadDiagram() {
            // try {
            //     this.tasks = await this.projectController.getDiagramTasks(this.project?.id)
            // } catch(error) {
            //     console.log("HANDLED ERROR", error)
            //     this.gantMessage = "Похоже, исполнитель еще не заполнил план работ"
            //     return
            // } finally {
            //     this.gantIsLoading = false
            // }

            // if (this.tasks?.length > 0) {
            //     this.gantHelper.createDiagram('#' + this.ganttId, this.tasks)
            // }
            this.gantHelper.createDiagram('#' + this.ganttId, this.tasks)
        },
        async onMounted() {
            this.isLoading = true
            var uuid = (await UserDataController.shared.getData()).uuid
            console.log(uuid)
            if (uuid != this.project?.customer_uuid) {
                console.log("GOBACK2")
                this.$router.back()
                return
            }
            this.isLoading = false
            this.getNegotiations()
            this.loadDiagram()
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
        eventList: {
            type: Array,
            required: true,
        }
    },
    watch: {
        project: function() {
            if (!this.project?.id) { return }

            this.getNegotiations()
        }
    },
    mounted() {
        this.onMounted()
    },
    computed: {
        hasProject: function() {
            return Boolean(this.project) 
        },
        eventImageNames: function() {
            return this.eventList?.map(e => e?.photos[0]?.filename)
        },
    }
}
</script>