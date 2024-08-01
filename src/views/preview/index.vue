<template>
    <div ref="pixiContainer" id="pixiContainer" style="width: 4000px; height: 22px"></div>
</template>

<script lang="ts" setup>
import { Application, Color, Graphics, Text } from 'pixi.js';
import { onMounted, shallowRef } from 'vue';

function initTop() {
    const topDom = document.getElementById('pixiContainer') as HTMLDivElement;
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
}
onMounted(initTop);
</script>
