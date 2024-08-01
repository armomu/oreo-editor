import { computed, reactive } from 'vue';

import materialIcons from './icon';
import { cloneDeep } from 'lodash';
import { VirtualDomType, beaseDom, type OreoEvent } from './enumTypes';

export const useIcon = (oreoEvent: OreoEvent) => {
    const iconState = reactive({
        dialogVisible: false,
        list: materialIcons,
        keyword: '',
    });

    const onShowIconDialog = () => {
        const vg = oreoEvent.appDom.value.find((item) => item.type === VirtualDomType.VirtualGroup);
        // 取消选中
        for (let i = 0; i < oreoEvent.appDom.value.length; i++) {
            oreoEvent.appDom.value[i].selected = false;
            oreoEvent.appDom.value[i].active = false;
            if (vg && oreoEvent.appDom.value[i].groupId === vg.id) {
                oreoEvent.appDom.value[i].groupId = 0;
            }
        }
        // 删除虚拟组合
        vg && oreoEvent.appDom.value.splice(oreoEvent.appDom.value.indexOf(vg), 1);
        iconState.dialogVisible = true;
    };

    const onAddIcon = (icon: string) => {
        const iconDom = cloneDeep(beaseDom[0]);
        iconDom.type = VirtualDomType.Icon;
        iconDom.id = new Date().getTime();
        iconDom.name = 'Icon';
        iconDom.icon = icon;
        iconDom.styles.fill = false;
        iconDom.styles.width = 30;
        iconDom.styles.height = 30;
        iconDom.styles.left = 30;
        iconDom.styles.top = 30;
        iconDom.fontStyle = {
            color: '#333333',
            fontSize: 12,
            lineHeight: 15,
            fontFamily: 'inherit',
            fontWeight: 'normal',
            textAlign: 'left',
            shadow: false,
            shadowX: 0,
            shadowY: 1,
            shadowBlur: 2,
            shadowSpread: 0,
            shadowColor: 'rgba(0, 0, 0, 1)',
            decoration: 'none',
        };
        oreoEvent.curDom.value = iconDom;
        oreoEvent.appDom.value.push(iconDom);

        iconState.dialogVisible = false;
    };

    const iconFilterList = computed(() => {
        if (iconState.keyword) {
            const list: string[] = [];
            for (let i = 0; i < materialIcons.length; i++) {
                if (materialIcons[i].indexOf(iconState.keyword) !== -1) {
                    list.push(materialIcons[i]);
                }
            }
            return list;
        }
        return [...iconState.list];
    });

    return {
        iconState,
        onShowIconDialog,
        onAddIcon,
        iconFilterList,
    };
};
