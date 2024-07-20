<template>
    <a-collapse
        :default-active-key="['1', '2']"
        :bordered="false"
        :show-expand-icon="false"
        expand-icon-position="right"
    >
        <a-collapse-item header="Pages" key="2"> </a-collapse-item>
        <a-collapse-item header="Layers" key="1">
            <a-tree
                @select="onSelect"
                @check="onCheck"
                @expand="onExpand"
                :selected-keys="selectedKeys"
                :data="treeData"
                block-node
                show-line
                size="small"
            >
                <template #extra="nodeData">
                    <v-icon icon="mdi-trash-can-outline" size="x-small" @click="onDel(nodeData)" />
                    <v-icon
                        v-if="!nodeData.item.locked"
                        icon="mdi-lock-outline"
                        size="x-small"
                        class="ml-1"
                        @click="onLock(nodeData)"
                    />
                    <v-icon
                        v-else
                        icon="mdi-lock-open-variant-outline"
                        size="x-small"
                        class="ml-1"
                        @click="onLock(nodeData)"
                    />
                    <v-icon
                        v-if="!nodeData.item.visible"
                        icon="mdi-eye-outline"
                        size="x-small"
                        class="ml-1"
                        @click="onVisible(nodeData)"
                    />
                    <v-icon
                        v-else
                        icon="mdi-eye-off-outline"
                        size="x-small"
                        class="ml-1"
                        @click="onVisible(nodeData)"
                    />
                </template>
                <template #switcher-icon="{ isLeaf }">
                    <IconDown v-if="!isLeaf" />
                </template>
            </a-tree>
        </a-collapse-item>
    </a-collapse>
</template>
<script lang="ts" setup>
import { computed, h } from 'vue';
import { IconDriveFile, IconDown, IconImage, IconFontColors } from '@arco-design/web-vue/es/icon';
import { VIcon } from 'vuetify/components';
import { VirtualDomType } from '../hooks/enumTypes';
import type { VirtualDom } from '../hooks/enumTypes';

const props = withDefaults(
    defineProps<{
        data: VirtualDom[];
    }>(),
    {}
);
const treeData = computed(() => {
    const res = buildTree(props.data, 0);
    return res;
});

const selectedKeys = computed(() => {
    const ids = [];
    for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].active || props.data[i].selected) {
            ids.push(props.data[i].id + '');
        }
    }
    return ids;
});

const emit = defineEmits(['select', 'del']);

const onDel = (nodeData: TreeData) => {
    emit('del', nodeData.item.id);
};
const onLock = (nodeData: TreeData) => {
    console.log(nodeData);
    nodeData.item.locked = !nodeData.item.locked;
};
const onVisible = (nodeData: TreeData) => {
    console.log(nodeData);
    nodeData.item.visible = !nodeData.item.visible;
};

const onSelect = (newSelectedKeys: string[], event: TreeEvent) => {
    console.log('select: ', event.node.item);
    event.node.item.selected = true;
    emit('select', event.node.item);
};

const onCheck = (newCheckedKeys: string[], event: TreeEvent) => {
    console.log('check: ', newCheckedKeys, event);
};

const onExpand = (newExpandedKeys: string[], event: TreeEvent) => {
    console.log('expand: ', newExpandedKeys, event);
};

function buildTree(flatData: VirtualDom[], rootId: number) {
    const tree: TreeData[] = [];
    for (let i = 0; i < flatData.length; i++) {
        if (flatData[i].groupId === rootId) {
            const children = buildTree(flatData, flatData[i].id);
            const icon = getIcon(flatData[i].type, flatData[i].icon);
            let title = flatData[i].name;
            if (flatData[i].type === VirtualDomType.Text) {
                title = flatData[i].label + '';
            }
            tree.push({
                item: flatData[i],
                key: flatData[i].id + '',
                title,
                switcherIcon: children.length ? undefined : icon,
                children,
            });
        }
    }
    return tree;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIcon = (type: number, _icon: string) => {
    let icon = () => h(IconDriveFile);
    if (type === VirtualDomType.Image) {
        icon = () => h(IconImage);
    }
    if (type === VirtualDomType.Text) {
        icon = () => h(IconFontColors);
    }
    // if (type === VirtualDomType.Icon) {
    //     icon = () => h(VIcon, { icon: icon });
    // }
    return icon;
};
interface TreeData {
    item: VirtualDom;
    key: string;
    title: string;
    switcherIcon?: any;
    children: TreeData[];
}
interface TreeEvent {
    e: PointerEvent;
    node: TreeData;
    selected: boolean;
    selectedNodes: TreeData[];
}
</script>
