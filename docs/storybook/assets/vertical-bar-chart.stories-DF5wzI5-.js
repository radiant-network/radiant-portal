import{j as e,r as w}from"./iframe-C5ghdKPC.js";import{aZ as K,a_ as B,u as A,bx as _,C as k,b as q,by as j,c as F,bz as V,bA as L,a as z,d as R,e as b}from"./chart-palette-preview-BPPdWvtw.js";import{c as S,B as T,C as P,a as E,b as G}from"./bar-rectangle-C1nF0ggX.js";import{C as p,a as y,b as h,d as x}from"./card-C8RPW6UK.js";import{a as M}from"./story-section-CLlhZcHq.js";import{n as H,o as D}from"./data-CGl4bGS9.js";function N({id:a,dataKey:n,layout:l,patternIndex:d,color:u,onClick:t}){return e.jsx(S,{dataKey:n,fill:u,onClick:t,shape:s=>e.jsx(B,{...s,fill:`url(#${a}-bar-pattern-${d})`,style:t?{cursor:"pointer"}:void 0}),radius:2,children:e.jsx(K,{dataKey:n,className:"fill-foreground",fontSize:12,position:l=="horizontal"?"top":"middle",style:t?{cursor:"pointer"}:void 0})})}N.__docgenInfo={description:`Bar + Label

Pattern is created with palettes/chart-palette and loaded through
the fill prop. Bars are grouped by series.
Each series uses the same color across every category.
color is set on the Bar so the legend swatch matches the pattern.

     ▓▒
     ▓▒          ▒░
     ▓▒          ▒░
     ▓▒ ▒░       ▒░ ▓▒
     ▓▒ ▒░ ▓▒ ▒░ ▒░ ▓▒
     ──    ──    ──`,methods:[],displayName:"GroupedBarRectangle",props:{id:{required:!0,tsType:{name:"string"},description:""},dataKey:{required:!0,tsType:{name:"string"},description:""},layout:{required:!0,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"(data: any) => void",signature:{arguments:[{type:{name:"any"},name:"data"}],return:{name:"void"}}},description:""},patternIndex:{required:!0,tsType:{name:"number"},description:""},color:{required:!0,tsType:{name:"string"},description:""}}};function C({axis:a,bars:n,colorblindMode:l=!0,onClick:d,tooltip:u,data:t}){const s=w.useId(),g=A(t),v=_(a,n);return e.jsx(k,{config:v,children:e.jsxs(T,{accessibilityLayer:!0,data:g,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(q,{id:s,data:g,colorblindMode:l}),e.jsx(P,{}),e.jsx(E,{axis:a,layout:"horizontal"}),n.map((c,o)=>e.jsx(N,{dataKey:c,id:s,layout:"horizontal",patternIndex:o,onClick:d,color:`var(--color-${j[o%j.length]}-400)`},c)),e.jsx(F,{isAnimationActive:!1,content:({active:c,payload:o})=>!c||!o?.length?null:e.jsx("div",{className:"rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",children:u(o[0].payload)})}),e.jsx(V,{verticalAlign:"top",content:e.jsx(L,{})})]})})}C.__docgenInfo={description:`Horizontal bar chart with grouped (side-by-side) series per category.

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
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""},bars:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};function f({axis:a,colorblindMode:n=!0,data:l,onClick:d,tooltip:u}){const t=w.useId(),s=A(l),g=z(a);return e.jsx(k,{config:g,children:e.jsxs(T,{accessibilityLayer:!0,data:s,layout:"horizontal",margin:{bottom:12,left:6},children:[e.jsx(q,{id:t,data:s,colorblindMode:n}),e.jsx(P,{}),e.jsx(E,{axis:a,layout:"horizontal"}),e.jsx(G,{dataKey:"count",id:t,layout:"horizontal",onClick:d}),e.jsx(F,{isAnimationActive:!1,content:e.jsx(R,{hideLabel:!0,formatter:(v,c,o,Z,I)=>u(I)})})]})})}f.__docgenInfo={description:`Vertical bar chart with a single series, one bar per category.

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
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};const r={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"count",label:"# of participants"}},data:H,onClick:a=>{console.warn("data",a)},tooltip:a=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(b,{patternIndex:a.patternIndex}),"Participants ",a.count]})},i={axis:{x:{dataKey:"age",label:"Age at First Patient Engagement (years)"},y:{dataKey:"trisomy",label:"# of participants"}},bars:["trisomy","disomy"],data:D,onClick:a=>{console.warn("data",a)},tooltip:a=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(b,{patternIndex:0}),"Participants: ",a.trisomy]}),e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(b,{patternIndex:1}),"Participants: ",a.disomy]})]})},O={title:"Components/Charts/Vertical Bar Chart",component:f,args:r},m={render:()=>e.jsxs(M,{title:"Vertical Bar chart",children:[e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(p,{className:"w-full",children:[e.jsx(y,{children:e.jsx(h,{children:"Age At First Engagement"})}),e.jsx(x,{children:e.jsx(f,{...r})})]}),e.jsxs(p,{className:"w-full",children:[e.jsx(y,{children:e.jsx(h,{children:"Age At First Engagement (Grouped)"})}),e.jsx(x,{children:e.jsx(C,{...i})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(p,{className:"w-full",children:[e.jsx(y,{children:e.jsx(h,{children:"Age At First Engagement (colorblindMode off)"})}),e.jsx(x,{children:e.jsx(f,{...r,colorblindMode:!1})})]}),e.jsxs(p,{className:"w-full",children:[e.jsx(y,{children:e.jsx(h,{children:"Age At First Engagement (colorblindMode off) (grouped)"})}),e.jsx(x,{children:e.jsx(C,{...i,colorblindMode:!1})})]})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'age',
      label: 'Age at First Patient Engagement (years)'
    },
    y: {
      dataKey: 'count',
      label: '# of participants'
    }
  },
  data: ageAtFirstEngagementKFData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      Participants {payload.count}
    </div>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'age',
      label: 'Age at First Patient Engagement (years)'
    },
    y: {
      dataKey: 'trisomy',
      label: '# of participants'
    }
  },
  bars: ['trisomy', 'disomy'],
  data: ageAtFirstEngagementIncludeData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => <div>
      <div className="flex gap-2 items-center">
        <ChartPalettePreview patternIndex={0} />
        Participants: {payload.trisomy}
      </div>
      <div className="flex gap-2 items-center">
        <ChartPalettePreview patternIndex={1} />
        Participants: {payload.disomy}
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const $=["ageAtFirstEngagementFKProps","ageAtFirstEngagementIncludeProps","Default"],ee=Object.freeze(Object.defineProperty({__proto__:null,Default:m,__namedExportsOrder:$,ageAtFirstEngagementFKProps:r,ageAtFirstEngagementIncludeProps:i,default:O},Symbol.toStringTag,{value:"Module"}));export{C as G,f as V,r as a,i as b,ee as v};
