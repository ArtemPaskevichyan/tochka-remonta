<template>
  <div class="ganttEditor">
    <div class="ganttEditor__title titleText">Редакторование диаграмы</div>
    <div class="ganttEditor__content">
      <div class="ganttEditor__leftSide">
        <div class="ganttEditor__sideHeader ganttEditor__sideTitle">
          Список задач
        </div>
        <div class="ganttEditor__listOfTasks">
          <div class="ganttEditor__task" :class="{opened: task.active}" v-for="task in this.tasks" :key="task.id">
            <div class="ganttEditor__taskInList" v-if="!task.active">
              <input type="text" v-model="task.name" @keydown="onInputCompleted">
              <UIButton :style="'default square ultrasmall'" @click="openTask(task)">
                <i class="icon-options"></i>
              </UIButton>
            </div>
            <div v-else class="ganttEditor__taskInList opened">
              <input type="text" v-model="task.name" @keydown="onInputCompleted">
              <div>Начало: <input type="text" v-model="task.start" @keydown="onInputCompleted"></div>
              <div>Конец: <input type="text" v-model="task.end" @keydown="onInputCompleted"></div>
              <div>Прогресс: <input type="text" v-model="task.progress" @keydown="onInputCompleted"></div>
              <div class="ganttEditor__taskControlls">
                <UIButton :style="'default'" @click="closeTask(task)">Свернуть</UIButton>
                <UIButton :style="'destructive square'" @click="removeTask(task.id)" title="Удалить задачу"><i class="icon-trash"></i></UIButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ganttEditor__rightSide">
        <div class="ganttEditor__controlls ganttEditor__sideHeader">
          <span></span>
          <UISwitch :data="ganttStyle" @selectedId="changeGanttMode"></UISwitch>
          <UIButton
            class="ganttEditor__button"
            :style="'primary square small'"
            @click="addTask"
            title="Добавить задачу"
            ><i class="icon-plus"></i
          ></UIButton>
        </div>
        <div class="ganttEditor__diagram" :id="ganttId">
          <div
            v-if="ganttMessage?.length != 0"
            class="projectSearchingPage__gantDiagramMessage"
          >
            {{ ganttMessage }}
          </div>
        </div>
      </div>
    </div>
    <div class="ganttEditor__footer">
      <button class="ganttEditor__questionButton" ref="gantEditorQuestionButton" @click="openInstruction" title="Как работать с диаграмами?">?</button>
      <UIButton :style="'primary'" @click="commitChanges">Сохранить</UIButton>
    </div>
  </div>

  <UIAlert v-if="isAlertOpened" v-model:isOpened="isAlertOpened">
    <template v-slot:body>
      <div class="alert__baseTitle" v-if="messageToAlert?.title">
        {{messageToAlert?.title}}
      </div>
      <div class="alert__baseText" v-if="messageToAlert?.text">
        {{messageToAlert?.text}}
      </div>
    </template>
    <template v-slot:controls>
      <UIButton :style="b?.style" @click="b?.callback" :key="index" v-for="(b, index) in messageToAlert?.buttons">
        {{ b?.label }}
      </UIButton>
    </template>
  </UIAlert>

  <UIModal v-if="isModalOpened" v-model:isOpened="isModalOpened">
    <div class="ganttEditor__instruction">
      <div class="modal__defaultTitle">Работать с диаграмами просто!</div>
      <div class="modal__defaultText">5 шагов</div>
  
      <section class="ganttEditor__instructionBlock">
        <div class="largeText ganttEditor__instructionBlockTitle">Добавление задачи</div>
        <div class="ganttEditor__instructionImageHolder">
          <img src="@/assets/images/gantInstruction1.png"/>
        </div>
        <div class="baseText ganttEditor__instructionBlockText">
          <p>
            Чтобы добавить задачу, нажмите на "+" в правом верхнем углу окна
          </p>
        </div>
      </section>
      <section class="ganttEditor__instructionBlock">
        <div class="largeText ganttEditor__instructionBlockTitle">Изменить название задачи</div>
        <div class="ganttEditor__instructionImageHolder">
          <img src="@/assets/images/gantInstruction2.png"/>
        </div>
        <div class="baseText ganttEditor__instructionBlockText">
          <p>
            Чтобы изменить название задачи, просто введите новое название в текстовое поле в разделе "Список задач" в левой части окна.
          </p>
          <p>
            Нажмите Enter, чтобы применить новое название
          </p>
        </div>
      </section>
      <section class="ganttEditor__instructionBlock">
        <div class="largeText ganttEditor__instructionBlockTitle">Изменить прогресс задачи или даты начала/конца.<br>Удаление задачи</div>
        <div class="ganttEditor__instructionImageHolder">
          <img src="@/assets/images/gantInstruction3.png"/>
        </div>
        <div class="baseText ganttEditor__instructionBlockText">
          <p>
            Чтобы изменить прогресс задачи или дату начала/конца, нажмите на "•••", измените необходимые вам поля в открывшемся меню редактирования задачи.
          </p>
          <p>
            <strong>! Помните,</strong> что дата указывается в формате ГГГГ-ММ-ДД, а прогресс - целое число от 0 до 100, это нужно для корректной работы редактора диаграмы. Нажмите Enter, чтобы применить изменения.
          </p>
          <p>
            Чтобы удалить задачу, нажмите "Удалить" в открывшемся меню редактирования задачи
          </p>
        </div>  
      </section>
      <section class="ganttEditor__instructionBlock">
        <div class="largeText ganttEditor__instructionBlockTitle">Работа с графиком</div>
        <div class="ganttEditor__instructionImageHolder">
          <img src="@/assets/images/gantInstruction4.png"/>
        </div>
        <div class="baseText ganttEditor__instructionBlockText">
          <p>
            Вы можете менять дату начала/конца непоследственно на графике. Потяните за один из концов задачи, чтобы растянуть или сжать её. Передвигайте задачу по графику, если это необходимо.
          </p>
          <p>
            Вы можете менять прогресс задачи, передвигая флажок (он появляется при ненулевом прогрессе. Посмотрите предыдущий пункт, чтобы узнать, как быстро сделать это)
          </p>
        </div>
      </section>
      <section class="ganttEditor__instructionBlock">
        <div class="largeText ganttEditor__instructionBlockTitle">Завершение редактирования</div>
        <div class="ganttEditor__instructionImageHolder">
          <img src="@/assets/images/gantInstruction5.png"/>
        </div>
        <div class="baseText ganttEditor__instructionBlockText">
          <p>
            Чтобы завершить редактирование, нажмите "Сохранить" в правом нижнем углу окна. <strong>Обратите внимание</strong>, что созданный вами график или изменения, которые вы внесли, вступят в силу, только после одобрения их заказчиком.
          </p>
          <p>
            После сохранения плана работ, заказчику будет отправлено согласование с предложением принять обновленный вами график
          </p>
        </div>
      </section>
    </div>
  </UIModal>
