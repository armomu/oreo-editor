import { h, ref, type Ref } from 'vue';
import { type OreoPointerEvent, type VirtualDom } from './enumTypes';

export const useDragWidget = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    pointerEvent: OreoPointerEvent
) => {
    // 当前拖动中的节点
    let dragingDom: VirtualDom;
    //
    const onDraging = (e: VirtualDom) => {
        dragingDom = e;
    };

    const onDragover = (e: DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        if (!dragingDom) return;
        pointerEvent.cancelSelect();
        pointerEvent.deleteVirtualGroup();
        const { width, height } = dragingDom.styles;

        dragingDom.styles.top = e.offsetY - height / 2;
        dragingDom.styles.left = e.offsetX - width / 2;
        dragingDom.id = new Date().getTime();
        curDom.value = dragingDom;
        appDom.value.push(curDom.value);
    };

    return {
        onDraging,
        onDragover,
        onDrop,
    };
};