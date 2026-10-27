import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{a as o,n as s,o as c,s as l,t as u}from"./card-lDj02HnZ.js";import{Kn as ee,_ as d,_t as f,a as p,c as m,f as h,g,h as _,i as v,l as te,m as ne,mt as re,n as y,o as b,p as x,qn as ie,r as S,s as C,t as w,u as T}from"./chart-palette-preview-mx2Ttmwj.js";import{a as E,c as ae,i as D,l as O,n as k,o as A,r as j,s as M,t as N,u as P}from"./bar-rectangle-DxAj89YO.js";import{l as oe,n as F,t as se}from"./data-DmlxDJ6U.js";function I({id:e,dataKey:t,layout:n,patternIndex:r,color:i,onClick:a}){return(0,L.jsx)(M,{dataKey:t,fill:i,onClick:a,shape:t=>(0,L.jsx)(ee,{...t,fill:`url(#${e}-bar-pattern-${r})`,style:a?{cursor:`pointer`}:void 0}),radius:2,children:(0,L.jsx)(re,{dataKey:t,className:`fill-foreground`,fontSize:12,position:n==`horizontal`?`top`:`middle`,style:a?{cursor:`pointer`}:void 0})})}var L;function R(){return(R=e((()=>{ae(),f(),ie(),L=r(),I.__docgenInfo={description:`Bar + Label

Pattern is created with palettes/chart-palette and loaded through
the fill prop. Bars are grouped by series.
Each series uses the same color across every category.
color is set on the Bar so the legend swatch matches the pattern.

     ▓▒
     ▓▒          ▒░
     ▓▒          ▒░
     ▓▒ ▒░       ▒░ ▓▒
     ▓▒ ▒░ ▓▒ ▒░ ▒░ ▓▒
     ──    ──    ──`,methods:[],displayName:`GroupedBarRectangle`,props:{id:{required:!0,tsType:{name:`string`},description:``},dataKey:{required:!0,tsType:{name:`string`},description:``},layout:{required:!0,tsType:{name:`union`,raw:`'horizontal' | 'vertical'`,elements:[{name:`literal`,value:`'horizontal'`},{name:`literal`,value:`'vertical'`}]},description:``},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(data: any) => void`,signature:{arguments:[{type:{name:`any`},name:`data`}],return:{name:`void`}}},description:``},patternIndex:{required:!0,tsType:{name:`number`},description:``},color:{required:!0,tsType:{name:`string`},description:``}}}})))()}function z({axis:e,bars:t,colorblindMode:n=!0,onClick:r,tooltip:i,data:a}){let o=(0,B.useId)(),s=C(a),c=T(e,t);return(0,V.jsx)(h,{config:c,children:(0,V.jsxs)(E,{accessibilityLayer:!0,data:s,layout:`horizontal`,margin:{bottom:12,left:6},children:[(0,V.jsx)(S,{id:o,data:s,colorblindMode:n}),(0,V.jsx)(O,{}),(0,V.jsx)(j,{axis:e,layout:`horizontal`}),t.map((e,t)=>(0,V.jsx)(I,{dataKey:e,id:o,layout:`horizontal`,patternIndex:t,onClick:r,color:`var(--color-${p[t%p.length]}-400)`},e)),(0,V.jsx)(_,{isAnimationActive:!1,content:({active:e,payload:t})=>!e||!t?.length?null:(0,V.jsx)(`div`,{className:`rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl`,children:i(t[0].payload)})}),(0,V.jsx)(x,{verticalAlign:`top`,content:(0,V.jsx)(ne,{})})]})})}var B,V;function H(){return(H=e((()=>{B=n(),A(),P(),d(),D(),m(),b(),v(),R(),V=r(),z.__docgenInfo={description:`Horizontal bar chart with grouped (side-by-side) series per category.

"bars" is used to generate the dataKey

    ■ test 1  ■ test 2
    │  ▓▒
    │  ▓▒
    │  ▓▒          ▓▒
    │  ▓▒    ▓▒    ▓▒
    │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
    └─────────────────────
       Lbl   Lbl2  Lbl3


ChartTooltipContent is not used since we need the complete context to
render the custom tooltip.`,methods:[],displayName:`GroupedVerticalBarChart`,props:{axis:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  x: Axis;
  y: Axis;
}`,signature:{properties:[{key:`x`,value:{name:`signature`,type:`object`,raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:`dataKey`,value:{name:`string`,required:!0}},{key:`tickFormatter`,value:{name:`signature`,type:`function`,raw:`(value: string) => string`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`string`}},required:!1}},{key:`label`,value:{name:`string`,required:!0}},{key:`width`,value:{name:`number`,required:!1}}]},required:!0}},{key:`y`,value:{name:`signature`,type:`object`,raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:`dataKey`,value:{name:`string`,required:!0}},{key:`tickFormatter`,value:{name:`signature`,type:`function`,raw:`(value: string) => string`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`string`}},required:!1}},{key:`label`,value:{name:`string`,required:!0}},{key:`width`,value:{name:`number`,required:!1}}]},required:!0}}]}},description:``},data:{required:!0,tsType:{name:`ReadonlyArray`,elements:[{name:`T`}],raw:`ReadonlyArray<T>`},description:``},colorblindMode:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(data: any) => void`,signature:{arguments:[{type:{name:`any`},name:`data`}],return:{name:`void`}}},description:``},tooltip:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(payload: ChartTooltipPayload) => ReactNode`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:`count`,value:{name:`number`,required:!0}},{key:`patternIndex`,value:{name:`number`,required:!0}},{key:{name:`string`},value:{name:`union`,raw:`string | number`,elements:[{name:`string`},{name:`number`}],required:!0}}]}},name:`payload`}],return:{name:`ReactNode`}}},description:``},bars:{required:!0,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``}}}})))()}function U({axis:e,colorblindMode:t=!0,data:n,onClick:r,tooltip:i}){let a=(0,W.useId)(),o=C(n),s=te(e);return(0,G.jsx)(h,{config:s,children:(0,G.jsxs)(E,{accessibilityLayer:!0,data:o,layout:`horizontal`,margin:{bottom:12,left:6},children:[(0,G.jsx)(S,{id:a,data:o,colorblindMode:t}),(0,G.jsx)(O,{}),(0,G.jsx)(j,{axis:e,layout:`horizontal`}),(0,G.jsx)(N,{dataKey:`count`,id:a,layout:`horizontal`,onClick:r}),(0,G.jsx)(_,{isAnimationActive:!1,content:(0,G.jsx)(g,{hideLabel:!0,formatter:(e,t,n,r,a)=>i(a)})})]})})}var W,G;function K(){return(K=e((()=>{W=n(),A(),P(),d(),D(),m(),b(),v(),k(),G=r(),U.__docgenInfo={description:`Vertical bar chart with a single series, one bar per category.

Value (number) must always use "count" key

    │  ▓▒
    │  ▓▒
    │  ▓▒          ▓▒
    │  ▓▒    ▓▒    ▓▒
    │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
    └─────────────────────
       Lbl   Lbl2  Lbl3`,methods:[],displayName:`VerticalBarChart`,props:{axis:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  x: Axis;
  y: Axis;
}`,signature:{properties:[{key:`x`,value:{name:`signature`,type:`object`,raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:`dataKey`,value:{name:`string`,required:!0}},{key:`tickFormatter`,value:{name:`signature`,type:`function`,raw:`(value: string) => string`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`string`}},required:!1}},{key:`label`,value:{name:`string`,required:!0}},{key:`width`,value:{name:`number`,required:!1}}]},required:!0}},{key:`y`,value:{name:`signature`,type:`object`,raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:`dataKey`,value:{name:`string`,required:!0}},{key:`tickFormatter`,value:{name:`signature`,type:`function`,raw:`(value: string) => string`,signature:{arguments:[{type:{name:`string`},name:`value`}],return:{name:`string`}},required:!1}},{key:`label`,value:{name:`string`,required:!0}},{key:`width`,value:{name:`number`,required:!1}}]},required:!0}}]}},description:``},data:{required:!0,tsType:{name:`ReadonlyArray`,elements:[{name:`T`}],raw:`ReadonlyArray<T>`},description:``},colorblindMode:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},onClick:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(data: any) => void`,signature:{arguments:[{type:{name:`any`},name:`data`}],return:{name:`void`}}},description:``},tooltip:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(payload: ChartTooltipPayload) => ReactNode`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:`count`,value:{name:`number`,required:!0}},{key:`patternIndex`,value:{name:`number`,required:!0}},{key:{name:`string`},value:{name:`union`,raw:`string | number`,elements:[{name:`string`},{name:`number`}],required:!0}}]}},name:`payload`}],return:{name:`ReactNode`}}},description:``}}}})))()}var ce=t({Default:()=>Z,__namedExportsOrder:()=>Q,ageAtFirstEngagementFKProps:()=>J,ageAtFirstEngagementIncludeProps:()=>Y,default:()=>X}),q,J,Y,X,Z,Q;function $(){return($=e((()=>{H(),K(),y(),l(),i(),oe(),q=r(),J={axis:{x:{dataKey:`age`,label:`Age at First Patient Engagement (years)`},y:{dataKey:`count`,label:`# of participants`}},data:F,onClick:e=>{console.warn(`data`,e)},tooltip:e=>(0,q.jsxs)(`div`,{className:`flex gap-2 items-center`,children:[(0,q.jsx)(w,{patternIndex:e.patternIndex}),`Participants `,e.count]})},Y={axis:{x:{dataKey:`age`,label:`Age at First Patient Engagement (years)`},y:{dataKey:`trisomy`,label:`# of participants`}},bars:[`trisomy`,`disomy`],data:se,onClick:e=>{console.warn(`data`,e)},tooltip:e=>(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{className:`flex gap-2 items-center`,children:[(0,q.jsx)(w,{patternIndex:0}),`Participants: `,e.trisomy]}),(0,q.jsxs)(`div`,{className:`flex gap-2 items-center`,children:[(0,q.jsx)(w,{patternIndex:1}),`Participants: `,e.disomy]})]})},X={title:`Components/Charts/Vertical Bar Chart`,component:U,args:J},Z={render:()=>(0,q.jsxs)(a,{title:`Vertical Bar chart`,children:[(0,q.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,q.jsxs)(u,{className:`w-full`,children:[(0,q.jsx)(o,{children:(0,q.jsx)(c,{children:`Age At First Engagement`})}),(0,q.jsx)(s,{children:(0,q.jsx)(U,{...J})})]}),(0,q.jsxs)(u,{className:`w-full`,children:[(0,q.jsx)(o,{children:(0,q.jsx)(c,{children:`Age At First Engagement (Grouped)`})}),(0,q.jsx)(s,{children:(0,q.jsx)(z,{...Y})})]})]}),(0,q.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,q.jsxs)(u,{className:`w-full`,children:[(0,q.jsx)(o,{children:(0,q.jsx)(c,{children:`Age At First Engagement (colorblindMode off)`})}),(0,q.jsx)(s,{children:(0,q.jsx)(U,{...J,colorblindMode:!1})})]}),(0,q.jsxs)(u,{className:`w-full`,children:[(0,q.jsx)(o,{children:(0,q.jsx)(c,{children:`Age At First Engagement (colorblindMode off) (grouped)`})}),(0,q.jsx)(s,{children:(0,q.jsx)(z,{...Y,colorblindMode:!1})})]})]})]})},Q=[`ageAtFirstEngagementFKProps`,`ageAtFirstEngagementIncludeProps`,`Default`]})))()}export{U as a,H as c,ce as i,Y as n,K as o,$ as r,z as s,J as t};