<template>
    <div
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        style="
            position: relative;
            width: 500px;
            height: 500px;
            border: 1px solid black;
            transform-origin: top left;
            transform: scale(0.8);
        "
    >
        <div
            ref="rectangle"
            :style="{
                position: 'absolute',
                width: Math.abs(rectWidth) + 'px',
                height: Math.abs(rectHeight) + 'px',
                left: rectLeft + 'px',
                top: rectTop + 'px',
                backgroundColor: 'lightblue',
            }"
        ></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDrawing: false,
            startX: 0,
            startY: 0,
            rectLeft: 0,
            rectTop: 0,
            rectWidth: 0,
            rectHeight: 0,
            scale: 0.8, // 父级缩放因子
        };
    },
    methods: {
        handlePointerDown(event) {
            this.isDrawing = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
        },
        handlePointerMove(event) {
            if (this.isDrawing) {
                this.rectWidth = (event.clientX - this.startX) / this.scale;
                this.rectHeight = (event.clientY - this.startY) / this.scale;
                this.rectLeft = Math.min(this.startX, event.clientX) / this.scale;
                this.rectTop = Math.min(this.startY, event.clientY) / this.scale;
            }
        },
        handlePointerUp() {
            this.isDrawing = false;
        },
    },
};
</script>
