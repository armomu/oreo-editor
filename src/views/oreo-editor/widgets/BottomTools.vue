<template>
    <input
        :ref="props.imageFileRef"
        hidden
        accept="image/*"
        type="file"
        @change="imageFileChange"
    />

    <a-select size="small" v-model="_scale" class="scale-select">
        <a-option :value="0.25">25%</a-option>
        <a-option :value="0.5">50%</a-option>
        <a-option :value="0.75">75%</a-option>
        <a-option :value="1">100%</a-option>
        <a-option :value="1.25">125%</a-option>
        <a-option :value="1.5">150%</a-option>
        <a-option :value="1.75">175%</a-option>
        <a-option :value="2">200%</a-option>
    </a-select>
    <div class="bottom-tools">
        <v-btn
            variant="text"
            icon="mdi-navigation-outline"
            size="x-small"
            style="transform: rotate(-35deg)"
            :color="props.data.boxSelect ? 'primary' : undefined"
            @click="onClick('arrow')"
        />
        <v-btn
            variant="text"
            icon="mdi-card-outline"
            size="x-small"
            :color="props.data.draRact ? 'primary' : undefined"
            @click="onClick('dra-ract')"
        />
        <v-btn
            variant="text"
            icon="mdi-format-color-text"
            size="x-small"
            :color="props.data.text ? 'primary' : undefined"
            @click="onClick('text')"
        />
        <v-btn
            variant="text"
            icon="mdi-image-outline"
            size="x-small"
            :color="props.data.image ? 'primary' : undefined"
            @click="onClick('image')"
        />
        <v-btn variant="text" icon="mdi-emoticon-outline" size="x-small" @click="onClick('icon')" />
        <v-btn
            variant="text"
            icon="mdi-hand-back-left-outline"
            size="x-small"
            :color="props.data.hand ? 'primary' : undefined"
            @click="onClick('hand')"
        />
        <v-btn variant="text" icon="mdi-code-json" size="x-small" @click="onClick('json')" />
        <!-- <v-btn variant="text" icon="mdi-reply" size="x-small" />
                <v-btn variant="text" icon="mdi-share" size="x-small" />
                <v-btn variant="text" icon="mdi-check-bold" size="x-small" /> -->
    </div>
</template>
<script lang="ts" setup>
import { computed, type Ref } from 'vue';
import type { MouseMode } from '../hooks/enumTypes';

const emit = defineEmits([
    'arrow',
    'dra-ract',
    'text',
    'hand',
    'image',
    'icon',
    'json',
    'image-file-change',
    'update:scale',
]);

const props = withDefaults(
    defineProps<{
        imageFileRef: any;
        data: MouseMode;
        scale: number;
    }>(),
    {}
);
const _scale = computed({
    get() {
        return props.scale;
    },
    set(val: number) {
        emit('update:scale', val);
    },
});
const onClick = (name: 'arrow' | 'dra-ract' | 'text' | 'hand' | 'image' | 'icon' | 'json') => {
    emit(name);
};
const imageFileChange = (e: any) => {
    emit('image-file-change', e);
};
</script>
