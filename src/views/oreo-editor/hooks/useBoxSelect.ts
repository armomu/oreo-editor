import { reactive, computed, type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { virtualGroup, type OreoEvent, type VirtualDom } from './enumTypes';

export const useBoxSelect = (oreoEvent: OreoEvent) => {
    // 框选框视图状态 相对于框选的父级
    const boxSelectState = reactive({
        visible: false,
    });

    const rectangleStyle = computed(() => {
        const info = oreoEvent.getClientBounds();
        return {
            left: info.left + 'px',
            top: info.top + 'px',
            width: info.width + 'px',
            height: info.height + 'px',
            display: boxSelectState.visible ? 'block' : 'none',
        };
    });

    let mouseDown = false;
    const boxSelectWorkEventDown = (is: boolean, className: string, e: PointerEvent) => {
        if (!is || !className.includes('work-area')) return;
        e.preventDefault();
        boxSelectState.visible = false;
        mouseDown = true;
        console.log('=================');
    };
    const boxSelectWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !mouseDown) return;
        e.preventDefault();
        boxSelectState.visible = true;
    };
    const boxSelectWorkEventUp = (is: boolean, e: PointerEvent) => {
        if (!is || !mouseDown) return;
        boxSelectState.visible = false;
        mouseDown = false;
        checkSelectWrap();
    };

    // 查询有没有对象被选中
    // 如果有选中图层会包含在selectedList数组中
    const checkSelectWrap = () => {
        if (parseFloat(rectangleStyle.value.width) < 5) {
            console.log('不查询是否有选中');
            return;
        }
        // 获取所有对象集合
        const doms = document.getElementsByClassName('vdr');
        const { left, top, width, height } = oreoEvent.getClientBounds(true);
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
        oreoEvent.selectedList.value = [];
        for (let i = 0; i < oreoEvent.appDom.value.length; i++) {
            // 需要去除包含在组内到的对象 只得到没有 组合的图层和组合框 组合框对象不包含
            if (uids.includes(oreoEvent.appDom.value[i].id) && !oreoEvent.appDom.value[i].groupId) {
                oreoEvent.appDom.value[i].selected = true;
                oreoEvent.selectedList.value.push(oreoEvent.appDom.value[i]);
            }
        }
        // 选中多个对象后 把它们放入一个虚拟组合里
        let _id_ = 0;
        if (oreoEvent.selectedList.value.length > 1) _id_ = new Date().getTime(); // 增加虚拟组合的ID
        // 选中多个对象后 把它们放入一个虚拟组合里
        if (oreoEvent.selectedList.value.length > 1) {
            const boundsInfo = oreoEvent.getBoundsInfo((item) => {
                item.groupId = _id_;
            });
            const obj = cloneDeep(virtualGroup);
            obj.id = _id_;
            obj.styles.width = boundsInfo.width;
            obj.styles.height = boundsInfo.height;
            obj.styles.top = boundsInfo.top;
            obj.styles.left = boundsInfo.left;
            oreoEvent.curDom.value = obj;
            oreoEvent.appDom.value.push(oreoEvent.curDom.value);
            oreoEvent.selectedList.value = oreoEvent.findUids(_id_);
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
