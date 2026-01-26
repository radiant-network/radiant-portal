import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as a,a as o,A as k}from"./classification-badge-WF7867Tw.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-B8JYzoyf.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-CBYaBgW8.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./tooltip-0vX-MTK3.js";import"./index-D9mtqW9-.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./index-DnEzm5An.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfXWnpL9.js";import"./i18n-qyRaDA85.js";import"./iframe-CUgsy8kS.js";import"./i18next-CYn7LYXT.js";const Z={title:"Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s}),e.jsx(a,{value:s,abbreviated:!0}),e.jsx(a,{value:s,count:i}),e.jsx(a,{value:s,abbreviated:!0,count:i})]},s))})},l={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(k).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s}),e.jsx(a,{value:s,abbreviated:!0}),e.jsx(a,{value:s,count:i}),e.jsx(a,{value:s,abbreviated:!0,count:i})]},s))})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. likelybenign"}),Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s.replaceAll("_","")}),e.jsx(a,{value:s.replaceAll("_",""),abbreviated:!0}),e.jsx(a,{value:s.replaceAll("_",""),count:i}),e.jsx(a,{value:s.replaceAll("_",""),abbreviated:!0,count:i})]},s))]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. _low_penetrance"}),Object.keys(o).map((s,i)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:"_"+s}),e.jsx(a,{value:"_"+s,abbreviated:!0}),e.jsx(a,{value:"_"+s,count:i}),e.jsx(a,{value:"_"+s,abbreviated:!0,count:i})]},s))]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:["With an empty string",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]}),"With an null value",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:null}),e.jsx(a,{value:null,abbreviated:!0}),e.jsx(a,{value:null,count:1}),e.jsx(a,{value:null,abbreviated:!0,count:1})]})]})};var d,u,v;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(v=(u=t.parameters)==null?void 0:u.docs)==null?void 0:v.source}}};var m,p,x;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      {Object.keys(AcmgAmpClassificationMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key} />
          <ClassificationBadge value={key} abbreviated />
          <ClassificationBadge value={key} count={index} />
          <ClassificationBadge value={key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(x=(p=l.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var f,g,b;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. likelybenign</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={key.replaceAll('_', '')} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated />
          <ClassificationBadge value={key.replaceAll('_', '')} count={index} />
          <ClassificationBadge value={key.replaceAll('_', '')} abbreviated count={index} />
        </div>)}
    </div>
}`,...(b=(g=r.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var j,C,y;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2 items-start">
      <div>Key without space or underscore e.g. _low_penetrance</div>
      {Object.keys(ClassificationValueMap).map((key, index) => <div className="flex items-center gap-2" key={key}>
          <ClassificationBadge value={'_' + key} />
          <ClassificationBadge value={'_' + key} abbreviated />
          <ClassificationBadge value={'_' + key} count={index} />
          <ClassificationBadge value={'_' + key} abbreviated count={index} />
        </div>)}
    </div>
}`,...(y=(C=n.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var B,h,N;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(N=(h=c.parameters)==null?void 0:h.docs)==null?void 0:N.source}}};const $=["Default","AcmgAmpClassification","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{l as AcmgAmpClassification,n as ClassificationValueStartingWithAnUnderscore,r as ClassificationValueWithoutUnderscore,t as Default,c as NoData,$ as __namedExportsOrder,Z as default};
