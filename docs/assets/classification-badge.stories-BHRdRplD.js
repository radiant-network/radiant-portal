import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as a,a as p}from"./classification-badge-D_UWmIGl.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-CGj_12n1.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./tooltip-Bh6uXa7k.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./i18n-CA10OmEn.js";import"./iframe-B53Dcafx.js";import"./context-DkqwYzW-.js";const z={title:"Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},i={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(p).map((t,r)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:t}),e.jsx(a,{value:t,abbreviated:!0}),e.jsx(a,{value:t,count:r}),e.jsx(a,{value:t,abbreviated:!0,count:r})]},t))})},s={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]})})};var o,l,n;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(n=(l=i.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};var c,m,d;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2">
        <ClassificationBadge value="" />
        <ClassificationBadge value="" abbreviated />
        <ClassificationBadge value="" count={1} />
        <ClassificationBadge value="" abbreviated count={1} />
      </div>
    </div>
}`,...(d=(m=s.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const A=["Default","NoData"];export{i as Default,s as NoData,A as __namedExportsOrder,z as default};
