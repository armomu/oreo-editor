import{_ as d}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{aE as l,u as h,v as c,aq as p}from"./index-Cp6KmwRg.js";const u={data(){return{isDrawing:!1,startX:0,startY:0,endX:0,endY:0}},computed:{rectangleStyle(){const{startX:t,startY:e,endX:a,endY:s}=this,i=Math.min(t,a)+"px",n=Math.min(e,s)+"px",r=Math.abs(a-t)+"px",o=Math.abs(s-e)+"px";return{position:"absolute",left:i,top:n,width:r,height:o,border:"2px solid red"}}},methods:{handlePointerDown(t){this.isDrawing=!0,this.startX=t.clientX,this.startY=t.clientY},handlePointerMove(t){this.isDrawing&&(this.endX=t.clientX,this.endY=t.clientY)},handlePointerUp(){this.isDrawing=!1,this.clearCoordinates()},clearCoordinates(){this.startX=0,this.startY=0,this.endX=0,this.endY=0}}};function f(t,e,a,s,i,n){return l(),h("div",{class:"canvas",onPointerdown:e[0]||(e[0]=(...r)=>n.handlePointerDown&&n.handlePointerDown(...r)),onPointermove:e[1]||(e[1]=(...r)=>n.handlePointerMove&&n.handlePointerMove(...r)),onPointerup:e[2]||(e[2]=(...r)=>n.handlePointerUp&&n.handlePointerUp(...r))},[c("div",{ref:"rectangle",style:p(n.rectangleStyle)},null,4)],32)}const X=d(u,[["render",f],["__scopeId","data-v-59d35ec3"]]);export{X as default};