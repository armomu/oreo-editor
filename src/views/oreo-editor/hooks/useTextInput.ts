// import type { Ref } from 'vue';
import { beaseDom, VirtualDomType } from './enumTypes';
import type { OreoEvent } from './enumTypes';
import { cloneDeep } from 'lodash';

export const useTextInput = (oreoEvent: OreoEvent) => {
    const onTextBlur = (e: Event) => {
        if (!oreoEvent.curDom.value) return;
        oreoEvent.curDom.value.input = false;
        oreoEvent.curDom.value.locked = false;
        console.log(e);
        oreoEvent.onMouseMode('boxSelect');
    };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    let onEnteState = false;

    const onTextInput = (e: Event) => {
        if (oreoEvent.curDom.value && oreoEvent.mouseMode.text && !onEnteState) {
            // @ts-ignore
            context.font = window.getComputedStyle(e.target).getPropertyValue('font');
            const texts = (oreoEvent.curDom.value.label || '').split('\n');
            let maxWidth = 0;
            texts.forEach((text) => {
                const textWidth = context.measureText(text).width;
                maxWidth = Math.max(maxWidth, textWidth);
            });
            if (oreoEvent.curDom.value.fontStyle?.fontSize) {
                oreoEvent.curDom.value.styles.width =
                    maxWidth + oreoEvent.curDom.value.fontStyle.fontSize || 0;
            }
        }
    };

    const onTextEnter = () => {
        onEnteState = true;
        if (oreoEvent.curDom.value && oreoEvent.curDom.value.fontStyle) {
            oreoEvent.curDom.value.styles.height =
                oreoEvent.curDom.value.styles.height +
                oreoEvent.curDom.value.fontStyle.fontSize +
                oreoEvent.curDom.value.fontStyle.fontSize * 0.3;
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
        console.log(is, className, id, '==draggableTextClick');
        if (
            is &&
            oreoEvent.curDom.value &&
            className.includes('draggable') &&
            id === oreoEvent.curDom.value.id
        ) {
            // 判定双击
            pointerDownCount++;
            if (pointerDownCount === 1) {
                pointerDownTimer = setTimeout(() => {
                    pointerDownCount = 0;
                }, 250);
            }
            if (
                pointerDownCount === 2 &&
                oreoEvent.curDom.value &&
                oreoEvent.curDom.value.type === VirtualDomType.Text
            ) {
                pointerDownCount = 0;
                pointerDownTimer && clearTimeout(pointerDownTimer);
                oreoEvent.curDom.value.input = true;
                console.log(oreoEvent.curDom.value, '双击');
            }
        }
    };
    const textWorkEventDown = (isText: boolean, className: string, e: PointerEvent) => {
        if (!isText) return;
        e.preventDefault();
        if (
            oreoEvent.curDom.value &&
            oreoEvent.curDom.value.input &&
            className.includes('textarea') &&
            oreoEvent.curDom.value.type === VirtualDomType.Text
        ) {
            try {
                // @ts-ignore
                e.target?.focus();
            } catch (err) {}

            console.log('正在添加文字中，请继续编辑！');
            return;
        }
        if (
            oreoEvent.curDom.value &&
            oreoEvent.curDom.value.input &&
            className.includes('work-area')
        ) {
            oreoEvent.curDom.value.input = false;
            oreoEvent.onMouseMode('boxSelect');
            return;
        }
        const info = oreoEvent.getRectClientBounds();
        const newDom = cloneDeep(beaseDom[2]);
        newDom.active = false;
        newDom.styles.width = 80;
        newDom.styles.height = 14;
        newDom.styles.left = info.left;
        newDom.styles.top = info.top;

        newDom.input = true;
        newDom.label = '双击编辑文字';
        newDom.id = new Date().getTime();

        oreoEvent.curDom.value = newDom;
        oreoEvent.appDom.value.push(oreoEvent.curDom.value);
        console.log('添加了新的文字对象');
        console.log(oreoEvent.curDom.value);
    };

    // const textWorkEventDown = (e: PointerEvent) => {}
    // const textWorkEventMove = (e: PointerEvent) => {}
    // const textWorkEventUp = () => {}

    return {
        onTextIconClick,
        draggableTextClick,
        textWorkEventDown,
        onTextBlur,
        onTextInput,
        onTextEnter,
    };
};
