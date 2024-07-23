import { h, ref, type Ref } from 'vue';
import { type OreoEvent, type VirtualDom } from './enumTypes';

export const useDragWidget = (oreoEvent: OreoEvent) => {
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

        // @ts-ignore
        const divRect = e.target.getBoundingClientRect() as DOMRect;
        oreoEvent.cancelActived();
        const { width, height } = dragingDom.styles;
        // @ts-ignore
        dragingDom.styles.top = e.clientY + e.target.scrollTop - 100 - height / 2;
        // @ts-ignore
        dragingDom.styles.left = e.clientX + e.target.scrollLeft - divRect.left - 100 - width / 2;
        dragingDom.id = new Date().getTime();
        oreoEvent.curDom.value = dragingDom;
        oreoEvent.appDom.value.push(oreoEvent.curDom.value);
    };

    return {
        onDraging,
        onDragover,
        onDrop,
    };
};
