<template>
    <div class="headerPage">
        <UIHeader/>
        <span class="titleText pageTitle shortened" :class="{skeleton: !hasProject}">{{ project?.title ?? 'Название проекта'}}</span>
        <div class="projectSearchingPage backgroundCard">
            <UIGalery :imageNames="imageNames" :orientation="'h'"/>
            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">
                    <div>
                        Согласования
                        <UIButton :style="'primary'" @click="createNegotiation">Создать</UIButton>
                    </div>
                    <span class="link" @click="openNegotiationList">
                        все {{negotiations?.length}}
                    </span>
                </div>
                <!-- <Negotiation v-for="n in negotiations?.slice(-3)" :key="n.id" :model="n" @open="openNegotiation(n)"/> -->
                <Negotiation v-for="n in negotiations?.slice(0, 3)" :key="n.id" :model="n" @open="openNegotiation(n)"/>
                <div class="projectSearchingPage__caption" v-if="negotiations?.length == 0 || negotiations == null">Вопросов для согласования пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">
                    События
                    <span class="link" @click="openEventList">
                        все {{eventList?.length}}
                    </span>
                </div>
                <!-- <Event v-for="e in eventList?.slice(-3)" :key="e.id" :model="e"/> -->
                <Event v-for="e in eventList" :key="e.id" :model="e"/>
                <div class="projectSearchingPage__caption" v-if="eventList?.length == 0">Событий пока нет</div>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">
                    План работы
                    <UIButton id="editDiagramButton" :style="'default'" @click="editDiagram">Редактировать</UIButton>
                </div>
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
                        Вы предложили измененный план график
                    </div>
                    <UINotificationIndicatiorHolder :amount="-1" :displayZero="true">
                        <UIButton :style="'default'" @click="showHideNewDiagram">Предложенный график</UIButton>
                    </UINotificationIndicatiorHolder>
                </div>
            </div>

            <!-- <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Денежные потоки</div>
            </div> -->

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Фото архив</div>
                <div class="projectSearchingPage__photos">
                    <GaleryImage :src="imgName ? srcBase+imgName : ''" :key="index" v-for="(imgName, index) in eventImageNames" @click="chose(index)"/>
                </div>
                <UIButton class="projectSearchingPage__photosButton" :style="'primary'" @click="createEvent">Загрузить событие</UIButton>
            </div>

            <div class="projectSearchingPage__block">
                <div class="projectSearchingPage__blockTitle">Действия</div>
                <div class="projectSearchingPage__controls">
                    <UIButton @click="openCompletion">Завершить проект</UIButton>
                </div>
            </div>
        </div>
    </div>

    <UIModal v-if="isModalOpened" v-model:isOpened="isModalOpened">
        <NegotiationView v-if="modalContentType == 'neg'" :model="negotiationModel" :watchOnly="true"/>
        <EventCreation v-if="modalContentType == 'evt_c'" @load="handleEventCreation"/>
        <NegotiationCreation v-if="modalContentType == 'neg_c'" @send="handleNegotiationCreation"/>
        <ProjectPhotosView v-if="modalContentType == 'pts'" :imageNames="eventImageNames"/>
        <CompleteProjectForMaker v-if="modalContentType == 'cpl'" @complete="completeProject"/>
        <GanttDiagramEditor v-if="modalContentType == 'e_dia'" :tasksProp="gantTasksList" @commit="saveGanttTasks"></GanttDiagramEditor>
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
import CompleteProjectForMaker from '@/components/Supports/CompleteProjectForMaker.vue';
import EventCreation from '@/components/Supports/EventCreation.vue';
import NegotiationCreation from '@/components/Supports/NegotiationCreation.vue';
import GanttDiagramEditor from '@/components/Supports/GanttDiagramEditor.vue';
import { serverURL } from '@/preferenses';
import { UserDataController } from '@/helpers/UserDataController';

import { GanttHelper } from '@/helpers/GanttHelper';

export default {
    components: {
        UIGalery, UIHeader, UILink, UIButton, UILoadingWall,
        Negotiation, NegotiationView, Event, GaleryImage, UIModal,
        ProjectPhotosView, CompleteProjectForMaker, EventCreation,
        NegotiationCreation, GanttDiagramEditor, UINotificationIndicatiorHolder,
        NegotiationList, EventList,
    },
    data() {
        return {
            srcBase: `${serverURL}/api/v1/projects/get_event_photo?filename=`,
            isModalOpened: false,
            modalContentType: "e_dia",
            negotiationModel: undefined,
            negotiations: [{}, {}, {}],
            isNegotiationsLoading: true,
            isLoading: false,
            isResponsesLoading: false,
            ganttId: "__gantt__",
            gantHelper: new GanttHelper(),
            gantMessage: "Загрузка плана работ...",
            gantIsLoading: true,
            gantTasksList: [],
            hasNewDiagram: false,
            shownNewDiagram: false,
        }
    },
    methods: {
        async getNegotiations() {
            try {
                this.isNegotiationsLoading = true
                this.negotiations = await this.projectController.getNegotiations(this.project?.id, 3)
                this.lookForNewDiagramm()
            } catch(e) {
                //
            } finally {
                this.isNegotiationsLoading = false
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
        createNegotiation() {
            this.modalContentType = "neg_c"
            this.isModalOpened = true
        },
        createEvent() {
            this.modalContentType = "evt_c"
            this.isModalOpened = true
        },
        editDiagram() {
            this.modalContentType = "e_dia"
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
        async handleEventCreation(data) {
            try {
                this.isModalOpened = false
                this.isLoading = true
                await this.projectController.createEvent(data, this.project?.id)
                this.$emit('eventCreated')
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
        },
        async handleNegotiationCreation(data) {
            try {
                this.isModalOpened = false
                this.isLoading = true
                await this.projectController.createNegotiation(data, this.project?.id, this.project?.customer_uuid)
                this.getNegotiations()
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
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
            }
        },
        async completeProject(model) {
            if (!confirm("Вы уверены, что хотите завершить выполнение проекта?")) { return }

            try {
                this.isLoading = true
                await this.projectController.completeProject(this.project?.id, model?.rating, model?.text)
            } catch(e) {
                //
            } finally {
                this.isLoading = false
            }
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
                this.gantMessage = "Похоже, вы еще не заполнил план работ"
            }
            // this.gantHelper.createDiagram('#' + this.ganttId, this.gantTasksList)
        },

        async saveGanttTasks({taskList, changed}) {
            console.log(changed)
            if (changed) {
                try {
                    this.projectController.createDiagramNegotiation(taskList, this.project?.id, this.project?.customer_uuid)
                    this.isModalOpened = false
                    this.$router.go()
                } catch(e) {
                    console.log("ERROR", e)
                }
            } else {
                console.log("NO CHANGES")
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
            if (uuid != this.project?.contractor_uuid) {
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
            return this.eventList?.map(e => e?.photos?.length > 0 ? e?.photos[0]?.filename : '')
        },
    }
}
</script>