import{n as e,r as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{a as o,n as s,o as c,s as l,t as u}from"./card-lDj02HnZ.js";import{_ as d,c as f,f as p,g as m,h,i as g,l as _,n as v,o as y,r as b,s as x,t as S}from"./chart-palette-preview-mx2Ttmwj.js";import{a as C,i as w,l as T,n as E,o as D,r as O,t as k,u as A}from"./bar-rectangle-DxAj89YO.js";import{c as j,l as M,r as N,s as P,u as F}from"./data-DmlxDJ6U.js";function I({axis:e,data:t,colorblindMode:n=!0,onClick:r,tooltip:i}){let a=(0,L.useId)(),o=x(t),s=_(e);return(0,R.jsx)(p,{config:s,children:(0,R.jsxs)(C,{accessibilityLayer:!0,data:o,layout:`vertical`,margin:{bottom:12,left:6},children:[(0,R.jsx)(b,{id:a,data:o,colorblindMode:n}),(0,R.jsx)(T,{}),(0,R.jsx)(O,{axis:e,layout:`vertical`}),(0,R.jsx)(k,{dataKey:`count`,id:a,layout:`vertical`,onClick:r}),(0,R.jsx)(h,{isAnimationActive:!1,content:(0,R.jsx)(m,{hideLabel:!0,formatter:(e,t,n,r,a)=>i(a)})})]})})}var L,R;function z(){return(z=e((()=>{L=n(),D(),A(),d(),w(),f(),y(),g(),E(),R=r(),I.__docgenInfo={description:`Horizontal bar chart with a single series, one bar per category.

Value (number) must always use "count" key

    │ Lbl  ▓▒▓▒▓▒▓▒▓▒▓▒
    │ Lbl2 ▓▒▓▒▓▒▓▒
    │ Lbl3 ▓▒▓▒▓▒▓▒▓▒
    │ Lbl4 ▓▒▓▒
    │ Lbl5 ▓▒▓▒▓▒
    └─────────────────────`,methods:[],displayName:`HorizontalBarChart`,props:{axis:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
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
}`,signature:{properties:[{key:`count`,value:{name:`number`,required:!0}},{key:`patternIndex`,value:{name:`number`,required:!0}},{key:{name:`string`},value:{name:`union`,raw:`string | number`,elements:[{name:`string`},{name:`number`}],required:!0}}]}},name:`payload`}],return:{name:`ReactNode`}}},description:``}}}})))()}var B=t({Default:()=>q,__namedExportsOrder:()=>J,biospecimensProps:()=>G,default:()=>K,filesByDataTypesProps:()=>W,hpoProps:()=>H,mondoProps:()=>U}),V,H,U,W,G,K,q,J;function Y(){return(Y=e((()=>{z(),v(),l(),i(),M(),V=r(),H={axis:{x:{dataKey:`count`,label:`# of participants`},y:{dataKey:`hpo_id`,width:210,tickFormatter:e=>e.replace(/\(HP:\d+\)/g,``),label:`Diagnosis (HPO)`}},data:j,onClick:e=>{console.warn(`data`,e)},tooltip:e=>(0,V.jsxs)(`div`,{className:`flex gap-2`,children:[(0,V.jsx)(`div`,{className:`m-1`,children:(0,V.jsx)(S,{patternIndex:e.patternIndex})}),(0,V.jsxs)(`div`,{className:`flex-1`,children:[e.hpo_id,(0,V.jsxs)(`div`,{children:[`Participants with this exact term: `,e.count]}),(0,V.jsxs)(`div`,{children:[`Participants including descendant term: `,e.countWithDescendant]})]})]})},U={axis:{x:{dataKey:`count`,label:`# of participants`},y:{dataKey:`mondo_id`,width:180,tickFormatter:e=>e.replace(/\(MONDO:\d+\)/g,``),label:`Diagnosis (MONDO)`}},data:F,onClick:e=>{console.warn(`data`,e)},tooltip:e=>(0,V.jsxs)(`div`,{className:`flex gap-2`,children:[(0,V.jsx)(`div`,{className:`m-1`,children:(0,V.jsx)(S,{patternIndex:e.patternIndex})}),(0,V.jsxs)(`div`,{className:`flex-1`,children:[e.mondo_id,(0,V.jsxs)(`div`,{children:[`Participants with this exact term: `,e.count]}),(0,V.jsxs)(`div`,{children:[`Participants including descendant term: `,e.countWithDescendant]})]})]})},W={axis:{x:{dataKey:`count`,label:`# of files`},y:{dataKey:`key`,width:180,label:`Data Types`}},data:P.slice(0,10),tooltip:e=>(0,V.jsxs)(`div`,{className:`flex gap-2 items-center`,children:[(0,V.jsx)(S,{patternIndex:e.patternIndex}),e.key,` `,(0,V.jsx)(`span`,{className:`font-bold`,children:e.count})]})},G={axis:{x:{dataKey:`count`,label:`# of biospecimens`},y:{dataKey:`key`,width:140,label:`Sample Types`}},data:N.slice(0,10),tooltip:e=>(0,V.jsxs)(`div`,{className:`flex gap-2 items-center`,children:[(0,V.jsx)(S,{patternIndex:e.patternIndex}),e.key,` `,(0,V.jsx)(`span`,{className:`font-bold`,children:e.count})]})},K={title:`Components/Charts/Horizontal Bar Chart`,component:I,args:H},q={render:()=>(0,V.jsxs)(a,{title:`Horizontal Bar chart`,children:[(0,V.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`HPO (Clickable)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...H})})]}),(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Mondo (Clickable)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...U})})]})]}),(0,V.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`HPO (colorblindMode off) (clickable)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...H,colorblindMode:!1})})]}),(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Mondo (colorblindMode off) (clickable)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...U,colorblindMode:!1})})]})]}),(0,V.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Files By Data Types`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...W})})]}),(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Biospecimens`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...G})})]})]}),(0,V.jsxs)(`div`,{className:`w-full flex gap-6`,children:[(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Files By Data Types (colorblindMode off)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...W,colorblindMode:!1})})]}),(0,V.jsxs)(u,{className:`w-full`,children:[(0,V.jsx)(o,{children:(0,V.jsx)(c,{children:`Biospecimens (colorblindMode off)`})}),(0,V.jsx)(s,{children:(0,V.jsx)(I,{...G,colorblindMode:!1})})]})]})]})},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}},J=[`hpoProps`,`mondoProps`,`filesByDataTypesProps`,`biospecimensProps`,`Default`]})))()}export{I as a,U as i,H as n,z as o,Y as r,B as t};