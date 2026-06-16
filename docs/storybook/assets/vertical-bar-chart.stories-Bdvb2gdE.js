import{r as b,j as e}from"./iframe-D5nbMH0Z.js";import{u as v,a as w,C as N,B as T,b as k,c as B,d as P,e as H,f as M,g as D,p as q,q as V,o as d,r as K,s as I}from"./chart-palette-preview-CME-yhjj.js";import{C as n,a as t,b as s,d as i}from"./card-CIkGWAo4.js";import{a as _}from"./story-section-DfWRQdTn.js";import"./preload-helper-PPVm8Dsz.js";import"./with-selector-BoxiSPNm.js";import"./index-CJ_W4xqL.js";import"./separator-DOf7FV04.js";import"./index-Cc9ovpm8.js";function r({axis:a,data:x,colorblindMode:h=!0,onClick:f,tooltip:y}){const c=b.useId(),u=v(x),g=w(a);return e.jsx(N,{config:g,children:e.jsxs(T,{accessibilityLayer:!0,data:u,layout:"vertical",margin:{bottom:12,left:6},children:[e.jsx(k,{id:c,data:u,colorblindMode:h}),e.jsx(B,{}),e.jsx(P,{axis:a,layout:"vertical"}),e.jsx(H,{dataKey:"count",id:c,layout:"vertical",onClick:f}),e.jsx(M,{isAnimationActive:!1,content:e.jsx(D,{hideLabel:!0,formatter:(F,O,A,S,j)=>y(j)})})]})})}r.__docgenInfo={description:`Vertical bar chart with a single series, one bar per category.

    │ Lbl  ▓▒▓▒▓▒▓▒▓▒▓▒
    │ Lbl2 ▓▒▓▒▓▒▓▒
    │ Lbl3 ▓▒▓▒▓▒▓▒▓▒
    │ Lbl4 ▓▒▓▒
    │ Lbl5 ▓▒▓▒▓▒
    └─────────────────────`,methods:[],displayName:"VerticalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};const o={axis:{x:{dataKey:"count",label:"# of participants"},y:{dataKey:"hpo_id",width:210,tickFormatter:a=>a.replace(/\(HP:\d+\)/g,""),label:"Diagnosis (HPO)"}},data:q,onClick:a=>{console.log("data",a)},tooltip:a=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"m-1",children:e.jsx(d,{patternIndex:a.patternIndex})}),e.jsxs("div",{className:"flex-1",children:[a.hpo_id,e.jsxs("div",{children:["Participants with this exact term: ",a.count]}),e.jsxs("div",{children:["Participants including descendant term: ",a.countWithDescendant]})]})]})},m={axis:{x:{dataKey:"count",label:"# of participants"},y:{dataKey:"mondo_id",width:180,tickFormatter:a=>a.replace(/\(MONDO:\d+\)/g,""),label:"Diagnosis (MONDO)"}},data:V,onClick:a=>{console.log("data",a)},tooltip:a=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"m-1",children:e.jsx(d,{patternIndex:a.patternIndex})}),e.jsxs("div",{className:"flex-1",children:[a.mondo_id,e.jsxs("div",{children:["Participants with this exact term: ",a.count]}),e.jsxs("div",{children:["Participants including descendant term: ",a.countWithDescendant]})]})]})},p={axis:{x:{dataKey:"count",label:"# of files"},y:{dataKey:"key",width:180,label:"Data Types"}},data:K.slice(0,10),tooltip:a=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(d,{patternIndex:a.patternIndex}),a.key," ",e.jsx("span",{className:"font-bold",children:a.count})]})},C={axis:{x:{dataKey:"count",label:"# of biospecimens"},y:{dataKey:"key",width:140,label:"Sample Types"}},data:I.slice(0,10),tooltip:a=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(d,{patternIndex:a.patternIndex}),a.key," ",e.jsx("span",{className:"font-bold",children:a.count})]})},X={title:"Components/Charts/Vertical Bar Chart",component:r,args:o},l={render:()=>e.jsxs(_,{title:"Vertical Bar chart",children:[e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"HPO (Clickable)"})}),e.jsx(i,{children:e.jsx(r,{...o})})]}),e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Mondo (Clickable)"})}),e.jsx(i,{children:e.jsx(r,{...m})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"HPO (colorblindMode off) (clickable)"})}),e.jsx(i,{children:e.jsx(r,{...o,colorblindMode:!1})})]}),e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Mondo (colorblindMode off) (clickable)"})}),e.jsx(i,{children:e.jsx(r,{...m,colorblindMode:!1})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Files By Data Types"})}),e.jsx(i,{children:e.jsx(r,{...p})})]}),e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Biospecimens"})}),e.jsx(i,{children:e.jsx(r,{...C})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Files By Data Types (colorblindMode off)"})}),e.jsx(i,{children:e.jsx(r,{...p,colorblindMode:!1})})]}),e.jsxs(n,{className:"w-full",children:[e.jsx(t,{children:e.jsx(s,{children:"Biospecimens (colorblindMode off)"})}),e.jsx(i,{children:e.jsx(r,{...C,colorblindMode:!1})})]})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <StorySection title="Vertical Bar chart">
        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>HPO (Clickable)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...hpoProps} />
            </CardContent>
          </Card>
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Mondo (Clickable)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...mondoProps} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>HPO (colorblindMode off) (clickable)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...hpoProps} colorblindMode={false} />
            </CardContent>
          </Card>
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Mondo (colorblindMode off) (clickable)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...mondoProps} colorblindMode={false} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Files By Data Types</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...filesByDataTypesProps} />
            </CardContent>
          </Card>
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Biospecimens</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...biospecimensProps} />
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex gap-6">
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Files By Data Types (colorblindMode off)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...filesByDataTypesProps} colorblindMode={false} />
            </CardContent>
          </Card>
          <Card className={\`w-full\`}>
            <CardHeader>
              <CardTitle>Biospecimens (colorblindMode off)</CardTitle>
            </CardHeader>
            <CardContent>
              <VerticalBarChart {...biospecimensProps} colorblindMode={false} />
            </CardContent>
          </Card>
        </div>
      </StorySection>;
  }
}`,...l.parameters?.docs?.source}}};const Y=["Default"];export{l as Default,Y as __namedExportsOrder,X as default};
