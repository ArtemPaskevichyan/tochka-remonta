<template>
  <header class="header" ref="header">
    <a class="header__logo">
      <img class="desktopOnly" src="@/assets/images/logo.png" alt="logo">
      <img class="mobileOnly" src="@/assets/images/shortLogo.png" alt="logo">
    </a>
    <div class="header__controls">
      <router-link class="header__controlsPrimaryButton header__controlButton" to="/login">
        Войти
      </router-link>
      <router-link class="header__controlsLightButton header__controlButton" to="/registration">
        Регистрация
      </router-link>
    </div>
  </header>
</template>

<style>
.header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header__controls {
  display: flex;
  flex-direction: row;
}

.header__controlButton {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  color: #401F00;
  cursor: pointer;
  text-decoration: none;
}

.header__controlsPrimaryButton {
  background-color: #FFE7C3;
  color: #401F00;
}
</style>