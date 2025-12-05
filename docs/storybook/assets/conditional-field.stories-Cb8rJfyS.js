import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{E as c}from"./empty-field-C1VzDKLJ.js";import{C as l,A as e}from"./applications-config-3OOAo44D.js";import{B as p}from"./chunk-PVWAREVJ-DlxzcEPC.js";import"./index-CBYaBgW8.js";function r({condition:i,children:s}){return i?n.jsx(n.Fragment,{children:s}):n.jsx(c,{})}r.__docgenInfo={description:"",methods:[],displayName:"ConditionalField",props:{condition:{required:!0,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"any"},description:""}}};const m={variant_entity:{app_id:e.variant_entity},snv_occurrence:{app_id:e.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:e.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:e.admin},portal:{name:"",navigation:{}}},_={title:"Informations/ConditionalField",component:r,args:{},decorators:[i=>n.jsx(p,{children:n.jsx(l,{config:m,children:n.jsx(i,{})})})]},o={args:{condition:!0,children:n.jsx(n.Fragment,{children:"This Condition is True"})},render:i=>n.jsxs("div",{className:"flex flex-col gap-6",children:[n.jsx(r,{condition:i.condition,children:i.children}),n.jsx(r,{condition:!1,children:i.children})]})};var a,d,t;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    condition: true,
    children: <>This Condition is True</>
  },
  render: args => <div className="flex flex-col gap-6">
      <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      <ConditionalField condition={false}>{args.children}</ConditionalField>
    </div>
}`,...(t=(d=o.parameters)==null?void 0:d.docs)==null?void 0:t.source}}};const j=["Default"];export{o as Default,j as __namedExportsOrder,_ as default};
