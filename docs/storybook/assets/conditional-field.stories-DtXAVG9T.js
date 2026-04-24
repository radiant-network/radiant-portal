import{j as n}from"./iframe-Cl_us0Ef.js";import{E as c}from"./empty-field-_3ihwmj5.js";import{C as l,A as e}from"./applications-config-Ctn1-MGc.js";import{B as m}from"./chunk-UVKPFVEO-Cchu1OLp.js";import"./preload-helper-Dp1pzeXC.js";function r({condition:i,children:s}){return i?n.jsx(n.Fragment,{children:s}):n.jsx(c,{})}r.__docgenInfo={description:"",methods:[],displayName:"ConditionalField",props:{condition:{required:!0,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"any"},description:""}}};const p={variant_entity:{app_id:e.variant_entity},germline_snv_occurrence:{app_id:e.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:e.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:e.admin},portal:{name:"",navigation:{}}},h={title:"Informations/ConditionalField",component:r,args:{},decorators:[i=>n.jsx(m,{children:n.jsx(l,{config:p,children:n.jsx(i,{})})})]},o={args:{condition:!0,children:n.jsx(n.Fragment,{children:"This Condition is True"})},render:i=>n.jsxs("div",{className:"flex flex-col gap-6",children:[n.jsx(r,{condition:i.condition,children:i.children}),n.jsx(r,{condition:!1,children:i.children})]})};var a,d,t;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    condition: true,
    children: <>This Condition is True</>
  },
  render: args => <div className="flex flex-col gap-6">
      <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      <ConditionalField condition={false}>{args.children}</ConditionalField>
    </div>
}`,...(t=(d=o.parameters)==null?void 0:d.docs)==null?void 0:t.source}}};const j=["Default"];export{o as Default,j as __namedExportsOrder,h as default};
