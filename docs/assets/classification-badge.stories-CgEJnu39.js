import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as s,a as o}from"./classification-badge-DJ0jybqp.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-CGj_12n1.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./tooltip-Bh6uXa7k.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./i18n-D-WwHs2-.js";import"./iframe-CmZvwq7c.js";import"./context-DkqwYzW-.js";const I={title:"Badges/Classification Badge",component:s,args:{value:"other",variant:"neutral"}},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(o).map((a,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{value:a}),e.jsx(s,{value:a,abbreviated:!0}),e.jsx(s,{value:a,count:i}),e.jsx(s,{value:a,abbreviated:!0,count:i})]},a))})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. likelybenign"}),Object.keys(o).map((a,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{value:a.replaceAll("_","")}),e.jsx(s,{value:a.replaceAll("_",""),abbreviated:!0}),e.jsx(s,{value:a.replaceAll("_",""),count:i}),e.jsx(s,{value:a.replaceAll("_",""),abbreviated:!0,count:i})]},a))]})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. _low_penetrance"}),Object.keys(o).map((a,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{value:"_"+a}),e.jsx(s,{value:"_"+a,abbreviated:!0}),e.jsx(s,{value:"_"+a,count:i}),e.jsx(s,{value:"_"+a,abbreviated:!0,count:i})]},a))]})},c={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{value:""}),e.jsx(s,{value:"",abbreviated:!0}),e.jsx(s,{value:"",count:1}),e.jsx(s,{value:"",abbreviated:!0,count:1})]})})};var n,d,u;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,p,v;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. likelybenign</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key.replaceAll('_', '')} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
          <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
        </div>)}
    </div>
}`,...(v=(p=r.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};var x,f,g;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. _low_penetrance</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={'_' + key} />
          <ClassificationBadge value={'_' + key} abbreviated />
          <ClassificationBadge value={'_' + key} count={index} />
          <ClassificationBadge value={'_' + key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(g=(f=l.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var b,j,C;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
    </div>
}`,...(C=(j=c.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};const J=["Default","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{l as ClassificationValueStartingWithAnUnderscore,r as ClassificationValueWithoutUnderscore,t as Default,c as NoData,J as __namedExportsOrder,I as default};
