import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as a,a as c}from"./classification-badge-Cmj9-mgV.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-CGj_12n1.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./tooltip-eZCTYbea.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./i18n-Dwlvl9Yt.js";import"./iframe-D8saG-or.js";import"./context-DkqwYzW-.js";const I={title:"Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i}),e.jsx(a,{value:i,abbreviated:!0}),e.jsx(a,{value:i,count:s}),e.jsx(a,{value:i,abbreviated:!0,count:s})]},i))})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. likelybenign"}),Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i.replaceAll("_","")}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0}),e.jsx(a,{value:i.replaceAll("_",""),count:s}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0,count:s})]},i))]})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. _low_penetrance"}),Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:"_"+i}),e.jsx(a,{value:"_"+i,abbreviated:!0}),e.jsx(a,{value:"_"+i,count:s}),e.jsx(a,{value:"_"+i,abbreviated:!0,count:s})]},i))]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:["With an empty string",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]}),"With an null value",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:null}),e.jsx(a,{value:null,abbreviated:!0}),e.jsx(a,{value:null,count:1}),e.jsx(a,{value:null,abbreviated:!0,count:1})]})]})};var o,d,u;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var v,m,p;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. likelybenign</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key.replaceAll('_', '')} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
          <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
        </div>)}
    </div>
}`,...(p=(m=l.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var x,f,g;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. _low_penetrance</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={'_' + key} />
          <ClassificationBadge value={'_' + key} abbreviated />
          <ClassificationBadge value={'_' + key} count={index} />
          <ClassificationBadge value={'_' + key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(g=(f=r.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var b,j,C;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      With an empty string
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
      With an null value
      <div className="flex items-center gap-2">
        <ClassificationBadge value={null} />
        <ClassificationBadge value={null} abbreviated />
        <ClassificationBadge value={null} count={1} />
        <ClassificationBadge value={null} abbreviated count={1} />
      </div>
    </div>
}`,...(C=(j=n.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};const J=["Default","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{r as ClassificationValueStartingWithAnUnderscore,l as ClassificationValueWithoutUnderscore,t as Default,n as NoData,J as __namedExportsOrder,I as default};
