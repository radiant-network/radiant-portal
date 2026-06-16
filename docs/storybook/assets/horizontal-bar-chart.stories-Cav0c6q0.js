import{r as j,j as e}from"./iframe-D5nbMH0Z.js";import{C as u,a as m,b as c,d as g}from"./card-CIkGWAo4.js";import{a as E}from"./story-section-DfWRQdTn.js";import{u as w,a as H,C as q,B as A,b as k,c as T,d as F,e as I,f as N,g as K,h as P,L,R,i as _,j as b,k as G,l as M,m as S,n as D,o as h}from"./chart-palette-preview-CME-yhjj.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-DOf7FV04.js";import"./index-Cc9ovpm8.js";import"./with-selector-BoxiSPNm.js";import"./index-CJ_W4xqL.js";function y({axis:r,colorblindMode:t=!0,data:s,tooltip:o}){const n=j.useId(),a=w(s),d=H(r);return e.jsx(q,{config:d,children:e.jsxs(A,{accessibilityLayer:!0,data:a,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(k,{id:n,data:a,colorblindMode:t}),e.jsx(T,{}),e.jsx(F,{axis:r,layout:"horizontal"}),e.jsx(I,{dataKey:"count",id:n,layout:"horizontal"}),e.jsx(N,{isAnimationActive:!1,content:e.jsx(K,{hideLabel:!0,formatter:(C,l,i,$,B)=>o(B)})})]})})}y.__docgenInfo={description:`Horizontal bar chart with a single series, one bar per category.

    │  ▓▒
    │  ▓▒
    │  ▓▒          ▓▒
    │  ▓▒    ▓▒    ▓▒
    │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
    └─────────────────────
       Lbl   Lbl2  Lbl3`,methods:[],displayName:"HorizontalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  x: Axis;
  y: Axis;
}`,signature:{properties:[{key:"x",value:{name:"signature",type:"object",raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}},{key:"y",value:{name:"signature",type:"object",raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}}]}},description:""},bars:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},data:{required:!0,tsType:{name:"ReadonlyArray",elements:[{name:"T"}],raw:"ReadonlyArray<T>"},description:""},colorblindMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},tooltip:{required:!0,tsType:{name:"signature",type:"function",raw:"(payload: ChartTooltipPayload) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};function z({id:r,dataKey:t,layout:s,patternIndex:o,color:n}){return e.jsx(P,{dataKey:t,fill:n,shape:a=>e.jsx(R,{...a,fill:`url(#${r}-bar-pattern-${o})`}),radius:2,children:e.jsx(L,{dataKey:t,className:"fill-foreground",fontSize:12,position:s=="horizontal"?"top":"middle"})})}z.__docgenInfo={description:`Bar + Label

Pattern is created with palettes/chart-palette and loaded through
the fill prop. Bars are grouped by series.
Each series uses the same color across every category.
color is set on the Bar so the legend swatch matches the pattern.

     ▓▒
     ▓▒          ▒░
     ▓▒          ▒░
     ▓▒ ▒░       ▒░ ▓▒
     ▓▒ ▒░ ▓▒ ▒░ ▒░ ▓▒
     ──    ──    ──`,methods:[],displayName:"GroupedBarRectangle",props:{id:{required:!0,tsType:{name:"string"},description:""},dataKey:{required:!0,tsType:{name:"string"},description:""},layout:{required:!0,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},patternIndex:{required:!0,tsType:{name:"number"},description:""},color:{required:!0,tsType:{name:"string"},description:""}}};function f({axis:r,bars:t,colorblindMode:s=!0,tooltip:o,data:n}){const a=j.useId(),d=w(n),C=_(r,t);return e.jsx(q,{config:C,children:e.jsxs(A,{accessibilityLayer:!0,data:d,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(k,{id:a,data:d,colorblindMode:s}),e.jsx(T,{}),e.jsx(F,{axis:r,layout:"horizontal"}),t.map((l,i)=>e.jsx(z,{dataKey:l,id:a,layout:"horizontal",patternIndex:i,color:`var(--color-${b[i%b.length]}-400)`},l)),e.jsx(N,{isAnimationActive:!1,content:({active:l,payload:i})=>!l||!i?.length?null:e.jsx("div",{className:"rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",children:o(i[0].payload)})}),e.jsx(G,{verticalAlign:"top",content:e.jsx(M,{})})]})})}f.__docgenInfo={description:`Horizontal bar chart with grouped (side-by-side) series per category.

    ■ test 1  ■ test 2
    │  ▓▒
    │  ▓▒
    │  ▓▒          ▓▒
    │  ▓▒    ▓▒    ▓▒
    │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
    └─────────────────────
       Lbl   Lbl2  Lbl3


ChartTooltipContent is not used since we need the complete context to
render the custom tooltip.`,methods:[],displayName:"GroupedHorizontalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  x: Axis;
  y: Axis;
}`,signature:{properties:[{key:"x",value:{name:"signature",type:"object",raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}},{key:"y",value:{name:"signature",type:"object",raw:`{
  dataKey: string;
  tickFormatter?: (value: string) => string;
  label: string;
  width?: number;
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}}]}},description:""},bars:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},data:{required:!0,tsType:{name:"ReadonlyArray",elements:[{name:"T"}],raw:"ReadonlyArray<T>"},description:""},colorblindMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},tooltip:{required:!0,tsType:{name:"signature",type:"function",raw:"(payload: ChartTooltipPayload) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};const x={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"count",label:"# of participants"}},data:S,tooltip:r=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(h,{patternIndex:r.patternIndex}),"Participants ",r.count]})},v={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"trisomy",label:"# of participants"}},bars:["trisomy","disomy"],data:D,tooltip:r=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(h,{patternIndex:0}),"Participants: ",r.trisomy]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(h,{patternIndex:1}),"Participants: ",r.disomy]})]})},ee={title:"Components/Charts/Horizontal Bar Chart",component:y,args:x},p={render:()=>e.jsxs(E,{title:"Horizontal Bar chart",children:[e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(u,{className:"w-full",children:[e.jsx(m,{children:e.jsx(c,{children:"Age At First Engagement"})}),e.jsx(g,{children:e.jsx(y,{...x})})]}),e.jsxs(u,{className:"w-full",children:[e.jsx(m,{children:e.jsx(c,{children:"Age At First Engagement (Grouped)"})}),e.jsx(g,{children:e.jsx(f,{...v})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(u,{className:"w-full",children:[e.jsx(m,{children:e.jsx(c,{children:"Age At First Engagement (colorblindMode off)"})}),e.jsx(g,{children:e.jsx(y,{...x,colorblindMode:!1})})]}),e.jsxs(u,{className:"w-full",children:[e.jsx(m,{children:e.jsx(c,{children:"Age At First Engagement (colorblindMode off) (grouped)"})}),e.jsx(g,{children:e.jsx(f,{...v,colorblindMode:!1})})]})]})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <StorySection title="Horizontal Bar chart">
        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Age At First Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart {...ageAtFirstEngagementFKProps} />
            </CardContent>
          </Card>

          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (Grouped)</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupedHorizontalBarChart {...ageAtFirstEngagementIncludeProps} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (colorblindMode off)</CardTitle>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart {...ageAtFirstEngagementFKProps} colorblindMode={false} />
            </CardContent>
          </Card>

          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Age At First Engagement (colorblindMode off) (grouped)</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupedHorizontalBarChart {...ageAtFirstEngagementIncludeProps} colorblindMode={false} />
            </CardContent>
          </Card>
        </div>
      </StorySection>;
  }
}`,...p.parameters?.docs?.source}}};const re=["Default"];export{p as Default,re as __namedExportsOrder,ee as default};
