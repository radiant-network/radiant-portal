import{j as e}from"./iframe-DfgdpvDy.js";import{T as i,B as u}from"./toggle-BPPOw8yD.js";import"./preload-helper-Dp1pzeXC.js";const l=["xxs","xs","sm","default","lg"],o=["default","outline"],N={title:"Toggle/Toggle",component:i,argTypes:{size:{options:l,control:{type:"select"}},variant:{options:o,control:{type:"select"}}},args:{disabled:!1}},t={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsxs(i,{size:s,variant:a,children:[e.jsx(u,{}),"Text"]},s))},a))})},r={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsx(i,{size:s,variant:a,children:e.jsx(u,{})},s))},a))})},n={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsx(i,{size:s,variant:a,children:"Text"},s))},a))})};var c,m,d;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              <Bold />
              Text
            </Toggle>)}
        </div>)}
    </div>
}`,...(d=(m=t.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var g,p,x;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              <Bold />
            </Toggle>)}
        </div>)}
    </div>
}`,...(x=(p=r.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var v,f,T;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              Text
            </Toggle>)}
        </div>)}
    </div>
}`,...(T=(f=n.parameters)==null?void 0:f.docs)==null?void 0:T.source}}};const h=["Variants","IconOnly","TextOnly"];export{r as IconOnly,n as TextOnly,t as Variants,h as __namedExportsOrder,N as default};
