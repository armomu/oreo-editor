<template>
    <template v-if="props.data.visible">
        <DragResizeBle
            :active="_active"
            :w="_width"
            :h="_height"
            :x="_left"
            :y="_top"
            :draggable="disableDrag"
            :resizable="disableResize"
            @activated="onActivated"
            @deactivated="onDeactivated"
            @resizestop="funStop"
            @dragstop="funStop"
            @dragging="onDragging"
            @resizing="onResizing"
            @refLineParams="getRefLineParams"
            :lockAspectRatio="lockAspectRatio"
            :style="styles"
            :class="classNames"
            :uid="props.data.id"
            :scaleRatio="$props.scale"
            :snap="snap"
            @contextmenu.prevent="onMouser"
        >
            <div v-if="props.data.label && !props.data.input" class="text">
                <p v-html="textColumn" class="p"></p>
            </div>
            <textarea
                v-if="props.data.input"
                class="textarea"
                v-model="_label"
                @blur="onBlur"
                @input="onInput"
                @keydown.enter="onEnter"
            ></textarea>
            <a-image
                v-if="props.data.url"
                :width="props.data.styles.width"
                :height="props.data.styles.height"
                :fit="props.data.styles.imgFit"
                :src="props.data?.url || undefined"
                style="z-index: -1"
            />
            <v-icon
                v-if="props.data.type === 6"
                :icon="props.data.icon"
                :size="props.data.styles.width"
            />
            <component v-if="props.data.component" :is="props.data.component" />
            <slot></slot>
        </DragResizeBle>
    </template>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { BoundsInfo, VirtualDom } from '../hooks/enumTypes';
import { VirtualDomType } from '../hooks/enumTypes';
// @ts-ignore
import DragResizeBle from '@/components/DragResizeble/index.vue';

const props = withDefaults(
    defineProps<{
        data: VirtualDom;
        active: boolean;
        width: number;
        height: number;
        top: number;
        left: number;
        disable?: boolean | null;
        label?: string;
        scale?: number;
    }>(),
    {
        disable: false,
        scale: 1,
    }
);

const emit = defineEmits([
    'update:active',
    'update:width',
    'update:height',
    'update:top',
    'update:left',
    'update:label',
    'stop',
    'resizing',
    'snapLine',
    'mouser',
    'dragging',
    'activated',
    'blur',
    'input',
    'enter',
]);

const _active = computed(() => props.active);
const _width = computed(() => props.width);
const _height = computed(() => props.height);
const _top = computed(() => props.top || 0);
const _left = computed(() => props.left || 0);
const _label = computed({
    get() {
        return props.label || '';
    },
    set(val: string) {
        emit('update:label', val);
    },
});

// const isDiv = computed(() => {
//     // 如果是文字输入也是div形式
//     if (props.data.input) return true;
//     if (props.data.disabled) return true;

//     // !!props.data.type 不是组合
//     // !!props.data.type 是组合
//     // return !!props.data.groupId && !props.data.type;
//     if (props.data.groupId) return true;
//     if (props.data.virtualGroup) return false;
//     return !!props.data.groupId && !!props.data.type;
// });
const snap = computed(() => {
    if (props.data.groupId) {
        return false;
    }
    return true;
});

const disableDrag = computed(() => {
    // 禁用宽高调整
    if (props.disable || props.data.input || props.data.locked || props.data.groupId) {
        return false;
    }
    return true;
});
const disableResize = computed(() => {
    // 禁用宽高调整
    if (
        props.disable ||
        props.data.groupId ||
        props.data.type === VirtualDomType.Group ||
        props.data.virtualGroup
    ) {
        return false;
    }
    return true;
});

const lockAspectRatio = computed(() => {
    const arr = [VirtualDomType.Circle, VirtualDomType.Icon];
    return arr.includes(props.data.type);
});

const funStop = (e: BoundsInfo) => {
    emit('update:width', e.width);
    emit('update:height', e.height);
    emit('update:top', e.top);
    emit('update:left', e.left);
    emit('stop', e);
};

