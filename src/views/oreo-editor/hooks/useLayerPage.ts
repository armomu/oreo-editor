import { ref, type Ref } from 'vue';

import materialIcons from './icon';
import { VirtualDomType, beaseDom, type VirtualDom } from './enumTypes';

export const useLayerPage = (appDom: Ref<VirtualDom[]>, curDom: Ref<VirtualDom | undefined>) => {
    const layerTreeSelectedKeys = ref([]);

    return {
        layerTreeSelectedKeys,
    };
};
