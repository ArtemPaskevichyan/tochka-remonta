<template>
    <div class="headerPage tabBarPage">
        <UITabBar :page="'Профиль'"/>
        <UIHeader/>
        <div class="titleText pageTitle">Подтверждение номера телефона</div>
        <div class="backgroundCard submitPhonePage">
            <div class="submitPhonePage__content">
                <div class="submitPhonePage__inputBlock">
                    <UIInput v-model:value="number" :title="'Номер телефона'" :placeholder="'+7 (xxx) xxx xx-xx'"/>
                    <UIButton @click="call" :style="numberButtonStyle">Позвонить</UIButton>
                </div>
                <div class="submitPhonePage__text baseText">
                    На этот телефон поступит звонок. Нет необходимости на него отвечать. Введите последние 4 цифры номера, позвонившего вам
                </div>
                <div class="submitPhonePage__inputBlock">
                    <UIInput v-model:value="code" :title="'Последние 4 цифры позвонившего вам номера'" :placeholder="'xxxx'"/>
                    <UIButton @click="submit" :style="submitButtonStyle">Подтвердить</UIButton>
                </div>
            </div>
        </div>
    </div>
    <UILoadingWall v-if="isLoading"/>
</template>

<script>
import UITabBar from '@/components/UITabBar.vue'
import UIInput from '@/components/FormComponents/UIInput.vue'
import UIHeader from '@/components/Header/UIHeader.vue'
import UIButton from '@/components/Buttons/UIButton.vue'
import {SettingsPageController} from '@/user/pages/settingsPage/helpers/settingsPageController.js'
import {ERROR_CODES} from '@/helpers/ErrorMaker.js'
import UILoadingWall from '@/components/UILoadingWall.vue'


export default {
    components: {
        UIInput, UIHeader, UIButton, UILoadingWall, UITabBar,
    },
    data() {
        return {
            number: '',
            code: '',
            numberButtonStyle: 'disabled',
            submitButtonStyle: 'disabled',
            onSubmitting: false,
            viewModel: new SettingsPageController(),
            numberError: false,
            isLoading: false,
        }
    },
    methods: {
        async call() {
            if (this.numberButtonStyle == 'disabled') { return }

            try {
                this.isLoading = true
                await this.viewModel.callAPhone(this.number)
                this.onSubmitting = true
            } catch(e) {
                switch (e.code) {
                    case ERROR_CODES.PSVNumberFailed:
                        this.numberError = true
                        break;
                    default:
                        alert(e)
                }
            } finally {
                this.isLoading = false
            }
        },
        async submit() {
            if (!this.onSubmitting) { return }
            try {
                this.isLoading = true
                await this.viewModel.submitAPhone(this.code)
                this.onSubmitting = false
                this.$router.push('/user/successNumberSubmition')
            } catch(e) {
                console.log("Error on phone submition", e)
                alert(e.message)
            } finally {
                this.isLoading = false
            }
            
        }
    },
    watch: {
        number: function() {
            this.numberError = false
            this.numberButtonStyle = this.viewModel.validatePhone(this.number) ? 'default' : 'disabled'
        },
        code: function() {
            this.submitButtonStyle = (/[0-9]{4}/.test(this.code) && this.code.length == 4 && this.onSubmitting) ? 'default' : 'disabled'
        }
    }
}
</script>

<style>

</style>