import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{E as s}from"./empty-field-C1VzDKLJ.js";import{C as l}from"./applications-config-q4OA8PiL.js";import{B as c}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./index-CGj_12n1.js";function o({condition:n,children:d}){return n?i.jsx(i.Fragment,{children:d}):i.jsx(s,{})}o.__docgenInfo={description:"",methods:[],displayName:"ConditionalField",props:{condition:{required:!0,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"any"},description:""}}};const m={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},h={title:"Informations/ConditionalField",component:o,args:{},decorators:[n=>i.jsx(c,{children:i.jsx(l,{config:m,children:i.jsx(n,{})})})]},e={args:{condition:!0,children:i.jsx(i.Fragment,{children:"This Condition is True"})},render:n=>i.jsxs("div",{className:"flex flex-col gap-6",children:[i.jsx(o,{condition:n.condition,children:n.children}),i.jsx(o,{condition:!1,children:n.children})]})};var r,t,a;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    condition: true,
    children: <>This Condition is True</>
  },
  render: args => <div className="flex flex-col gap-6">
      <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      <ConditionalField condition={false}>{args.children}</ConditionalField>
    </div>
}`,...(a=(t=e.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const _=["Default"];export{e as Default,_ as __namedExportsOrder,h as default};
