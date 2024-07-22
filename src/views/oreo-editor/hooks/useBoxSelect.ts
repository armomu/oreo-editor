import { reactive, computed, type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { virtualGroup, type OreoEvent, type VirtualDom } from './enumTypes';

export const useBoxSelect = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    selectedList: Ref<VirtualDom[]>,
    oreoEvent: OreoEvent
) => {
    // 框选框视图状态 相对于框选的父级
    const boxSelectState = reactive({
        visible: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
    });

    const rectangleStyle = computed(() => {
        const { startX, startY, endX, endY } = boxSelectState;
        const left = Math.min(startX, endX) + 'px';
        const top = Math.min(startY, endY) + 'px';
        const width = Math.abs(endX - startX) + 'px';
        const height = Math.abs(endY - startY) + 'px';
        return {
            left,
            top,
            width,
            height,
            display: boxSelectState.visible ? 'block' : 'none',
        };
    });

    let mouseDown = false;
    let divRectScrollTop = 0;
    let divRectLeft = 0;
    let clientX = 0;
    let clientY = 0;
    let clientEndX = 0;
    let clientEndY = 0;
    const boxSelectWorkEventDown = (is: boolean, className: string, e: PointerEvent) => {
        if (!is || !className.includes('work-area')) return;
        e.preventDefault();
        mouseDown = true;
        // @ts-ignore
        const divRect = e.target.getBoundingClientRect() as DOMRect;
        // @ts-ignore
        divRectScrollTop = e.target.scrollTop;
        // @ts-ignore
        divRectLeft = divRect.left - e.target.scrollLeft;
        console.log(divRect, divRectScrollTop);
        boxSelectState.startX = e.clientX - divRectLeft;
        boxSelectState.startY = e.clientY + divRectScrollTop;
        clientX = e.clientX;
        clientY = e.clientY;
    };
    const boxSelectWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !mouseDown) return;
        e.preventDefault();
        // 画框选框
        boxSelectState.visible = true;
        boxSelectState.endX = e.clientX - divRectLeft;
        boxSelectState.endY = e.clientY + divRectScrollTop;
    };
    const boxSelectWorkEventUp = (is: boolean, e: PointerEvent) => {
        if (!is) return;
        clientEndX = e.clientX;
        clientEndY = e.clientY;
        mouseDown = false;
        boxSelectState.visible = false;
        checkSelectWrap();
    };

    // 查询有没有对象被选中
    // 如果有选中图层会包含在selectedList数组中
    const checkSelectWrap = () => {
        if (parseFloat(rectangleStyle.value.width) < 5) {
            console.log('不查询');
            return;
        }
        // boxSelectState.visible = true;
        // 获取所有对象集合
        const doms = document.getElementsByClassName('vdr');
        const left = Math.min(clientX, clientEndX);
        const top = Math.min(clientY, clientEndY);
        const width = Math.abs(clientEndX - clientX);
        const height = Math.abs(clientEndY - clientY);

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
    };

    return {
        boxSelectWorkEventDown,
        boxSelectWorkEventMove,
        boxSelectWorkEventUp,
        boxSelectState,
        rectangleStyle,
    };
};
