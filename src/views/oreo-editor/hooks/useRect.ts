import { type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom, type OreoEvent, type VirtualDom } from './enumTypes';

export const useRect = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    let startX = 0;
    let startY = 0;
    const rectWorkEventDown = (is: boolean, e: PointerEvent) => {
        if (!is) return;
        e.preventDefault();
        const newDom = cloneDeep(beaseDom[0]);
        newDom.visible = true;
        newDom.selected = true;
        newDom.styles.width = 0;
        newDom.styles.height = 0;
        startX = e.layerX + 0;
        startY = e.layerY + 0;
        newDom.styles.left = startX;
        newDom.styles.top = startY;
        newDom.id = new Date().getTime();
        curDom.value = newDom;
        appDom.value.push(newDom);
    };
    const rectWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !curDom.value) return;
        // e.preventDefault();
        curDom.value.visible = true;
        curDom.value.styles.width = Math.abs(e.layerX - startX);
        curDom.value.styles.height = Math.abs(e.layerY - startY);
        curDom.value.styles.top = startX + 0;
        curDom.value.styles.left = startY + 0;
        if (e.layerX < startX) {
            curDom.value.styles.left = e.layerX + 0;
        }
        if (e.layerY < startY) {
            curDom.value.styles.top = e.layerY + 0;
        }
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
