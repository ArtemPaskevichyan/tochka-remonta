<template>
    <div class="authorizationHolder messagePageBlock">
        <div class="registration__titleBlock">
            <div class="titleText">{{ title }}</div>
        </div>

        <div class="messagePageBlock__textHolder">
            <div class="baseText">{{ text }}</div>
        </div> 
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        props: ["title", "text",]
    }
</script>

<style>

</style>