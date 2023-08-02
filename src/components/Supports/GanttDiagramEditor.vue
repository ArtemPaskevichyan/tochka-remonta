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
                <UIButton :style="'destructive square'" @click="removeTask(task.id)"><i class="icon-trash"></i></UIButton>
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
      <UIButton :style="'primary'" @click="commitChanges">Сохранить</UIButton>
    </div>
  </div>
</template>

<script>
import { GanttHelper } from "@/helpers/GanttHelper";
import UIButton from "@/components/Buttons/UIButton.vue";
import UISwitch from "@/components/FormComponents/UISwitch.vue"

export default {
  components: {
    UIButton, UISwitch,
  },
  data() {
    return {
      ganttId: "__ganttEditor__",
      ganttHelper: undefined,
      ganttMessage: "",
      pickedBar: undefined,
      tasks: [],
      ganttStyle: [
        {id: 0, title: "День"},
        {id: 1, title: "Неделя"},
        {id: 2, title: "Месяц"},
      ],
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
      this.tasks = this.tasksProp
      this.ganttHelper = new GanttHelper({
        on_click: this.selectBar,
        on_date_change: this.dateChange,
        on_progress_change: this.progressChange,
      })

      if (!this.tasks || this.tasks?.length == 0) {
        this.ganttMessage =
          "Вы еще не добавили ни одной задачи. Нажмите + чтобы создать задачу";
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
        let dateNow = new Date();
        start = dateNow.toISOString().split("T")[0];

        let dateInAWeek = new Date(dateNow.setDate(dateNow.getDate() + 7))
        end = dateInAWeek.toISOString().split("T")[0];

        let task = {
          id: String(this.generatedTaskId),
          name: "Название",
          start: start,
          end: end,
          progress: 0,
        };

        this.tasks.push(task)
        this.ganttHelper.createDiagram("#" + this.ganttId, this.tasks)
      } else {
        let lastTask = this.tasks[this.tasks.length - 1]
          start = lastTask.start
          end = lastTask.end

          let task = {
          id: String(this.generatedTaskId),
          name: "Название",
          start: start,
          end: end,
          progress: 0,
        };

        this.tasks.push(task)
        this.ganttHelper.refresh([...this.tasks])
      }

      this.ganttMessage = ""
    },

    selectBar(task) {
      console.log("SELECTED", task)
    },

    dateChange(task, start, end) {
      let taskInList = this.tasks.find(e => e.id == task.id)

      taskInList.start = new Date(Date.parse(start)).toISOString().split("T")[0]
      taskInList.end = new Date(Date.parse(end)).toISOString().split("T")[0]
    },

    progressChange(task, progress) {
      let taskInList = this.tasks.find(e => e.id == task.id)
      taskInList.progress = progress
    },

    removeTask(taskId) {
      let index = this.tasks.findIndex(e => e.id == taskId)
      this.tasks.splice(index, 1)
      this.ganttHelper.refresh([...this.tasks])
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

    commitChanges() {
      this.emit("commit", this.tasks)
    },
  },
  mounted() {
    this.onMounted();
  },
  computed: {
    generatedTaskId() {
      return this.tasks?.length ?? 0;
    },
  },
};
</script>
