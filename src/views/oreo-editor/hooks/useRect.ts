import { type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom, type OreoEvent, type VirtualDom } from './enumTypes';

export const useRect = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    let divRectScrollTop = 0;
    let divRectLeft = 0;
    let clientX = 0;
    let clientY = 0;
    // const clientEndX = 0;
    // const clientEndY = 0;

    const rectWorkEventDown = (is: boolean, e: PointerEvent) => {
        if (!is) return;
        e.preventDefault();
        // @ts-ignore
        const divRect = e.target.getBoundingClientRect() as DOMRect;
        // @ts-ignore
        divRectScrollTop = e.target.scrollTop;
        // @ts-ignore
        divRectLeft = divRect.left - e.target.scrollLeft;
        clientX = e.clientX - divRectLeft - 100;
        clientY = e.clientY - divRectScrollTop - 100;

        const newDom = cloneDeep(beaseDom[0]);
        newDom.active = false;
        newDom.selected = true;
        newDom.locked = false;
        newDom.styles.width = 0;
        newDom.styles.height = 0;

        newDom.styles.left = clientX;
        newDom.styles.top = clientY;

        newDom.id = new Date().getTime();
        curDom.value = newDom;
        appDom.value.push(newDom);
    };
    const rectWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !curDom.value) return;
        e.preventDefault();
        curDom.value.visible = true;

        e.clientX - divRectLeft;
        curDom.value.styles.width = Math.abs(e.clientX - divRectLeft - 100 - clientX);
        curDom.value.styles.height = Math.abs(e.clientY - divRectScrollTop - 100 - clientY);
        // if (e.layerX < startX) {
        //     curDom.value.styles.left = e.layerX + 0;
        // }
        // if (e.layerY < startY) {
        //     curDom.value.styles.top = e.layerY + 0;
        // }
    };
    const rectWorkEventUp = () => {};

    const onBottomToolsDraRact = () => {
        oreoEvent.cancelActived();
        oreoEvent.onMouseMode('draRact');
    };

    return {
        rectWorkEventDown,
        rectWorkEventMove,
        rectWorkEventUp,
        onBottomToolsDraRact,
    };
};
