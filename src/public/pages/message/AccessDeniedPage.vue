<template>
  <div class="authorizationHolder">
    <div class="authorizationHolder__content">
        <div class="notFoundPage__giantTitle">
            502
        </div>
        <div class="caption notFoundPage__text">
            Похоже, что вы пытаетесь перейти на страницу, к которой у вас нет доступа. Ваша роль на сервисе не позваляет вам попасть сюда.<br><br>Если вам необходимо открыть эту страницу, создайте новый аккаунт, выбрав другую роль при регистрации. 
        </div>
        <div class="login__links">
            <UILink :link="'/registration'">Регистрация</UILink>
        </div>
    </div>
  </div>
</template>

<script>
import UILink from '@/components/FormComponents/UILink.vue'

export default {
  components: {
      UILink,
  },
  data() {
      return {}
  },
}
</script>

