import { ref, shallowRef, type Ref } from 'vue';
import { cloneDeep } from 'lodash';
import { beaseDom } from './enumTypes';
import type { OreoEvent } from './enumTypes';

export const useImage = (oreoEvent: OreoEvent) => {
    const imageFileRef = shallowRef<any>();

    let isChange = false;

    const onBottomToolsImage = () => {
        oreoEvent.cancelActived();
        oreoEvent.onMouseMode('image');
        imageFileRef.value?.click();
        isChange = false;
    };

    const onCurImage = () => {
        imageFileRef.value?.click();
        isChange = true;
    };

    const imageWorkEventMove = (is: boolean, e: PointerEvent) => {
        // if (is && oreoEvent.curDom.value) {
        //     console.log('iamge=======');
        //     oreoEvent.curDom.value.styles.left = e.layerX + 0;
        //     oreoEvent.curDom.value.styles.top = e.layerY + 0;
        // }
    };

    const onAddImage = async (event: Event) => {
        const obj = cloneDeep(beaseDom[3]);
        obj.active = false;
        obj.id = new Date().getTime();
        // @ts-ignore
        const file = event.target?.files[0];
        if (!file) return;
        const res = (await loadImage(file)) as HTMLImageElement;
        if (isChange && oreoEvent.curDom.value) {
            oreoEvent.curDom.value.url = res.src;
            return;
        }
        obj.url = res.src;
        obj.styles.left = 500;
        obj.styles.top = 500;
        obj.styles.fill = false;
        obj.styles.width = 216;
        obj.styles.height = (res.height / res.width) * 216;
        oreoEvent.curDom.value = obj;
        oreoEvent.appDom.value.push(oreoEvent.curDom.value);
        oreoEvent.onMouseMode('boxSelect');
    };

    const loadImage = (file: Blob) => {
        return new Promise((resolve) => {
            const _URL = window.URL || window.webkitURL;
            const image = new Image();
            image.src = _URL.createObjectURL(file);
            image.onload = () => {
                resolve(image);
            };
        });
    };

    return {
        imageFileRef,
        onBottomToolsImage,
        imageWorkEventMove,
        onAddImage,
        onCurImage,
    };
};
