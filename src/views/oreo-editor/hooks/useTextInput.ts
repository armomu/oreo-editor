import type { Ref } from 'vue';
import { beaseDom, VirtualDomType, type VirtualDom } from './enumTypes';
import type { OreoEvent } from './enumTypes';
import { cloneDeep } from 'lodash';

export const useTextInput = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    const onBlur = (e: Event) => {
        if (!curDom.value) return;
        curDom.value.input = false;
        curDom.value.locked = false;
        console.log(e);
        oreoEvent.onMouseMode('boxSelect');
    };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    let onEnteState = false;
    const onInput = (e: Event) => {
        if (curDom.value && oreoEvent.mouseMode.text && !onEnteState) {
            // @ts-ignore
            context.font = window.getComputedStyle(e.target).getPropertyValue('font');
            const texts = (curDom.value.label || '').split('\n');
            let maxWidth = 0;
            texts.forEach((text) => {
                const textWidth = context.measureText(text).width;
                maxWidth = Math.max(maxWidth, textWidth);
            });
            // @ts-ignore
            curDom.value.styles.width = maxWidth + curDom.value.fontStyle?.fontSize || 0;
        }
    };
    const onEnter = () => {
        onEnteState = true;
        if (curDom.value && curDom.value.fontStyle) {
            curDom.value.styles.height =
                curDom.value.styles.height +
                curDom.value.fontStyle.fontSize +
                curDom.value.fontStyle.fontSize * 0.3;
        }
    };

    const onTextIconClick = () => {
        oreoEvent.onMouseMode('text');
    };

    let pointerDownCount = 0;
    // @ts-ignore
    // eslint-disable-next-line no-undef
    let pointerDownTimer: NodeJS.Timeout | null = null;
    const draggableTextClick = (is: boolean, className: string, id: number) => {
        if (
            is &&
            curDom.value &&
            className.includes('draggable') &&
            id === curDom.value.id &&
            curDom.value.type === VirtualDomType.Text
        ) {
            // 判定双击
            pointerDownCount++;
            if (pointerDownCount === 1) {
                pointerDownTimer = setTimeout(() => {
                    pointerDownCount = 0;
                }, 250);
            }
            if (pointerDownCount === 2) {
                pointerDownCount = 0;
                pointerDownTimer && clearTimeout(pointerDownTimer);
                curDom.value.input = true;
            }
        }
    };
    const textWorkEventDown = (isText: boolean, className: string, e: PointerEvent) => {
        if (!isText) return;
        e.preventDefault();
        if (curDom.value && curDom.value.input && className.includes('textarea')) {
            console.log('正在添加文字中，请继续编辑！');
            return;
        }
        if (curDom.value && curDom.value.input && className.includes('work_content')) {
            curDom.value.input = false;
            return;
        }
        const newDom = cloneDeep(beaseDom[2]);
        newDom.active = false;
        newDom.styles.width = 80;
        newDom.styles.height = 14;
        newDom.styles.left = e.layerX + 0;
        newDom.styles.top = e.layerY + 0;

        newDom.input = true;
        newDom.label = '双击编辑文字';
        newDom.id = new Date().getTime();
        curDom.value = newDom;
        appDom.value.push(curDom.value);
        console.log('添加了新的文字对象');
        console.log(curDom.value);
    };

    // const textWorkEventDown = (e: PointerEvent) => {}
    // const textWorkEventMove = (e: PointerEvent) => {}
    // const textWorkEventUp = () => {}

    return {
        onTextIconClick,
        draggableTextClick,
        textWorkEventDown,
        onBlur,
        onInput,
        onEnter,
    };
};
