import Gantt from "frappe-gantt"

class GanttHelper {
  options = {
    header_height: 50,
    column_width: 50,
    step: 1,
    view_modes: ['Day', 'Week', 'Month'],
    bar_height: 20,
    bar_corner_radius: 5,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'YYYY-MM-DD',
    language: 'ru', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh', 'de', 'hu'
    custom_popup_html: null
  }
  gantt = undefined
  id = undefined

  createDiagram(id, tasks, options) {
    console.log("GANTT", id, tasks, options, Gantt.tasks)
    this.id = id
    this.gantt = new Gantt(id, tasks, options ?? this.options)
  }

  refresh(tasks) {
    console.log("GO REFRESH", tasks, this.gantt)
    // celarContainer()
    this.gantt.refresh(tasks)
    console.log("REFRESH END", tasks, this.gantt)
    // this.gantt = new Gantt(id, tasks, options ?? this.options)
  }

  changeViewMode(mode) {
    this.gantt.change_view_mode(mode)
  }

  removeDiagram() {
    const a = document.querySelector(".gantt-container")
    a.remove()
    console.log(a)
  }

  constructor(options) {
    if (options) {
      for (let i in options) {
        this.options[i] = options[i]
      }
    }
  }
}

export { GanttHelper }