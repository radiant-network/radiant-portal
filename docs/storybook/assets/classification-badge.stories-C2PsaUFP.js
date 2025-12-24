import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as a,a as c}from"./classification-badge-gu3ivgM3.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-DXI8q3e3.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-CBYaBgW8.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./tooltip-0vX-MTK3.js";import"./index-D9mtqW9-.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./index-DnEzm5An.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfXWnpL9.js";import"./i18n-9RQQunwr.js";import"./iframe-GqXNLyoA.js";import"./i18next-CYn7LYXT.js";const P={title:"Badges/Classification Badge",component:a,args:{value:"other",variant:"neutral"}},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i}),e.jsx(a,{value:i,abbreviated:!0}),e.jsx(a,{value:i,count:s}),e.jsx(a,{value:i,abbreviated:!0,count:s})]},i))})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. likelybenign"}),Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:i.replaceAll("_","")}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0}),e.jsx(a,{value:i.replaceAll("_",""),count:s}),e.jsx(a,{value:i.replaceAll("_",""),abbreviated:!0,count:s})]},i))]})},r={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:[e.jsx("div",{children:"Key without space or underscore e.g. _low_penetrance"}),Object.keys(c).map((i,s)=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:"_"+i}),e.jsx(a,{value:"_"+i,abbreviated:!0}),e.jsx(a,{value:"_"+i,count:s}),e.jsx(a,{value:"_"+i,abbreviated:!0,count:s})]},i))]})},n={render:()=>e.jsxs("div",{className:"flex flex-col gap-2 items-start",children:["With an empty string",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0}),e.jsx(a,{value:"",count:1}),e.jsx(a,{value:"",abbreviated:!0,count:1})]}),"With an null value",e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:null}),e.jsx(a,{value:null,abbreviated:!0}),e.jsx(a,{value:null,count:1}),e.jsx(a,{value:null,abbreviated:!0,count:1})]})]})};var o,d,u;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(C=(j=n.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};const Q=["Default","ClassificationValueWithoutUnderscore","ClassificationValueStartingWithAnUnderscore","NoData"];export{r as ClassificationValueStartingWithAnUnderscore,l as ClassificationValueWithoutUnderscore,t as Default,n as NoData,Q as __namedExportsOrder,P as default};
