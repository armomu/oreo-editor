<template>
    <div class="editor-wrap">
        <div class="oreo-editor" id="oreoEditor">
            <div class="layers-pages" id="layers" @contextmenu.prevent="() => {}">
                <LayerPage
                    :data="oreoApp.appDom.value"
                    @select="oreoApp.onLayerTreeNode"
                    @del="oreoApp.onDelVirtualDom"
                />
                <BasicWidget
                    :data="oreoApp.widgets.value"
                    @draging="oreoApp.onDraging"
                    @addimg="oreoApp.onAddImage"
                />
            </div>
            <div
                :ref="oreoApp.workAreaDomRef"
                class="work-area"
                id="workArea"
                @contextmenu.prevent="() => {}"
                @pointerdown="oreoApp.onPointerDown"
                @pointermove="oreoApp.onPointerMove"
                @pointerup="oreoApp.onPointerUp"
                @scroll="oreoApp.onWorkAreaScroll"
                @dragover="oreoApp.onDragover"
                @drop="oreoApp.onDrop"
                :class="{
                    cursorText: oreoApp.mouseMode.text,
                    cursorCross: oreoApp.mouseMode.draRact,
                    cursorGrab: oreoApp.mouseMode.hand,
                }"
            >
                <div class="work-content" id="work-content" :style="oreoApp.curPageDomstyles.value">
                    <Resizeble
                        v-for="(item, key) in oreoApp.appDom.value"
                        :key="key"
                        :data="item"
                        v-model:active="item.active"
                        v-model:width="item.styles.width"
                        v-model:height="item.styles.height"
                        v-model:top="item.styles.top"
                        v-model:left="item.styles.left"
                        v-model:label="item.label"
                        :disable="oreoApp.disableDraResize.value"
                        :scale="oreoApp.scale.value"
                        @snapLine="oreoApp.onSnapLine"
                        @mouser="oreoApp.openMenu"
                        @activated="oreoApp.onVirtualDom"
                        @dragging="oreoApp.onDomDragging"
                        @blur="oreoApp.onTextBlur"
                        @input="oreoApp.onTextInput"
                        @enter="oreoApp.onTextEnter"
                        @resizing="oreoApp.onResize"
                    >
                    </Resizeble>
                    <SnapLine :data="oreoApp.snapLine" />
                </div>
                <MouseMenu
                    :data="oreoApp.appDom.value"
                    :visible="oreoApp.menuState.value.visible"
                    :top="oreoApp.menuState.value.top"
                    :left="oreoApp.menuState.value.left"
                    :actions="oreoApp.meneActions"
                />
                <div class="boxSelectHelper" :style="oreoApp.rectangleStyle.value"></div>
            </div>
            <BottomTools
                :data="oreoApp.mouseMode"
                :imageFileRef="oreoApp.imageFileRef"
                v-model:scale="oreoApp.scale.value"
                @image-file-change="oreoApp.onAddImage"
                @arrow="oreoApp.onMouseMode('boxSelect')"
                @dra-ract="oreoApp.onBottomToolsDraRact"
                @text="oreoApp.onTextIconClick"
                @image="oreoApp.onBottomToolsImage"
                @icon="oreoApp.onShowIconDialog"
                @hand="oreoApp.onMouseMode('hand')"
                @json="
                    () => {
                        oreoApp.jsonViewerVisible.value = true;
                    }
                "
            />
            <Customize
                :data="oreoApp.curDom.value"
                :page-data="oreoApp.curPageDom.value"
                :align="oreoApp.align"
                @image="oreoApp.onCurImage"
            />
        </div>
        <a-drawer
            v-model:visible="oreoApp.jsonViewerVisible.value"
            placement="bottom"
            hide-cancel
            height="70vh"
        >
            <template #title> Json Viewer </template>
            <JsonViewer
                v-if="oreoApp.jsonViewerVisible"
                :value="oreoApp.appDom"
                :expand-depth="5"
                copyable
            ></JsonViewer>
        </a-drawer>
        <a-modal width="68%" v-model:visible="oreoApp.iconState.dialogVisible" :footer="false">
            <template #title> Material design icons </template>
            <a-space
                direction="vertical"
                size="large"
                style="width: 100%; position: relative; top: -12px"
            >
                <a-input-search
                    placeholder="Search icons"
                    allow-clear
                    v-model="oreoApp.iconState.keyword"
                />
            </a-space>
            <div class="icon-wrap">
                <div class="icon-item" v-for="item in oreoApp.iconFilterList.value" :key="item">
                    <v-icon :icon="item" @click="oreoApp.onAddIcon(item)" :size="48" />
                    <div class="label">{{ item.replace('mdi-', '') }}</div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import './styles/index.scss';
import BasicWidget from './widgets/BasicWidget.vue';
import Customize from './widgets/Customize.vue';
import LayerPage from './widgets/LayerPage.vue';
import Resizeble from './widgets/Resizeble.vue';
import MouseMenu from './widgets/MouseMenu.vue';
import SnapLine from './widgets/SnapLine.vue';
import BottomTools from './widgets/BottomTools.vue';
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

import useOreoApp from './hooks/oreoApp';
const oreoApp = useOreoApp();
</script>
