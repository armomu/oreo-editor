import { type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom, type OreoEvent, type VirtualDom } from './enumTypes';

export const useRect = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    const rectWorkEventDown = (is: boolean, adding: Ref<boolean>, e: PointerEvent) => {
        if (!is) return;
        e.preventDefault();
        const newDom = cloneDeep(beaseDom[0]);
        newDom.visible = false;
        newDom.active = false;
        newDom.selected = true;
        newDom.styles.width = 0;
        newDom.styles.height = 0;
        newDom.styles.left = e.layerX + 0;
        newDom.styles.top = e.layerY + 0;
        newDom.id = new Date().getTime();
        curDom.value = newDom;
        appDom.value.push(newDom);
        adding.value = true;
    };
    const rectWorkEventMove = (is: boolean, layerX: number, layerY: number, e: PointerEvent) => {
        if (!is || !curDom.value) return;
        e.preventDefault();
        curDom.value.visible = true;

        curDom.value.styles.width = Math.abs(e.layerX - layerX);
        curDom.value.styles.height = Math.abs(e.layerY - layerY);
        if (e.layerX < layerX) {
            curDom.value.styles.left = e.layerX + 0;
        }
        if (e.layerY < layerY) {
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
