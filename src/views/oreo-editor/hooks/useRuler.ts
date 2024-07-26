import { Application, Color, Graphics, Text } from 'pixi.js';
import { onMounted, shallowRef, onUnmounted, watch } from 'vue';
import type { OreoEvent } from './enumTypes';

export const useRuler = (oreoEvent: OreoEvent) => {
    const topRulerDom = shallowRef();
    const leftRulerDom = shallowRef();
    let pixiApp: Application | null = null;
    let pixiAppLeft: Application | null = null;
    watch(
        () => oreoEvent.scale.value,
        () => {
            pixiApp && setRulerBar(pixiApp);
            pixiAppLeft && setLeftRulerBar(pixiAppLeft);
        }
    );
    function initTop() {
        const topDom = document.getElementById('oreoEditor') as HTMLDivElement;
        pixiApp = new Application({
            width: 6000,
            height: 20,
            background: new Color('#ffffff'),
        });

        // @ts-ignore
        pixiApp.view.classList.add('top_ruler');
        topDom.appendChild(pixiApp.view as any);

        topRulerDom.value = pixiApp.view;
        setRulerBar(pixiApp);
        initLeft();
    }
    const setRulerBar = (app: Application) => {
        app.stage.removeChildren();
        const graphics = new Graphics();
        const length = 6000; // 尺子的长度
        const tickSpacing = 10; // 刻度线之间的间距

        graphics.beginFill(0xde3249);
        let value = 2030;
        let increasing = false;
        for (let i = 0; i <= length; i += tickSpacing) {
            graphics.beginFill(new Color('#999999'));
            let h = 6;
            if (increasing) {
                value += 10;
            } else {
                value -= 10;
            }
            if (value < 0) {
                increasing = true;
                value = Math.abs(value);
            }
            if (value % 50 === 0) {
                h = 12;
                const label = new Text(Math.floor(value / oreoEvent.scale.value));
                label.style.fontSize = 10;
                label.style.fill = '#999999';
                label.x = i + 2;
                label.y = 9;
                app.stage.addChild(label);
            }
            graphics.drawRect(i, 0, 1, h);
            graphics.endFill();
        }
        app.stage.addChild(graphics);
    };
    const setLeftRulerBar = (app: Application) => {
        app.stage.removeChildren();
        const graphics = new Graphics();

        const length = 6000; // 尺子的长度
        const tickSpacing = 10; // 刻度线之间的间距
        let value = 2030;
        let increasing = false;

        for (let y = 0; y <= length; y += tickSpacing) {
            graphics.beginFill(new Color('#999999'));
            const x = 0;
            let w = 6;

            if (increasing) {
                value += 10;
            } else {
                value -= 10;
            }

            if (value < 0) {
                increasing = true;
                value = Math.abs(value);
            }
            if (value % 50 === 0) {
                w = 12;
                if (y > 20) {
                    const label = new Text(Math.floor(value / oreoEvent.scale.value));
                    label.style.fontSize = 10;
                    label.style.fill = '#999999';
                    label.x = 20;
                    label.y = y + 4;
                    label.rotation = Math.PI / 2;
                    app.stage.addChild(label);
                }
            }
            if (y > 20) {
                graphics.drawRect(x, y, w, 1);
                graphics.endFill();
            }
        }
        app.stage.addChild(graphics);
    };

    function initLeft() {
        const topDom = document.getElementById('layers') as HTMLDivElement;
        // topDom.attributes.
        pixiAppLeft = new Application({
            width: 20,
            height: 6000,
            background: new Color('#ffffff'),
        });
        // @ts-ignore
        pixiAppLeft.view.classList.add('left_ruler');
        topDom.appendChild(pixiAppLeft.view as any);
        setLeftRulerBar(pixiAppLeft);
        leftRulerDom.value = pixiAppLeft.view;
    }

    const workAreaDomRef = shallowRef<HTMLDivElement>();
    const onWorkAreaScroll = (e: Event) => {
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
            workAreaDomRef.value.scrollLeft = 1900;
            workAreaDomRef.value.scrollTop = 1900;
        }
        window.addEventListener('wheel', onWheelEvent);
    });

    onUnmounted(() => {
        window.removeEventListener('wheel', onWheelEvent);
    });

    const onWheelEvent = (event: WheelEvent) => {
        if (!altDown) return;
        const down = event.deltaY > 0;
        if (down) {
            oreoEvent.scale.value -= 0.2;
        } else {
            oreoEvent.scale.value += 0.2;
        }
    };
    let altDown = false;
    const onRulerKeydown = (event: KeyboardEvent) => {
        if (event.code === 'AltLeft' || event.code === 'AltRight') {
            // event.preventDefault();
            altDown = true;
        }
    };

    const onRulerKeyup = (event: KeyboardEvent) => {
        if (event.code === 'AltLeft' || event.code === 'AltRight') {
            altDown = false;
        }
    };

    return {
        onWorkAreaScroll,
        workAreaDomRef,
        leftRulerDom,
        topRulerDom,
        rulerWorkEventDown,
        rulerWorkEventMove,
        rulerWorkEvenEnd,
        onRulerKeydown,
        onRulerKeyup,
    };
};
