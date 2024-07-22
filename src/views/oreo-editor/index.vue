<template>
    <div class="editor_wrap">
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
                :class="{
                    cursorText: oreoApp.mouseMode.text,
                    cursorCross: oreoApp.mouseMode.draRact,
                    cursorGrab: oreoApp.mouseMode.hand,
                }"
            >
                <Grid />
                <div
                    class="work_content"
                    id="work_content"
                    @dragover="oreoApp.onDragover"
                    @drop="oreoApp.onDrop"
                    :style="{
                        scale: oreoApp.scale.value,
                    }"
                >
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
                        @blur="oreoApp.onBlur"
                        @input="oreoApp.onInput"
                        @enter="oreoApp.onEnter"
                        @resizing="oreoApp.onResize"
                    >
                    </Resizeble>
                    <SnapLine :data="oreoApp.snapLine" />
                    <MouseMenu
                        :data="oreoApp.appDom.value"
                        :visible="oreoApp.menuState.value.visible"
                        :top="oreoApp.menuState.value.top"
                        :left="oreoApp.menuState.value.left"
                        :actions="oreoApp.meneActions"
                    />
                </div>
                <div class="boxSelectHelper" :style="oreoApp.rectangleStyle.value"></div>
            </div>
            <BottomToolsBar
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
                :align="oreoApp.align"
                @add-widget="oreoApp.onShowChartDialog"
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
        <a-drawer
            v-model:visible="oreoApp.iconState.value.dialogVisible"
            placement="bottom"
            height="70vh"
            :footer="false"
            hide-cancel
        >
            <template #title> Material design icons </template>
            <div class="icon-wrap">
                <v-icon
                    v-for="item in oreoApp.iconState.value.list"
                    :key="item"
                    :icon="item"
                    @click="oreoApp.onAddIcon(item)"
                />
            </div>
        </a-drawer>
        <a-drawer
            v-model:visible="oreoApp.chartState.value.dialogVisible"
            placement="bottom"
            height="70vh"
            :footer="false"
            hide-cancel
            title="Components"
        >
            <a-button @click="oreoApp.onAddChart">Apex Area Chart</a-button>
        </a-drawer>
    </div>
</template>
<script lang="ts" setup>
import './styles/index.scss';
import Grid from './widgets/Grid.vue';
import BasicWidget from './widgets/BasicWidget.vue';
import Customize from './widgets/Customize.vue';
import LayerPage from './widgets/LayerPage.vue';
import Resizeble from './widgets/Resizeble.vue';
import MouseMenu from './widgets/MouseMenu.vue';
import SnapLine from './widgets/SnapLine.vue';
import BottomToolsBar from './widgets/BottomToolsBar.vue';
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

import useOreoApp from './hooks/oreoApp';
const oreoApp = useOreoApp();
</script>
