import { Application, Color, Graphics, Text } from 'pixi.js';
import { onMounted, shallowRef } from 'vue';

export const useRuler = () => {
    const topRulerDom = shallowRef();
    const leftRulerDom = shallowRef();

    function initTop() {
        const topDom = document.getElementById('oreoEditor') as HTMLDivElement;
        // topDom.attributes.
        const pixiApp = new Application({
            width: 4000,
            height: 20,
            background: new Color('#ffffff'),
        });
        // @ts-ignore
        pixiApp.view.classList.add('top_ruler');
        topDom.appendChild(pixiApp.view as any);
        const graphics = new Graphics();
        const length = 4000; // 尺子的长度
        const tickSpacing = 10; // 刻度线之间的间距

        graphics.beginFill(0xde3249);
        for (let i = 0; i <= length; i += tickSpacing) {
            graphics.beginFill(new Color('#999999'));
            let h = 6;
            if (i % 50 === 0) {
                h = 12;
                const label = new Text(i);
                label.style.fontSize = 10;
                label.style.fill = '#999999';
                label.x = i + 2;
                label.y = 9;
                pixiApp.stage.addChild(label);
            }
            graphics.drawRect(i, 0, 1, h);
            graphics.endFill();
        }
        pixiApp.stage.addChild(graphics);
        topRulerDom.value = pixiApp.view;
        initLeft();
    }
    function initLeft() {
        const topDom = document.getElementById('layers') as HTMLDivElement;
        // topDom.attributes.
        const pixiApp = new Application({
            width: 20,
            height: 4000,
            background: new Color('#ffffff'),
        });
        // @ts-ignore
        pixiApp.view.classList.add('left_ruler');
        topDom.appendChild(pixiApp.view as any);
        const graphics = new Graphics();

        const length = 4000; // 尺子的长度
        const tickSpacing = 10; // 刻度线之间的间距

        for (let y = 0; y <= length; y += tickSpacing) {
            graphics.beginFill(new Color('#999999'));
            const x = 0;
            let w = 6;
            if (y % 50 === 0) {
                w = 12;
                if (y > 20) {
                    const label = new Text(y);
                    label.style.fontSize = 10;
                    label.style.fill = '#999999';
                    label.x = 20;
                    label.y = y + 4;
                    label.rotation = Math.PI / 2;
                    pixiApp.stage.addChild(label);
                }
            }
            if (y > 20) {
                graphics.drawRect(x, y, w, 1);
                graphics.endFill();
            }
        }
        pixiApp.stage.addChild(graphics);
        leftRulerDom.value = pixiApp.view;
    }

    const workAreaDomRef = shallowRef<HTMLDivElement>();
    const onWorkAreaScroll = (e: Event) => {
        // const leftRulerDom = leftRulerDom.value as HTMLDivElement;
        leftRulerDom.value.style.top = `-${workAreaDomRef.value?.scrollTop}px`;
        const left = parseFloat(workAreaDomRef.value?.scrollLeft + '');
        topRulerDom.value.style.left = `${220 - left}px`;
    };

    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let start = false;
    const rulerWorkEventDown = (is: boolean, e: PointerEvent) => {
        if (!is) return;
        e.preventDefault();
        start = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = workAreaDomRef.value?.scrollLeft || 0;
        scrollTop = workAreaDomRef.value?.scrollTop || 0;
    };
    const rulerWorkEventMove = (is: boolean, e: PointerEvent) => {
        if (!is || !start) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        // const dom =
        if (workAreaDomRef.value) {
            workAreaDomRef.value.scrollLeft = scrollLeft - deltaX;
            workAreaDomRef.value.scrollTop = scrollTop - deltaY;
        }
    };
    const rulerWorkEvenEnd = (is: boolean) => {
        if (!is) return;
        scrollLeft = workAreaDomRef.value?.scrollLeft || 0;
        scrollTop = workAreaDomRef.value?.scrollTop || 0;
        start = false;
    };

    onMounted(() => {
        initTop();
        if (workAreaDomRef.value) {
            workAreaDomRef.value.scrollLeft = 2000;
            workAreaDomRef.value.scrollTop = 2000;
        }
    });

    return {
        onWorkAreaScroll,
        workAreaDomRef,
        leftRulerDom,
        topRulerDom,
        rulerWorkEventDown,
        rulerWorkEventMove,
        rulerWorkEvenEnd,
    };
};