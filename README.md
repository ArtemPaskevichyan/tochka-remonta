# Ruremont
<br>
### Архитектура
<hr>
#### Структура
Проект разработан с применением VueJS 3, Vuex, Vue-Router, Axios. Архитектура проекта представляет собой особую структуру директорий. Проект делится на 4 основные раздела: "User", "Public", "Maker", "Admin". Эти разделы являются директориями со схожей структурой, например:
```
>Public 📁
-->pages 📁
---->registration 📁
------>helpers 📁
-------->RegistrationViewModel.js
------>RegistrationPage.vue
```
В главной директории раздела находится папка со страницами, принадлежащие этому разделу. В ней есть папка для конкретной страницы. Например, для страницы регистрации в *Public>Pages* есть директория *registration*, где хранится сама страница *.vue*, а также директория *helpers* со вспомогательными файлами для неё.
Переиспользуемые компоненты, требующиеся во всех 4 разделах, расположены в *src>components*

#### Архитектура приложения
Архитектура проекта представляет собой некое подобие архитектуры **MVC**, где *Model* и *View* расположены в .vue файле, а *Controller* - это .js файл в директории *helpers*. Бизнес-логика, насколько это вожможно, вынесена в *Controller*.

#### Стили
При разработке интерфейса использовался предпроцессор **SCSS**. В директории src расположена папка styles, где есть 3 основных файла стилей:
style.css - файл со стилями основных элементов, для ПК версии
styleMobile.css -  файл со стилями основных элементов, скорректированных под мобильные успройства
styleSkeleton.css - файл со стилями скелетов основных элементов


