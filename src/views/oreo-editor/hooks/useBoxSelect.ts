import { reactive, type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { virtualGroup, type OreoEvent, type VirtualDom } from './enumTypes';

export const useBoxSelect = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    selectedList: Ref<VirtualDom[]>,
    oreoEvent: OreoEvent
) => {
    // 框选框视图状态
    const boxSelectState = reactive({
        visible: false,
        width: '',
        height: '',
        top: '',
        left: '',
    });
    // // 记录鼠标移动数据
    // const mouseState = reactive({
    //     draggableActive: false, // 可操作图层
    //     down: false,
    //     startX: 0,
    //     startY: 0,
    //     layerX: 0,
    //     layerY: 0,
    //     endX: 0,
    //     endY: 0,
    //     offsetX: 0,
    //     offsetY: 0,
    // });
    let startX = 0;
    let startY = 0;
    let mouseDown = false;
    const boxSelectWorkEventDown = (is: boolean, className: string, e: PointerEvent) => {
        if (!is) return;
        // 设置键菜单位置信息
        if (className.includes('work_content') || className.includes('work-area')) {
            startX = e.clientX + 0;
            startY = e.clientY + 0;
            boxSelectState.left = startX + 'px';
            boxSelectState.top = startY + 'px';
            mouseDown = true;
        }
    };
    const boxSelectWorkEventMove = (is: boolean, e: PointerEvent) => {
        // mouseState.endX = e.clientX;
        // mouseState.endY = e.clientY;
        // if (mouseState.draggableActive) {
        //     if (e.clientX < mouseState.startX) {
        //         mouseState.offsetX = -mouseState.startX - e.clientX;
        //     } else {
        //         mouseState.offsetX = e.clientX - mouseState.startX;
        //     }
        //     if (e.clientY < mouseState.startY) {
        //         mouseState.offsetY = -mouseState.startY - e.clientY;
        //     } else {
        //         mouseState.offsetY = e.clientY - mouseState.startY;
        //     }
        // }
        if (!is || !mouseDown) return;
        // 画框选框
        boxSelectState.visible = true;
        boxSelectState.width = Math.abs(e.clientX - startX) + 'px';
        boxSelectState.height = Math.abs(e.clientY - startY) + 'px';
        if (e.clientX < startX) {
            boxSelectState.left = e.clientX + 'px';
        }
        if (e.clientY < startY) {
            boxSelectState.top = e.clientY + 'px';
        }
    };
    const boxSelectWorkEventUp = (is: boolean) => {
        if (!is) return;
        mouseDown = false;
        boxSelectState.visible = false;
        checkSelectWrap();
    };

    // 查询有没有对象被选中
    // 如果有选中图层会包含在selectedList数组中
    const checkSelectWrap = () => {
        if (!boxSelectState.width || parseFloat(boxSelectState.width) < 5) {
            // console.log('没有进入 ========= 查询有没有对象被选中');
            return;
        }
        // 获取所有对象集合
        const doms = document.getElementsByClassName('vdr');
        const left = parseFloat(boxSelectState.left);
        const top = parseFloat(boxSelectState.top);
        const width = parseFloat(boxSelectState.width);
        const height = parseFloat(boxSelectState.height);

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
            const boundsInfo = oreoEvent.getBoundsInfo((item) => {
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
        boxSelectState.height = '';
        boxSelectState.width = '';
        boxSelectState.top = '';
        boxSelectState.left = '';
    };

    return {
        boxSelectWorkEventDown,
        boxSelectWorkEventMove,
        boxSelectWorkEventUp,
        boxSelectState,
    };
};
