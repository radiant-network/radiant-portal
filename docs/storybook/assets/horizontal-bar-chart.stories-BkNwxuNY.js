import{r as v,j as e}from"./iframe-BmQaEKqD.js";import{u as j,a as w,C as N,b as P,c as T,d as k,e as m}from"./chart-palette-preview-DjoJ5KbS.js";import{B as H,C as D,a as B,b as M}from"./bar-rectangle-DM33Fo3-.js";import{C as r,a as n,b as s,d as i}from"./card-avuAW3-U.js";import{a as K}from"./story-section-DmKrQ7pL.js";import{h as _,m as I,b as q,f as O}from"./data-CL6cuROM.js";function t({axis:a,data:C,colorblindMode:y=!0,onClick:h,tooltip:f}){const u=v.useId(),x=j(C),b=w(a);return e.jsx(N,{config:b,children:e.jsxs(H,{accessibilityLayer:!0,data:x,layout:"vertical",margin:{bottom:12,left:6},children:[e.jsx(P,{id:u,data:x,colorblindMode:y}),e.jsx(D,{}),e.jsx(B,{axis:a,layout:"vertical"}),e.jsx(M,{dataKey:"count",id:u,layout:"vertical",onClick:h}),e.jsx(T,{isAnimationActive:!1,content:e.jsx(k,{hideLabel:!0,formatter:(F,A,L,R,g)=>f(g)})})]})})}t.__docgenInfo={description:`Horizontal bar chart with a single series, one bar per category.

Value (number) must always use "count" key

    │ Lbl  ▓▒▓▒▓▒▓▒▓▒▓▒
    │ Lbl2 ▓▒▓▒▓▒▓▒
    │ Lbl3 ▓▒▓▒▓▒▓▒▓▒
    │ Lbl4 ▓▒▓▒
    │ Lbl5 ▓▒▓▒▓▒
    └─────────────────────`,methods:[],displayName:"HorizontalBarChart",props:{axis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"count",value:{name:"number",required:!0}},{key:"patternIndex",value:{name:"number",required:!0}},{key:{name:"string"},value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}},name:"payload"}],return:{name:"ReactNode"}}},description:""}}};const l={axis:{x:{dataKey:"count",label:"# of participants"},y:{dataKey:"hpo_id",width:210,tickFormatter:a=>a.replace(/\(HP:\d+\)/g,""),label:"Diagnosis (HPO)"}},data:_,onClick:a=>{console.warn("data",a)},tooltip:a=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"m-1",children:e.jsx(m,{patternIndex:a.patternIndex})}),e.jsxs("div",{className:"flex-1",children:[a.hpo_id,e.jsxs("div",{children:["Participants with this exact term: ",a.count]}),e.jsxs("div",{children:["Participants including descendant term: ",a.countWithDescendant]})]})]})},d={axis:{x:{dataKey:"count",label:"# of participants"},y:{dataKey:"mondo_id",width:180,tickFormatter:a=>a.replace(/\(MONDO:\d+\)/g,""),label:"Diagnosis (MONDO)"}},data:I,onClick:a=>{console.warn("data",a)},tooltip:a=>e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"m-1",children:e.jsx(m,{patternIndex:a.patternIndex})}),e.jsxs("div",{className:"flex-1",children:[a.mondo_id,e.jsxs("div",{children:["Participants with this exact term: ",a.count]}),e.jsxs("div",{children:["Participants including descendant term: ",a.countWithDescendant]})]})]})},o={axis:{x:{dataKey:"count",label:"# of files"},y:{dataKey:"key",width:180,label:"Data Types"}},data:O.slice(0,10),tooltip:a=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(m,{patternIndex:a.patternIndex}),a.key," ",e.jsx("span",{className:"font-bold",children:a.count})]})},c={axis:{x:{dataKey:"count",label:"# of biospecimens"},y:{dataKey:"key",width:140,label:"Sample Types"}},data:q.slice(0,10),tooltip:a=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx(m,{patternIndex:a.patternIndex}),a.key," ",e.jsx("span",{className:"font-bold",children:a.count})]})},z={title:"Components/Charts/Horizontal Bar Chart",component:t,args:l},p={render:()=>e.jsxs(K,{title:"Horizontal Bar chart",children:[e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"HPO (Clickable)"})}),e.jsx(i,{children:e.jsx(t,{...l})})]}),e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Mondo (Clickable)"})}),e.jsx(i,{children:e.jsx(t,{...d})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"HPO (colorblindMode off) (clickable)"})}),e.jsx(i,{children:e.jsx(t,{...l,colorblindMode:!1})})]}),e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Mondo (colorblindMode off) (clickable)"})}),e.jsx(i,{children:e.jsx(t,{...d,colorblindMode:!1})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Files By Data Types"})}),e.jsx(i,{children:e.jsx(t,{...o})})]}),e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Biospecimens"})}),e.jsx(i,{children:e.jsx(t,{...c})})]})]}),e.jsxs("div",{className:"w-full flex gap-6",children:[e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Files By Data Types (colorblindMode off)"})}),e.jsx(i,{children:e.jsx(t,{...o,colorblindMode:!1})})]}),e.jsxs(r,{className:"w-full",children:[e.jsx(n,{children:e.jsx(s,{children:"Biospecimens (colorblindMode off)"})}),e.jsx(i,{children:e.jsx(t,{...c,colorblindMode:!1})})]})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'count',
      label: '# of participants'
    },
    y: {
      dataKey: 'hpo_id',
      width: 210,
      tickFormatter: (value: string) => value.replace(/\\(HP:\\d+\\)/g, ''),
      label: 'Diagnosis (HPO)'
    }
  },
  data: hpoData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => <div className="flex gap-2">
      <div className="m-1">
        <ChartPalettePreview patternIndex={payload.patternIndex} />
      </div>
      <div className="flex-1">
        {payload.hpo_id}
        <div>Participants with this exact term: {payload.count}</div>
        <div>Participants including descendant term: {payload.countWithDescendant}</div>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'count',
      label: '# of participants'
    },
    y: {
      dataKey: 'mondo_id',
      width: 180,
      tickFormatter: (value: string) => value.replace(/\\(MONDO:\\d+\\)/g, ''),
      label: 'Diagnosis (MONDO)'
    }
  },
  data: mondoData,
  onClick: (data: any) => {
    console.warn('data', data);
  },
  tooltip: (payload: ChartTooltipPayload) => <div className="flex gap-2">
      <div className="m-1">
        <ChartPalettePreview patternIndex={payload.patternIndex} />
      </div>
      <div className="flex-1">
        {payload.mondo_id}
        <div>Participants with this exact term: {payload.count}</div>
        <div>Participants including descendant term: {payload.countWithDescendant}</div>
      </div>
    </div>
}`,...d.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'count',
      label: '# of files'
    },
    y: {
      dataKey: 'key',
      width: 180,
      label: 'Data Types'
    }
  },
  data: filesByDataTypesData.slice(0, 10),
  tooltip: (payload: ChartTooltipPayload) => <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.key} <span className="font-bold">{payload.count}</span>
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  axis: {
    x: {
      dataKey: 'count',
      label: '# of biospecimens'
    },
    y: {
      dataKey: 'key',
      width: 140,
      label: 'Sample Types'
    }
  },
  data: biospecimensData.slice(0, 10),
  tooltip: (payload: ChartTooltipPayload) => <div className="flex gap-2 items-center">
      <ChartPalettePreview patternIndex={payload.patternIndex} />
      {payload.key} <span className="font-bold">{payload.count}</span>
    </div>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Horizontal Bar chart">
      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>HPO (Clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...hpoProps} />
          </CardContent>
        </Card>
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Mondo (Clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...mondoProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>HPO (colorblindMode off) (clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...hpoProps} colorblindMode={false} />
          </CardContent>
        </Card>
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Mondo (colorblindMode off) (clickable)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...mondoProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Files By Data Types</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...filesByDataTypesProps} />
          </CardContent>
        </Card>
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Biospecimens</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...biospecimensProps} />
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6">
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Files By Data Types (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...filesByDataTypesProps} colorblindMode={false} />
          </CardContent>
        </Card>
        <Card className={\`w-full\`}>
          <CardHeader>
            <CardTitle>Biospecimens (colorblindMode off)</CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart {...biospecimensProps} colorblindMode={false} />
          </CardContent>
        </Card>
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}};const S=["hpoProps","mondoProps","filesByDataTypesProps","biospecimensProps","Default"],U=Object.freeze(Object.defineProperty({__proto__:null,Default:p,__namedExportsOrder:S,biospecimensProps:c,default:z,filesByDataTypesProps:o,hpoProps:l,mondoProps:d},Symbol.toStringTag,{value:"Module"}));export{t as H,U as a,l as h,d as m};