</template>

<script>
import { toRaw } from 'vue';

import { GanttHelper } from "@/helpers/GanttHelper";
import UIButton from "@/components/Buttons/UIButton.vue";
import UISwitch from "@/components/FormComponents/UISwitch.vue"
import UIAlert from "@/components/UIAlert.vue";
import UIModal from "@/components/UIModal.vue";

export default {
  components: {
    UIButton, UISwitch, UIAlert, UIModal,
  },
  data() {
    return {
      ganttId: "__ganttEditor__",
      ganttHelper: undefined,
      ganttMessage: "",
      pickedBar: undefined,
      tasks: undefined,
      changed: false,
      isModalOpened: false,
      ganttStyle: [
        {id: 0, title: "День"},
        {id: 1, title: "Неделя"},
        {id: 2, title: "Месяц"},
      ],
      isAlertOpened: false,
      messageToAlert: {
        buttons: [],
        title: "",
        text: "",
      },
    };
  },
  props: {
    tasksProp: {
      required: true,
      type: Array,
    },
  },
  methods: {
    onMounted() {
      this.tasks = JSON.parse(JSON.stringify(this.tasksProp))
      this.ganttHelper = new GanttHelper({
        on_click: this.selectBar,
        on_date_change: this.dateChange,
        on_progress_change: this.progressChange,
      })

      if (!this.tasks || this.tasks?.length == 0) {
        this.ganttMessage =
          "Вы еще не добавили ни одной задачи. Нажмите + чтобы создать задачу";
        this.$refs.gantEditorQuestionButton.classList.add("active")
        return;
      }

      try {
        this.ganttHelper.createDiagram("#" + this.ganttId, this.tasks);
      } catch (error) {
        switch (error.message) {
          case "Cannot read properties of undefined (reading 'map')":
            this.ganttMessage =
              "Вы еще не добавили ни одной задачи. Нажмите + чтобы создать задачу";
        }
      }

      for (let t of this.tasks) {
        console.log(t)
        t.active = false
      }
    },

    addTask() {
      let start, end;
      if (!this.tasks || this.tasks?.length == 0) {
        const dateNow = new Date();
        const dateToday = new Date(dateNow.setDate(dateNow.getDate() + 1))
        start = dateToday.toISOString().split("T")[0];

        const dateInAWeek = new Date(dateNow.setDate(dateNow.getDate() + 7))
        end = dateInAWeek.toISOString().split("T")[0];

        const task = {
          id: String(this.generatedTaskId),
          name: "Название",
          start: start,
          end: end,
          progress: 0,
        };

        this.tasks.push(task)
        this.ganttHelper.createDiagram("#" + this.ganttId, this.tasks)
      } else {
        const lastTask = this.tasks[this.tasks.length - 1]
          start = lastTask.start
          end = lastTask.end

          const task = {
          id: String(this.generatedTaskId),
          name: "Название",
          start: start,
          end: end,
          progress: 0,
        };

        this.tasks.push(task)
        this.ganttHelper.refresh([...this.tasks])
      }

      this.changed = true
      this.ganttMessage = ""
    },

    selectBar(task) {
      console.log("SELECTED", task)
    },

    dateChange(task, start, end) {
      let taskInList = this.tasks.find(e => e.id == task.id)

      taskInList.start = new Date(Date.parse(start) + 86400000).toISOString().split("T")[0]
      taskInList.end = new Date(Date.parse(end)).toISOString().split("T")[0]

      console.log(this.tasks, Date.parse(start) + 1, end)
    },

    progressChange(task, progress) {
      let taskInList = this.tasks.find(e => e.id == task.id)
      taskInList.progress = progress
    },

    removeTask(taskId) {
      let index = this.tasks.findIndex(e => e.id == taskId)
      this.tasks.splice(index, 1)
      this.changed = true
      if (this.tasks?.length == 0) {
        console.log("ZERO")
        this.ganttMessage =
          "Вы еще не добавили ни одной задачи. Нажмите + чтобы создать задачу";
        this.ganttHelper.removeDiagram("#" + this.ganttId)
      } else {
        this.ganttHelper.refresh([...this.tasks])
      }
    },

    openTask(task) {
      task.active = true
    },

    closeTask(task) {
      task.active = false
    },

    onInputCompleted(event) {
      if (event.key == "Enter") {
        console.log(event)
        event.target.blur()
        this.ganttHelper.refresh([...this.tasks])
      }
    },

    changeGanttMode(modeId) {
      let mode;
      switch (modeId) {
        case 0:
          mode = "Day"
          break
        case 1:
          mode = "Week"
          break
        case 2:
          mode = "Month"
      }
      this.ganttHelper.changeViewMode(mode)
    },

    callAlert(title, text, buttons) {
      this.isAlertOpened = true
      this.messageToAlert.title = title
      this.messageToAlert.text = text
      this.messageToAlert.buttons = buttons
    },

    hasChanges() {
      if (this.tasks.length != this.tasksProp.length) return true
      for (let i in this.tasks) {
        if (this.tasks[i].start != this.tasksProp[i].start || this.tasks[i].end != this.tasksProp[i].end) return true
      }
      return false
    },

    beforeCommitChanges() {
      this.callAlert(
        "Сохранить изменения?",
        "После сохранения задач, заказчику будет обправлено согласование, которое содержит в себе сохраненный вами график. Вненсенные изменения применятся после их одобрения заказчиком",
        [
          {label: "Отмена", style: "secondary", callback: () => { this.isAlertOpened = false }},
          {label: "Сохранить изменения", style: "primary", callback: () => { this.emitChanges() }}
        ],
      )
    },

    commitChanges() {
      if (this.hasChanges() || this.changed) {
        this.beforeCommitChanges()
      } else {
        this.$emit("commit", {
          taskList: toRaw(this.tasks),
          changed: false,
        })
      }
    },

    emitChanges() {
      this.$emit("commit", {
        taskList: toRaw(this.tasks),
        changed: true,
      })
    },

    openInstruction() {
      this.isModalOpened = true
    }
  },
  mounted() {
    this.onMounted();
  },
  computed: {
    generatedTaskId() {
      let max = 0;
      for (let task of this.tasks) {
        if (Number(task.id) > max) max = Number(task.id)
      }
      return max + 1
    },
  },
};
</script>
