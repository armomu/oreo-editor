<template>
    <div
        class="canvas"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
    >
        <div ref="rectangle" :style="rectangleStyle"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDrawing: false,
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
        };
    },
    computed: {
        rectangleStyle() {
            const { startX, startY, endX, endY } = this;
            const left = Math.min(startX, endX) + 'px';
            const top = Math.min(startY, endY) + 'px';
            const width = Math.abs(endX - startX) + 'px';
            const height = Math.abs(endY - startY) + 'px';

            return {
                position: 'absolute',
                left,
                top,
                width,
                height,
                border: '2px solid red',
            };
        },
    },
    methods: {
        handlePointerDown(event) {
            this.isDrawing = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
        },
        handlePointerMove(event) {
            if (!this.isDrawing) return;
            this.endX = event.clientX;
            this.endY = event.clientY;
        },
        handlePointerUp() {
            this.isDrawing = false;
            this.clearCoordinates();
        },
        clearCoordinates() {
            this.startX = 0;
            this.startY = 0;
            this.endX = 0;
            this.endY = 0;
        },
    },
};
</script>

<style scoped>
.canvas {
    position: relative;
    width: 400px;
    height: 300px;
    background-color: lightgray;
}

div.rectangle {
    border: 2px solid red;
}
</style>
