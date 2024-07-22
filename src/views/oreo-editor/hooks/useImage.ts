import { ref, shallowRef, type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom, type VirtualDom } from './enumTypes';
import type { OreoEvent } from './enumTypes';

export const useImage = (
    appDom: Ref<VirtualDom[]>,
    curDom: Ref<VirtualDom | undefined>,
    oreoEvent: OreoEvent
) => {
    const imageFileRef = shallowRef<any>();

    const onBottomToolsImage = () => {
        oreoEvent.cancelActived();
        oreoEvent.onMouseMode('image');
        imageFileRef.value?.click();
    };

    const imageWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (is && curDom.value) {
            console.log('iamge=======');
            curDom.value.styles.left = e.layerX + 0;
            curDom.value.styles.top = e.layerY + 0;
        }
    };

    const onAddImage = (event: Event) => {
        const obj = cloneDeep(beaseDom[3]);
        obj.active = false;
        obj.id = new Date().getTime();
        // @ts-ignore
        const file = event.target?.files[0];
        if (!file) return;
        const _URL = window.URL || window.webkitURL;
        const image = new Image();
        obj.url = _URL.createObjectURL(file);
        image.src = obj.url;
        image.onload = () => {
            obj.styles.fill = false;
            obj.styles.width = 216;
            obj.styles.height = (image.height / image.width) * 216;

            curDom.value = obj;
            appDom.value.push(curDom.value);
            console.log(appDom.value);
        };
    };

    return {
        imageFileRef,
        onBottomToolsImage,
        imageWorkEventMove,
        onAddImage,
    };
};
