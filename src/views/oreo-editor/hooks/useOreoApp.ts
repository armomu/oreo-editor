import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { VirtualDomType, beaseDom, virtualGroup } from './enumTypes';
import type { VirtualDom, ResizeOffset } from './enumTypes';

import { useAddChart } from './useAddChart';
import { useAlign } from './useAlign';
import { useDragWidget } from './useDragWidget';
import { useIcon } from './useIcon';
import { useImage } from './useImage';
import { useLayerPage } from './useLayerPage';
import { useMouseMenu } from './useMouseMenu';
import { useRect } from './useRect';
import { useRuler } from './useRuler';
import { useSnapLine } from './useSnapLine';
import { useTextInput } from './useTextInput';
import { useUndoRedo } from './useUndoRedo';
// 测试导出的数据
import testJson from './test.json';
import { cloneDeep } from 'lodash';

const OreoApp = () => {
    // 所有图层
    const appDom = ref<VirtualDom[]>([]);
    const widgets = ref<VirtualDom[]>([...beaseDom]);
    // 当前选中的图层
    const curDom = ref<VirtualDom | undefined>({
        ...beaseDom[0],
    });
    // 当前视图放大的倍数
    const scale = ref(1);
    // const scale = computed({
    //     get() {
    //         return _scale.value * 100;
    //     },
    //     set(val: number) {
    //         _scale.value = val / 100;
    //     },
    // });
    // 是否禁用所有可操作的图层
    const disableDraResize = computed(() => {
        if (oreoEvent.mouseMode.text) {
            return true;
        }
        if (oreoEvent.mouseMode.draRact) {
            return true;
        }
        return false;
    });
    // 当前是处于在做什么的状态
    const mouseMode = reactive({
        boxSelect: true, // 自由框选或者选择对象
        draRact: false, // 画矩形
        text: false, // 添加文本
        image: false, // 添加图像
        hand: false, // 移动视图
    });
    // let haSelectedList: VirtualDom[] = [];
    // 当前框选内所有的图层
    const selectedList = ref<VirtualDom[]>([]);
    // 框选框视图状态
    const selectBoxState = reactive({
        visible: false,
        width: '',
        height: '',
        top: '',
        left: '',
    });
    // 记录鼠标移动数据
    const mouseState = reactive({
        draggableActive: false, // 可操作图层
        down: false,
        startX: 0,
        startY: 0,
        layerX: 0,
        layerY: 0,
        endX: 0,
        endY: 0,
        offsetX: 0,
        offsetY: 0,
    });

    // 是否正在添加新的对象中
    const adding = ref(false);

    const onPointerDown = (e: PointerEvent) => {
        mouseState.startX = e.clientX + 0;
        mouseState.startY = e.clientY + 0;
        mouseState.layerX = e.layerX + 0;
        mouseState.layerY = e.layerY + 0;
        // @ts-ignore
        const className = e.target?.className || '';
        // @ts-ignore 当前图层ID
        const e_t_did = parseInt(e.target?.getAttribute('uid') + '');
        console.log(className, 'onPointerDown');
        // 每个模式下都要自己管理自己的事件冒泡 e.preventDefault();
        if (mouseMode.boxSelect) {
            // 当点击的对象是拖拽框
            if (className.includes('draggable') || className.includes('dr_text')) {
                console.log('当前点击是拖拽框');
                mouseState.draggableActive = true;
                // 找出当前ID所有子对象 包括组合子组合中的对象
                selectedList.value = findUids(e_t_did);
                return;
            }
            // 点击的对象是右键菜单项目不做操作
            if (className.includes('contextmenu_item')) {
                console.log('当前点击是菜单子项目');
                return;
            }
            deleteVirtualGroup();
            // 设置键菜单位置信息
            if (className.includes('work_content') || className.includes('work-area')) {
                mouseState.down = true;
                selectBoxState.left = e.clientX + 'px';
                selectBoxState.top = e.clientY + 'px';
            }
        }
        rulerBarEvent.rulerWorkEventDown(mouseMode.hand, mouseState.startX, mouseState.startY, e);
        textInputEvent.draggableTextClick(mouseMode.boxSelect, className, e_t_did);
        textInputEvent.textWorkEventDown(mouseMode.text, className, e);
        rectEvent.rectWorkEventDown(mouseMode.draRact, adding, e);
    };

    const onPointerMove = (e: PointerEvent) => {
        mouseState.endX = e.clientX;
        mouseState.endY = e.clientY;
        if (mouseState.draggableActive) {
            if (e.clientX < mouseState.startX) {
                mouseState.offsetX = -mouseState.startX - e.clientX;
            } else {
                mouseState.offsetX = e.clientX - mouseState.startX;
            }
            if (e.clientY < mouseState.startY) {
                mouseState.offsetY = -mouseState.startY - e.clientY;
            } else {
                mouseState.offsetY = e.clientY - mouseState.startY;
            }
        }
        // 画框选框
        if (mouseState.down && mouseMode.boxSelect) {
            selectBoxState.visible = true;
            selectBoxState.width = Math.abs(e.clientX - mouseState.startX) + 'px';
            selectBoxState.height = Math.abs(e.clientY - mouseState.startY) + 'px';
            if (e.clientX < mouseState.startX) {
                selectBoxState.left = e.clientX + 'px';
            }
            if (e.clientY < mouseState.startY) {
                selectBoxState.top = e.clientY + 'px';
            }
        }
        rectEvent.rectWorkEventMove(
            mouseMode.draRact && adding.value,
            mouseState.layerX,
            mouseState.layerY,
            e
        );
        imageEvent.imageWorkEventMove(mouseMode.draRact, e);
        rulerBarEvent.rulerWorkEventMove(mouseMode.hand, e);
    };

    const onPointerUp = () => {
        mouseState.down = false;
        selectBoxState.visible = false;
        mouseState.draggableActive = false;
        rulerBarEvent.rulerWorkEvenEnd(mouseMode.hand);
        if (curDom.value && !curDom.value.input) {
            onMouseMode('boxSelect');
        }
        adding.value = false;
        checkSelectWrap();
    };

    // 查询有没有对象被选中
    // 如果有选中图层会包含在selectedList数组中
    const checkSelectWrap = () => {
        if (!mouseMode.boxSelect) return;
        if (!selectBoxState.width || parseFloat(selectBoxState.width) < 5) {
            // console.log('没有进入 ========= 查询有没有对象被选中');
            return;
        }
        // 获取所有对象集合
        const doms = document.getElementsByClassName('vdr');
        const left = parseFloat(selectBoxState.left);
        const top = parseFloat(selectBoxState.top);
        const width = parseFloat(selectBoxState.width);
        const height = parseFloat(selectBoxState.height);

        // 所有包含在框选内的图层、组合的ID，不包含虚拟组合
        const uids: number[] = [];
        for (let i = 0; i < doms.length; i++) {
            const rect = doms[i].getBoundingClientRect();
            const isContained =
                left <= rect.left &&
                left + width >= rect.right &&
                top <= rect.top &&
                top + height >= rect.bottom;
            if (isContained) {
                uids.push(parseFloat(doms[i].getAttribute('uid') + ''));
            }
        }
        // 获得框选组合
        selectedList.value = [];
        for (let i = 0; i < appDom.value.length; i++) {
            // 需要去除包含在组内到的对象 只得到没有 组合的图层和组合框 组合框对象不包含
            if (uids.includes(appDom.value[i].id) && !appDom.value[i].groupId) {
                appDom.value[i].selected = true;
                selectedList.value.push(appDom.value[i]);
            }
        }
        let _id_ = 0;
        if (selectedList.value.length > 0) _id_ = new Date().getTime(); // 增加虚拟组合的ID
        // 选中多个对象后 把它们放入一个虚拟组合里
        if (selectedList.value.length > 1) {
            const boundsInfo = getBoundsInfo((item) => {
                item.groupId = _id_;
            });
            const obj = cloneDeep(virtualGroup);
            obj.id = _id_;
            obj.styles.width = boundsInfo.width;
            obj.styles.height = boundsInfo.height;
            obj.styles.top = boundsInfo.top;
            obj.styles.left = boundsInfo.left;
            curDom.value = obj;
            appDom.value.push(curDom.value);
        }
        // 取消框选的状态
        selectBoxState.height = '';
        selectBoxState.width = '';
        selectBoxState.top = '';
        selectBoxState.left = '';
    };

    // 获取选择的图层边界
    const getBoundsInfo = (callback?: (_: VirtualDom) => void) => {
        let minTop = Infinity;
        let minLeft = Infinity;
        let maxBottom = -Infinity;
        let maxRight = -Infinity;
        const topList: number[] = [];
        const leftList: number[] = [];
        for (let i = 0; i < selectedList.value.length; i++) {
            // selectedList.value[i].groupId = _id_;
            callback && callback(selectedList.value[i]);
            const { width, height, top, left } = selectedList.value[i].styles;
            topList.push(top);
            leftList.push(left);
            if (top < minTop) {
                minTop = top;
            }
            if (left < minLeft) {
                minLeft = left;
            }
            const bottom = top + height;
            const right = left + width;
            if (bottom > maxBottom) {
                maxBottom = bottom;
            }
            if (right > maxRight) {
                maxRight = right;
            }
        }
        return {
            top: Math.min(...topList),
            width: maxRight - minLeft,
            height: maxBottom - minTop,
            left: Math.min(...leftList),
        };
    };

    const onDomDragging = () => {
        if (selectedList.value.length > 0 && curDom.value) {
            const minTop = Math.min(...selectedList.value.map((vd) => vd.styles.top));
            const minLeft = Math.min(...selectedList.value.map((vd) => vd.styles.left));
            const offsetX = curDom.value.styles.left - minLeft;
            const offsetY = curDom.value.styles.top - minTop;
            for (let i = 0; i < selectedList.value.length; i++) {
                // 群组移动会有一个巨大
                selectedList.value[i].styles.left = selectedList.value[i].styles.left + offsetX;
                selectedList.value[i].styles.top = selectedList.value[i].styles.top + offsetY;
            }
        }
    };

    // 取消所有选择的图层
    const cancelSelect = () => {
        for (let i = 0; i < appDom.value.length; i++) {
            appDom.value[i].selected = false;
        }
        console.log('取消了选择======');
    };
    // 所有选择、选中、虚拟组合和当前curDom的图层
    const cancelActived = () => {
        const vg = appDom.value.find((item) => item.virtualGroup);
        // 取消选中
        for (let i = 0; i < appDom.value.length; i++) {
            appDom.value[i].selected = false;
            appDom.value[i].active = false;
            if (vg && appDom.value[i].groupId === vg.id) {
                appDom.value[i].groupId = 0;
            }
        }
        // 删除虚拟组合
        vg && appDom.value.splice(appDom.value.indexOf(vg), 1);
        // 当前也删掉
        if (curDom.value) {
            curDom.value = undefined;
        }
        console.log('取消了所有选择、选中、虚拟组合的图层======');
    };
    // 删除虚拟组合
    const deleteVirtualGroup = () => {
        const vg = appDom.value.find((item) => item.virtualGroup);
        for (let i = 0; i < appDom.value.length; i++) {
            appDom.value[i].selected = false;
            if (vg && appDom.value[i].groupId === vg.id) {
                appDom.value[i].groupId = 0;
            }
        }
        // 删除虚拟组合
        vg && appDom.value.splice(appDom.value.indexOf(vg), 1);
        if (curDom.value && vg && curDom.value.id === vg.id) {
            curDom.value = undefined;
        }
        console.log('删除了虚拟组======');
    };

    // 设置当前鼠标正在做什么工作
    const onMouseMode = (name: string) => {
        Object.keys(mouseMode).forEach((key) => {
            // @ts-ignore
            mouseMode[key] = name === key;
        });
    };

    // 点击了可操作的图层
    const onVirtualDom = (val: VirtualDom) => {
        curDom.value = val;
    };
    // 删除图层
    const onDelVirtualDom = (id: number) => {
        const index = appDom.value.findIndex((item) => item.id === id);
        if (index < 0) return;
        appDom.value.splice(index, 1);
    };

    const onResize = (val: ResizeOffset) => {
        // BUG 为什么解除组合圆形的宽会变大
        if (curDom.value && curDom.value.type === VirtualDomType.Circle) {
            curDom.value.styles.radius = parseInt(val.width / 2 + '');
        }
    };

    const onLayerTreeNode = (item: VirtualDom) => {
        for (let i = 0; i < appDom.value.length; i++) {
            appDom.value[i].selected = item.id === appDom.value[i].id;
        }
    };

    function findUids(id: number) {
        const result: VirtualDom[] = [];
        // let _curDom: VirtualDom | undefined = undefined
        function findChildren(items: VirtualDom[], parentId: number) {
            for (let i = 0; i < items.length; i++) {
                // if (setCurDom && id === items[i].id) {
                //     curDom.value = items[i];
                //     curDom.value.active = true;
                // }
                const item = items[i];
                if (item.groupId === parentId) {
                    result.push(item);
                    findChildren(items, item.id);
                }
            }
        }

        findChildren(appDom.value, id);

        return result;
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.code === 'Space' || event.code === 'Spacebar') {
            event.preventDefault();
            if (mouseMode.boxSelect && !mouseMode.hand) {
                onMouseMode('hand');
            }
        }
        if (
            event.code === 'ArrowLeft' ||
            event.code === 'ArrowRight' ||
            event.code === 'ArrowUp' ||
            event.code === 'ArrowDown'
        ) {
            event.preventDefault();
            for (let i = 0; i < selectedList.value.length; i++) {
                switch (event.code) {
                    case 'ArrowLeft':
                        selectedList.value[i].styles.left--;
                        break;
                    case 'ArrowRight':
                        selectedList.value[i].styles.left++;
                        break;
                    case 'ArrowUp':
                        selectedList.value[i].styles.top--;
                        break;
                    case 'ArrowDown':
                        selectedList.value[i].styles.top++;
                        break;
                }
            }
            switch (event.code) {
                case 'ArrowLeft':
                    curDom.value && curDom.value.styles.left--;
                    break;
                case 'ArrowRight':
                    curDom.value && curDom.value.styles.left++;
                    break;
                case 'ArrowUp':
                    curDom.value && curDom.value.styles.top--;
                    break;
                case 'ArrowDown':
                    curDom.value && curDom.value.styles.top++;
                    break;
            }
        }
    }
    function onKeyup(event: KeyboardEvent) {
        if (event.code === 'Space' && mouseMode.hand) {
            onMouseMode('boxSelect');
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', onKeydown);
        document.addEventListener('keyup', onKeyup);
    });
    onUnmounted(() => {
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('keyup', onKeyup);
    });

    const jsonViewerVisible = ref(false);
    // test
    appDom.value = testJson._rawValue as any;

    const oreoEvent = {
        mouseMode,
        selectBoxState,
        selectedList,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onDomDragging,
        onMouseMode,
        getBoundsInfo,
        cancelSelect,
        cancelActived,
        deleteVirtualGroup,
    };
    const rulerBarEvent = useRuler();
    const dragWidgetEvent = useDragWidget(appDom, curDom, oreoEvent);
    const mouseMenuEvent = useMouseMenu(appDom, curDom, oreoEvent);
    const iconEvent = useIcon(appDom, curDom);
    const textInputEvent = useTextInput(appDom, curDom, oreoEvent);
    const align = useAlign(appDom);
    const snapLineEvent = useSnapLine();
    const chartEvent = useAddChart(appDom, curDom);
    const imageEvent = useImage(appDom, curDom, oreoEvent);
    const rectEvent = useRect(appDom, curDom, oreoEvent);
    // const layerPageEvent = useLayerPage(appDom, curDom, oreoEvent);

    return {
        appDom,
        widgets,
        curDom,
        scale,
        onVirtualDom,
        onDelVirtualDom,
        onResize,
        disableDraResize,
        onLayerTreeNode,
        jsonViewerVisible,
        align,
        ...snapLineEvent,
        ...oreoEvent,
        ...dragWidgetEvent,
        ...rulerBarEvent,
        ...mouseMenuEvent,
        ...iconEvent,
        ...textInputEvent,
        ...chartEvent,
        ...imageEvent,
        ...rectEvent,
    };
};
export default OreoApp;
