<template>
    <div class="roleSelectItem" >
        <div class="roleSelectItem__header">
            <div class="roleSelectItem__title">
                <slot name="title"></slot>
            </div>
            <div class="roleSelectItem__checkmark">
                <i class="icon-checkmark inline-icon"></i>
            </div>
        </div>
        <div class="roleSelectItem__body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

