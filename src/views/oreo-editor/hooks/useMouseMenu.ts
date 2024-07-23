import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { VirtualDomType } from './enumTypes';
import type { OreoEvent, VirtualDom } from './enumTypes';
export const useMouseMenu = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    const menuState = ref({
        visible: false,
        top: 0,
        left: 0,
    });

    const hideMenu = () => {
        menuState.value.visible = false;
    };
    const openMenu = (e: PointerEvent, item: VirtualDom) => {
        e.preventDefault();
        menuState.value.left = e.layerX;
        menuState.value.top = e.layerY;
        menuState.value.visible = true;
        // document.body.addEventListener('click', hideMenu);
        // setTimeout(() => {
        //     // document.body.removeEventListener('click', hideMenu);
        // }, 50);
        console.log('openMenu====', e);
        curDom.value = item;
        curDom.value.active = true;
    };

    const onMenuVisible = () => {
        if (!curDom.value) return;
        if (curDom.value && curDom.value.locked) return;
        curDom.value.visible = !curDom.value.visible;
    };

    const delItem = (dom: VirtualDom) => {
        const index = appDom.value.findIndex((obj) => obj.id === dom.id);
        if (index < 0) return;
        appDom.value.splice(index, 1);
    };
    const onMenuDelete = () => {
        if (curDom.value && curDom.value.type === VirtualDomType.Group) {
            const g: VirtualDom[] = [];
            for (let i = 0; i < appDom.value.length; i++) {
                if (appDom.value[i].groupId === curDom.value.id) {
                    g.push(appDom.value[i]);
                }
            }
            g.forEach((item) => {
                delItem(item);
            });
        }
        curDom.value && delItem(curDom.value);
        // const index = appDom.value.findIndex((obj) => obj.id === curDom.value.id);
        // if (index < 0) return;
        // appDom.value.splice(index, 1);
        // TODO DEL Group
    };
    const onMenuLocked = () => {
        if (!curDom.value) return;
        curDom.value.locked = !curDom.value.locked;
    };
    const onMenuGroup = () => {
        const vg = appDom.value.find((item) => item.virtualGroup);
        // 取消选中
        for (let i = 0; i < appDom.value.length; i++) {
            if (vg && appDom.value[i].groupId === vg.id) {
                appDom.value[i].selected = false;
            }
        }
        oreoEvent.getBoundsInfo();
        if (vg) {
            vg.name = 'Group';
            vg.virtualGroup = false;
            vg.selected = true;
        }
    };
    const onMenuDisbandGroup = () => {
        if (curDom.value && curDom.value.type === VirtualDomType.Group) {
            for (let i = 0; i < appDom.value.length; i++) {
                if (appDom.value[i].groupId === curDom.value.id) {
                    appDom.value[i].groupId = 0;
                }
            }
            onMenuDelete();
        }
    };

    function onKeydown(event: KeyboardEvent) {
        if (!curDom.value) return;
        if (curDom.value.input) return;
        if (event.code === 'Backspace' || event.code === 'Delete') {
            onMenuDelete();
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', onKeydown);
        document.body.addEventListener('click', hideMenu);
    });
    onUnmounted(() => {
        document.removeEventListener('keydown', onKeydown);
        document.body.removeEventListener('click', hideMenu);
    });

    return {
        menuState,
        openMenu,
        meneActions: {
            onMenuVisible,
            onMenuDelete,
            onMenuLocked,
            onMenuGroup,
            onMenuDisbandGroup,
        },
    };
};

export interface MeneActions {
    onMenuVisible: () => void;
    onMenuDelete: () => void;
    onMenuLocked: () => void;
    onMenuGroup: () => void;
    onMenuDisbandGroup: () => void;
}