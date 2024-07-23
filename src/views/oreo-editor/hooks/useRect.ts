import { type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom, type OreoEvent } from './enumTypes';

export const useRect = (oreoEvent: OreoEvent) => {
    const rectWorkEventDown = (is: boolean, e: PointerEvent) => {
        if (!is) return;
        e.preventDefault();
        const info = oreoEvent.getPointerWrapBoundsInfo();
        const newDom = cloneDeep(beaseDom[0]);
        newDom.active = false;
        newDom.selected = true;
        newDom.locked = false;
        newDom.styles.width = 0;
        newDom.styles.height = 0;
        newDom.styles.left = info.left;
        newDom.styles.top = info.top;
        newDom.id = new Date().getTime();
        oreoEvent.curDom.value = newDom;
        oreoEvent.appDom.value.push(newDom);
    };
    const rectWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !oreoEvent.curDom.value) return;
        e.preventDefault();
        oreoEvent.curDom.value.visible = true;
        const info = oreoEvent.getPointerWrapBoundsInfo();
        oreoEvent.curDom.value.styles.width = info.width;
        oreoEvent.curDom.value.styles.height = info.height;
        oreoEvent.curDom.value.styles.top = info.top - 2020;
        oreoEvent.curDom.value.styles.left = info.left - 2020;
    };
    const rectWorkEventUp = () => {
        oreoEvent.onMouseMode('boxSelect');
    };

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
