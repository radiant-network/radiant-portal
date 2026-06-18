import{j as e,r as w}from"./iframe-B_jnDYRw.js";import{aC as K,aD as P,u as q,aE as V,C as k,b as A,aF as v,c as T,aG as L,aH as R,a as _,d as z,aI as G,aJ as H,e as x}from"./data-DPo_6grm.js";import{c as M,B as F,C as N,a as E,b as S}from"./bar-rectangle-Bxvqe7c9.js";import{C as c,a as m,b as g,d as p}from"./card-D8DmygJj.js";import{a as D}from"./story-section-4RqDghQR.js";import"./preload-helper-PPVm8Dsz.js";import"./with-selector-n1HbI5W4.js";import"./index-BLQqHNw6.js";import"./separator-C2WPDGRO.js";import"./index-DfeYIiAg.js";function B({id:r,dataKey:t,layout:s,patternIndex:o,color:l,onClick:a}){return e.jsx(M,{dataKey:t,fill:l,onClick:a,shape:n=>e.jsx(P,{...n,fill:`url(#${r}-bar-pattern-${o})`,style:a?{cursor:"pointer"}:void 0}),radius:2,children:e.jsx(K,{dataKey:t,className:"fill-foreground",fontSize:12,position:s=="horizontal"?"top":"middle",style:a?{cursor:"pointer"}:void 0})})}B.__docgenInfo={description:`Bar + Label

Pattern is created with palettes/chart-palette and loaded through
the fill prop. Bars are grouped by series.
Each series uses the same color across every category.
color is set on the Bar so the legend swatch matches the pattern.

     ▓▒
     ▓▒          ▒░
     ▓▒          ▒░
     ▓▒ ▒░       ▒░ ▓▒
     ▓▒ ▒░ ▓▒ ▒░ ▒░ ▓▒
     ──    ──    ──`,methods:[],displayName:"GroupedBarRectangle",props:{id:{required:!0,tsType:{name:"string"},description:""},dataKey:{required:!0,tsType:{name:"string"},description:""},layout:{required:!0,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},patternIndex:{required:!0,tsType:{name:"number"},description:""},color:{required:!0,tsType:{name:"string"},description:""}}};function f({axis:r,bars:t,colorblindMode:s=!0,onClick:o,tooltip:l,data:a}){const n=w.useId(),u=q(a),b=V(r,t);return e.jsx(k,{config:b,children:e.jsxs(F,{accessibilityLayer:!0,data:u,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(A,{id:n,data:u,colorblindMode:s}),e.jsx(N,{}),e.jsx(E,{axis:r,layout:"horizontal"}),t.map((d,i)=>e.jsx(B,{dataKey:d,id:n,layout:"horizontal",patternIndex:i,onClick:o,color:`var(--color-${v[i%v.length]}-400)`},d)),e.jsx(T,{isAnimationActive:!1,content:({active:d,payload:i})=>!d||!i?.length?null:e.jsx("div",{className:"rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",children:l(i[0].payload)})}),e.jsx(L,{verticalAlign:"top",content:e.jsx(R,{})})]})})}f.__docgenInfo={description:`Horizontal bar chart with grouped (side-by-side) series per category.

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
render the custom tooltip.`,methods:[],displayName:"GroupedVerticalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}}]}},description:""},data:{required:!0,tsType:{name:"ReadonlyArray",elements:[{name:"T"}],raw:"ReadonlyArray<T>"},description:""},colorblindMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},tooltip:{required:!0,tsType:{name:"signature",type:"function",raw:"(payload: ChartTooltipPayload) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""},bars:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};function h({axis:r,colorblindMode:t=!0,data:s,onClick:o,tooltip:l}){const a=w.useId(),n=q(s),u=_(r);return e.jsx(k,{config:u,children:e.jsxs(F,{accessibilityLayer:!0,data:n,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(A,{id:a,data:n,colorblindMode:t}),e.jsx(N,{}),e.jsx(E,{axis:r,layout:"horizontal"}),e.jsx(S,{dataKey:"count",id:a,layout:"horizontal",onClick:o}),e.jsx(T,{isAnimationActive:!1,content:e.jsx(z,{hideLabel:!0,formatter:(b,d,i,$,I)=>l(I)})})]})})}h.__docgenInfo={description:`Vertical bar chart with a single series, one bar per category.

Value (number) must always use "count" key

    │  ▓▒
    │  ▓▒
    │  ▓▒          ▓▒
    │  ▓▒    ▓▒    ▓▒
    │  ▓▒ ▓▒ ▓▒ ▓▒ ▓▒ ▓▒
    └─────────────────────
       Lbl   Lbl2  Lbl3`,methods:[],displayName:"VerticalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"dataKey",value:{name:"string",required:!0}},{key:"tickFormatter",value:{name:"signature",type:"function",raw:"(value: string) => string",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"string"}},required:!1}},{key:"label",value:{name:"string",required:!0}},{key:"width",value:{name:"number",required:!1}}]},required:!0}}]}},description:""},data:{required:!0,tsType:{name:"ReadonlyArray",elements:[{name:"T"}],raw:"ReadonlyArray<T>"},description:""},colorblindMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},tooltip:{required:!0,tsType:{name:"signature",type:"function",raw:"(payload: ChartTooltipPayload) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  count: number;
  patternIndex: number;
  [key: string]: string | number;
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};const C={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"count",label:"# of participants"}},data:G,onClick:r=>{console.warn("data",r)},tooltip:r=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(x,{patternIndex:r.patternIndex}),"Participants ",r.count]})},j={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"trisomy",label:"# of participants"}},bars:["trisomy","disomy"],data:H,onClick:r=>{console.warn("data",r)},tooltip:r=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(x,{patternIndex:0}),"Participants: ",r.trisomy]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(x,{patternIndex:1}),"Participants: ",r.disomy]})]})},ae={title:"Components/Charts/Vertical Bar Chart",component:h,args:C},y={render:()=>e.jsxs(D,{title:"Vertical Bar chart",children:[e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(c,{className:"w-full",children:[e.jsx(m,{children:e.jsx(g,{children:"Age At First Engagement"})}),e.jsx(p,{children:e.jsx(h,{...C})})]}),e.jsxs(c,{className:"w-full",children:[e.jsx(m,{children:e.jsx(g,{children:"Age At First Engagement (Grouped)"})}),e.jsx(p,{children:e.jsx(f,{...j})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(c,{className:"w-full",children:[e.jsx(m,{children:e.jsx(g,{children:"Age At First Engagement (colorblindMode off)"})}),e.jsx(p,{children:e.jsx(h,{...C,colorblindMode:!1})})]}),e.jsxs(c,{className:"w-full",children:[e.jsx(m,{children:e.jsx(g,{children:"Age At First Engagement (colorblindMode off) (grouped)"})}),e.jsx(p,{children:e.jsx(f,{...j,colorblindMode:!1})})]})]})]})};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Vertical Bar chart">
      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Age At First Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart {...ageAtFirstEngagementFKProps} />
          </CardContent>
        </Card>

        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (Grouped)</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <VerticalBarChart {...ageAtFirstEngagementFKProps} colorblindMode={false} />
          </CardContent>
        </Card>

        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Age At First Engagement (colorblindMode off) (grouped)</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupedVerticalBarChart {...ageAtFirstEngagementIncludeProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
}`,...y.parameters?.docs?.source}}};const te=["Default"];export{y as Default,te as __namedExportsOrder,ae as default};