const getRefLineParams = (params: any) => {
    const { vLine, hLine } = params;
    let id = 0;
    const vs = vLine.map((item: any) => {
        item['id'] = ++id;
        return item;
    });
    const hl = hLine.map((item: any) => {
        item['id'] = ++id;
        return item;
    });
    emit('snapLine', [vs || [], hl || []]);
};

let __timer: any = null;
const onActivated = () => {
    if (__timer) return;
    emit('update:active', true);
    emit('activated', props.data);
    __timer = setTimeout(() => {
        clearTimeout(__timer);
        __timer = null;
    }, 50);
};
const onDeactivated = () => {
    emit('update:active', false);
};
const onDragging = (left_: number, top_: number, f: object) => {
    emit('update:top', top_);
    emit('update:left', left_);
    emit('dragging', f, props.data);
};
const onResizing = (left: number, top: number, width: number, height: number) => {
    emit('update:width', width);
    emit('update:height', height);
    emit('resizing', { left, top, width, height });
};

const onBlur = () => {
    emit('blur');
};
const onInput = (e: Event) => {
    emit('input', e);
};
const onEnter = (e: Event) => {
    emit('enter', e);
};

const styles = computed(() => {
    let background = 'none';
    if (props.data.styles.fill) {
        background = props.data.styles.background;
    }
    let border = 'none';
    if (props.data.styles.border) {
        border =
            props.data.styles.borderWidth +
            'px ' +
            props.data.styles.borderStyle +
            ' ' +
            props.data.styles.borderColor;
    }
    let boxShadow = 'none';
    if (props.data.styles.shadow) {
        boxShadow = `${props.data.styles.shadowX} ${props.data.styles.shadowY}px ${props.data.styles.shadowBlur}px ${props.data.styles.shadowSpread}px ${props.data.styles.shadowColor}`;
    }
    let zIndex: any = '';
    if (props.data.active || props.data.input) {
        zIndex = 1;
    }

    // 字体样式
    let fontStyle: any = {};
    if (props.data.fontStyle) {
        fontStyle = {
            ...props.data.fontStyle,
        };
        fontStyle.fontSize = props.data.fontStyle.fontSize + 'px';
        fontStyle.lineHeight = '1';
        // fontStyle.lineHeight = props.data.fontStyle.lineHeight + 'px';
        if (props.data.fontStyle.shadow) {
            fontStyle.textShadow = `${props.data.fontStyle.shadowX}px ${props.data.fontStyle.shadowY}px ${props.data.fontStyle.shadowBlur}px ${props.data.fontStyle.shadowColor}`;
        }
        // console.log(fontStyle, 'fontStyle');
    }
    // const div: any = {};
    // if (isDiv.value) {
    //     div.width = props.data.styles.width + 'px';
    //     div.height = props.data.styles.height + 'px';
    //     div.transform = `translate(${props.data.styles.left}px, ${props.data.styles.top}px)`;
    // }

    return {
        borderRadius: `${props.data.styles.radius}px`,
        background,
        border,
        opacity: props.data.styles.opacity,
        boxShadow,
        zIndex,
        // ...div,
        ...fontStyle,
    };
});
const classNames = computed(() => {
    return [
        props.data.selected ? 'selected' : '',
        props.data.virtualGroup ? 'virtualGroup' : '',
        props.data.type === 0 ? 'group' : '',
        props.data.input ? 'input' : '',
    ];
});

const textColumn = computed(() => {
    // const textArray = (props.data.label || '').split('\n');
    // const originalString = 'apple, orange, banana, apple';
    const html = (props.data.label || '').replace(/\n/g, '<br>');
    // html = html.replace(/\u0020/g, '\u3000');
    // console.log(props.data.label);
    return html;
});

// 右键
const onMouser = (e: PointerEvent) => {
    emit('mouser', e, props.data);
};
</script>
