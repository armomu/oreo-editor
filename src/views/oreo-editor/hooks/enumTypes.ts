import { type VNode, type RendererNode, type RendererElement, type Ref, h } from 'vue';
import ChartArea from '../widgets/charts/ChartArea.vue';

export enum VirtualDomType {
    Group,
    Rect,
    Circle,
    Text,
    Image,
    Video,
    Icon,
    VirtualGroup = 999,
}
export const beaseDomStyle: ElementStyles = {
    width: 200,
    height: 90,
    left: 0,
    top: 0,
    opacity: 1,
    rotate: 0,
    radius: 0,

    fill: true,
    background: '#999999',

    border: false,
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: '#999',

    shadow: false,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 8,
    shadowSpread: 0,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
};

export const beaseDom: VirtualDom[] = [
    {
        id: 1,
        name: 'Rect',
        groupId: 0,
        icon: 'mdi-card-outline',
        type: VirtualDomType.Rect,
        active: true,
        visible: true,
        selected: false,
        locked: false,
        disabled: false,
        styles: { ...beaseDomStyle },
    },
    {
        id: 2,
        name: 'Circle',
        groupId: 0,
        icon: 'mdi-circle-outline',
        type: VirtualDomType.Circle,
        active: true,
        visible: true,
        selected: false,
        locked: false,
        disabled: false,
        styles: { ...beaseDomStyle, width: 90, radius: 45 },
    },
    {
        id: 3,
        name: 'Text',
        groupId: 0,
        icon: 'mdi-format-color-text',
        label: 'This is an open source backend management system. Oreo editor can provide basic drag-and-drop editing pages.', // 展示文本 或者title用
        active: true,
        visible: true,
        selected: false,
        locked: false,
        type: VirtualDomType.Text,
        disabled: false,
        styles: { ...beaseDomStyle, fill: false },
        fontStyle: {
            color: '#333333',
            fontSize: 12,
            lineHeight: 1,
            fontFamily: 'alishuhei',
            fontWeight: 'normal',
            textAlign: 'left',
            shadow: false,
            shadowX: 0,
            shadowY: 1,
            shadowBlur: 2,
            shadowSpread: 0,
            shadowColor: 'rgba(0, 0, 0, 1)',
            decoration: 'none',
        },
    },
    {
        id: 4,
        name: 'Image',
        groupId: 0,
        icon: 'mdi-image-outline',
        type: VirtualDomType.Image,
        active: true,
        visible: true,
        selected: false,
        locked: false,
        disabled: false,
        url: 'https://github.com/armomu/oreo-editor/raw/main/public/w.png',
        styles: { ...beaseDomStyle, imgFit: 'contain', fill: false, background: '#ffffff' },
    },
    {
        id: 5,
        name: 'Chart',
        groupId: 0,
        icon: 'mdi-chart-areaspline',
        type: VirtualDomType.Rect,
        active: true,
        visible: true,
        selected: false,
        locked: false,
        disabled: false,
        component: () =>
            h(ChartArea, {
                x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                y: [31, 40, 28, 51, 42, 109, 100],
            }),
        styles: { ...beaseDomStyle, width: 540, height: 260, background: '#ffffff' },
    },
];

export const virtualGroup: VirtualDom = {
    id: 0,
    name: 'virtualGroup',
    groupId: 0,
    icon: 'mdi-group', // 统一用Vuetify mdi-xxxx这套
    type: VirtualDomType.VirtualGroup,
    active: true,
    visible: true,
    selected: false,
    locked: false,
    disabled: false,
    styles: { ...beaseDomStyle, background: '#ffffff', width: 1200, height: 1080 },
};

export const pageDom: VirtualDom = {
    id: 0,
    name: 'page',
    groupId: 0,
    icon: 'mdi-card-outline', // 统一用Vuetify mdi-xxxx这套
    type: VirtualDomType.Rect, // 组合
    active: true,
    visible: true,
    selected: false,
    locked: false,
    disabled: false,
    styles: { ...beaseDomStyle, width: 1200, height: 1080, background: '#ffffff' },
};

export interface VirtualDom {
    id: number;
    groupId: number; // 所属组合ID
    name: string;
    icon: string; // 统一用Vuetify mdi-xxxx这套
    label?: string; // 展示文本 或者title用
    type: VirtualDomType;
    url?: string; // 图片或者资源链接
    active: boolean; // 进行拖变大小状态
    selected: boolean; // 选中状态
    locked: boolean; // 锁定状态
    visible: boolean;
    disabled: boolean;
    input?: boolean; // 文本特有的编辑文本中状态
    styles: ElementStyles;
    fontStyle?: FontStyle;
    component?: () => VNode<
        RendererNode,
        RendererElement,
        {
            [key: string]: any;
        }
    >; // 内组件
    // 组件参数
    componentProps?: Record<any, any>;
}

// 基础框框
export interface ElementStyles extends Shadow {
    // 变换
    width: number;
    height: number;
    left: number;
    top: number;
    opacity: number;
    rotate: number;
    radius: number;

    fill: boolean;
    imgFit?: 'fill' | 'none' | 'contain' | 'cover' | 'scale-down' | undefined;
    background: string;

    border: boolean;
    borderWidth: string;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    borderColor: string;
}

// 文本
export interface FontStyle extends Shadow {
    color: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'bold' | 'bolder' | 'normal' | 'lighter' | 'bolder';
    textAlign: 'center' | 'left' | 'right' | 'justify' | 'start' | 'end';
    decoration: 'none' | 'overline' | 'line-through' | 'underline';
    lineHeight: number;
}
interface Shadow {
    shadow: boolean;
    shadowX: number;
    shadowY: number;
    shadowBlur: number;
    shadowSpread: number; // 文本不可用
    shadowColor: string;
}
export interface BoundsInfo {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface OreoEvent {
    appDom: Ref<VirtualDom[]>;
    curDom: Ref<VirtualDom | undefined>;
    scale: Ref<number>;
    pagesDom: Ref<VirtualDom[]>;
    curPageDom: Ref<VirtualDom>;
    mouseMode: MouseMode;
    selectedList: Ref<VirtualDom[]>;
    pointerEventState: PointerEventState;
    getClientBounds: (client?: boolean) => BoundsInfo;
    getRectClientBounds: (client?: boolean) => BoundsInfo;
    onMouseMode: (name: 'boxSelect' | 'draRact' | 'text' | 'hand' | 'image') => void;
    getBoundsInfo: (callback?: (_: VirtualDom) => void) => BoundsInfo;
    cancelSelect: () => void;
    cancelActived: () => void;
    deleteVirtualGroup: () => void;
    findUids(id: number): VirtualDom[];
}

export interface MouseMode {
    boxSelect: boolean;
    draRact: boolean;
    text: boolean;
    hand: boolean;
    image: boolean;
}

export interface DragOffset {
    offsetX: number;
    offsetY: number;
}
export interface PointerEventState {
    mouseDown: boolean;
    targetClientTop: number;
    targetClientLeft: number;
    clientStartX: number;
    clientStartY: number;
    clientEndX: number;
    clientEndY: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}
