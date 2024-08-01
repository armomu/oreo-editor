import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { VirtualDomType } from './enumTypes';
import type { OreoEvent, VirtualDom } from './enumTypes';
export const useMouseMenu = (oreoEvent: OreoEvent) => {
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
        menuState.value.left = e.clientX;
        menuState.value.top = e.clientY;
        menuState.value.visible = true;
        if (!oreoEvent.curDom.value) {
            oreoEvent.curDom.value = item;
            oreoEvent.curDom.value.active = true;
        }
        if (oreoEvent.curDom.value && oreoEvent.curDom.value.id !== item.id) {
            oreoEvent.curDom.value = item;
            oreoEvent.curDom.value.active = true;
        } else {
            oreoEvent.curDom.value && (oreoEvent.curDom.value.active = true);
        }
        // document.body.addEventListener('click', hideMenu);
        // setTimeout(() => {
        //     // document.body.removeEventListener('click', hideMenu);
        // }, 50);
        // console.log('openMenu====', e);
        // oreoEvent.curDom.value = item;
        // oreoEvent.curDom.value.active = true;
    };

    const onMenuVisible = () => {
        if (!oreoEvent.curDom.value) return;
        if (oreoEvent.curDom.value && oreoEvent.curDom.value.locked) return;
        oreoEvent.curDom.value.visible = !oreoEvent.curDom.value.visible;
    };

    const delItem = (dom: VirtualDom) => {
        const index = oreoEvent.appDom.value.findIndex((obj) => obj.id === dom.id);
        if (index < 0) return;
        oreoEvent.appDom.value.splice(index, 1);
    };
    const onMenuDelete = () => {
        if (oreoEvent.curDom.value && oreoEvent.curDom.value.type === VirtualDomType.Group) {
            const g: VirtualDom[] = [];
            for (let i = 0; i < oreoEvent.appDom.value.length; i++) {
                if (oreoEvent.appDom.value[i].groupId === oreoEvent.curDom.value.id) {
                    g.push(oreoEvent.appDom.value[i]);
                }
            }
            g.forEach((item) => {
                delItem(item);
            });
        }
        oreoEvent.curDom.value && delItem(oreoEvent.curDom.value);
        // const index = oreoEvent.appDom.value.findIndex((obj) => obj.id === oreoEvent.curDom.value.id);
        // if (index < 0) return;
        // oreoEvent.appDom.value.splice(index, 1);
        // TODO DEL Group
    };
    const onMenuLocked = () => {
        if (!oreoEvent.curDom.value) return;
        oreoEvent.curDom.value.locked = !oreoEvent.curDom.value.locked;
    };
    const onMenuGroup = () => {
        const vg = oreoEvent.appDom.value.find((item) => item.type === VirtualDomType.VirtualGroup);
        // 取消选中
        for (let i = 0; i < oreoEvent.appDom.value.length; i++) {
            if (vg && oreoEvent.appDom.value[i].groupId === vg.id) {
                oreoEvent.appDom.value[i].selected = false;
            }
        }
        const res = oreoEvent.getBoundsInfo();
        if (vg) {
            vg.name = 'Group';
            vg.type = VirtualDomType.Group;
            vg.selected = true;
            vg.styles.width = res.width;
            vg.styles.height = res.height;
        }
    };
    const onMenuDisbandGroup = () => {
        if (oreoEvent.curDom.value && oreoEvent.curDom.value.type === VirtualDomType.Group) {
            for (let i = 0; i < oreoEvent.appDom.value.length; i++) {
                if (oreoEvent.appDom.value[i].groupId === oreoEvent.curDom.value.id) {
                    oreoEvent.appDom.value[i].groupId = 0;
                }
            }
            onMenuDelete();
        }
    };

    function onKeydown(event: KeyboardEvent) {
        if (!oreoEvent.curDom.value) return;
        if (oreoEvent.curDom.value.input) return;
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
