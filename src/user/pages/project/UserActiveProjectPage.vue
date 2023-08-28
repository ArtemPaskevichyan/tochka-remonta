<template>
    <div class="headerPage">
        <UIHeader/>
        <span class="titleText pageTitle shortened" :class="{skeleton: !hasProject}">{{ project?.title ?? 'Название проекта'}}</span>
        <div class="projectSearchingPage backgroundCard">
            <UIGalery :imageNames="imageNames" :orientation="'h'"/>
            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Согласование ключевых вопросов
                    <span class="link" @click="openNegotiationList">
                        все {{negotiations?.length}}
                    </span>
                </div>
                <Negotiation v-for="n in negotiations?.slice(0, 3)" :key="n.id" :model="n" @open="openNegotiation(n)"/>
                <div class="projectSearchingPage__caption" v-if="negotiations?.length == 0  || negotiations == null">Вопросов для согласования пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">
                    События
                    <span class="link" @click="openEventList">
                        все {{eventList?.length}}
                    </span>
                </div>
                <Event v-for="e in eventList?.slice(-3)" :key="e.id" :model="e"/>
                <div class="projectSearchingPage__caption" v-if="eventList?.length == 0">Событий пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">План работы</div>
                <div class="projectSearchingPage__gantDiagram" :id="ganttId" :class="{skeleton: gantIsLoading}">
                    <div v-if="gantTasksList?.length == 0" class="projectSearchingPage__gantDiagramMessage">{{ gantMessage }}</div>
                </div>
                <div class="projectSearchingPage__gantFooter" v-if="hasNewDiagram && shownNewDiagram">
                    <div class="projectSearchingPage__caption">
                        Предложенный измененный план график
                    </div>
                    <UIButton :style="'default'" @click="showHideNewDiagram">Показать нынешний график</UIButton>
                </div>
                <div class="projectSearchingPage__gantFooter" v-else-if="hasNewDiagram && !shownNewDiagram">
                    <div class="projectSearchingPage__caption">
                        Исполнитель предложил измененный план график
                    </div>
                    <UINotificationIndicatiorHolder :amount="-1" :displayZero="true">
                        <UIButton :style="'default'" @click="showHideNewDiagram">Предложенный график</UIButton>
                    </UINotificationIndicatiorHolder>
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
                    <UIButton @click="$router.push({name: 'chat', query: {command: 'go', value: `/direct/${project.contractor_uuid}`}})"><i class="icon-chat"></i>Написать исполнителю</UIButton>
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
        <NegotiationList v-if="modalContentType == 'neg_l'" :negotiationList="negotiations" @open="openNegotiation"/>
        <EventList v-if="modalContentType == 'evt_l'" :eventList="eventList"/>
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
import UINotificationIndicatiorHolder from '@/components/NotificationIndicator/UINotificationIndicatiorHolder.vue';

import Negotiation from '@/components/Supports/Negotiation.vue';
import NegotiationView from '@/components/Supports/NegotiationView.vue';
import NegotiationList from '@/components/Supports/NegotiationList.vue';
import ProjectPhotosView from '@/components/Supports/ProjectPhotosView.vue';
import Event from '@/components/Supports/Event.vue';
import EventList from '@/components/Supports/EventList.vue';
import GaleryImage from '@/components/Galery/GaleryImage.vue';
import CompleteProject from '@/components/Supports/CompleteProject.vue';
import { serverURL } from '@/preferenses';
import { UserDataController } from '@/helpers/UserDataController.js'

import { GanttHelper } from '@/helpers/GanttHelper';


export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall,
        Negotiation, NegotiationView, Event, GaleryImage, UIModal,
        ProjectPhotosView, CompleteProject, UINotificationIndicatiorHolder,
        NegotiationList, EventList,
    },
    data() {
        return {
            srcBase: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            isModalOpened: false,
            modalContentType: undefined,
            negotiationModel: undefined,
            negotiations: [{}, {}, {}],
            isLoading: false,
            isResponsesLoading: false,
            ganttId: "__gantt__",
            gantHelper: new GanttHelper(),
            gantMessage: "Загрузка плана работ...",
            gantTasksList: [],
            gantIsLoading: true,
            hasNewDiagram: false,
            shownNewDiagram: false,
        }
    },
    methods: {
        async getNegotiations() {
            try {
                this.negotiations = await this.projectController.getNegotiations(this.project?.id)
                this.lookForNewDiagramm()
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
        openNegotiationList() {
            this.modalContentType = 'neg_l'
            this.isModalOpened = true
        },
        openEventList() {
            this.modalContentType = 'evt_l'
            this.isModalOpened = true
        },
        async negotiationDenied(text) {
            if (!confirm("Вы уверены, что хотите отказать исполнителю на это согласие?")) { return }

            try {
                this.isLoading = true
                await this.projectController.setNegotiationDecision(this.negotiationModel?.id, false, text)
            } catch(e) {
                //
                console.log(e)
            } finally {
                this.isLoading = false
                this.isModalOpened = false
                this.$router.go()
            }
        },
        async negotiationAllowed(text) {
            if (!confirm("Вы уверены, что хотите согласовать это заявление с исполнителем?")) { return }

            try {
                this.isLoading = true
                await this.projectController.setNegotiationDecision(this.negotiationModel?.id, true, text)
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
            try {
                this.gantTasksList = await this.projectController.getDiagramTasks(this.project?.id)
            } catch(error) {
                console.log("HANDLED ERROR", error)
                this.gantMessage = "На платформе появилась ошибка. Пожалуйста, проверьте этот раздел позже"
                return
            } finally {
                this.gantIsLoading = false
            }

            if (this.gantTasksList?.length > 0) {
                this.gantHelper.createDiagram('#' + this.ganttId, this.gantTasksList)
            } else {
                this.gantMessage = "Похоже, исполнитель еще не заполнил план работ"
            }
        },

        lookForNewDiagramm() {
            for (let n of this.negotiations) {
                if (!n.decision && n.type == "diagram") {
                    for (let i in n.project_tasks) {
                        n.project_tasks[i].id = String(n.project_tasks[i].id)
                        n.project_tasks[i].start = new Date(Date.parse(n.project_tasks[i].start))
                            .toISOString()
                            .split("T")[0]
                        n.project_tasks[i].end = new Date(Date.parse(n.project_tasks[i].end))
                            .toISOString()
                            .split("T")[0]
                    }

                    this.hasNewDiagram = n.project_tasks
                    break
                }
            }
        },

        showHideNewDiagram() {
            this.shownNewDiagram = !this.shownNewDiagram
            
            if (this.shownNewDiagram) {
                this.gantHelper.refresh(this.hasNewDiagram)
            } else {
                this.gantHelper.refresh(this.gantTasksList)
            }
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