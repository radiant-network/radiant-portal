import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{f as a}from"./index-DPYJpPba.js";import{A as l}from"./action-button-B61IoBol.js";import"./dropdown-menu-CvT4td-4.js";import"./index-CBYaBgW8.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-BCzuw4Jg.js";import"./index-BdYz8WOz.js";import"./Combination-DPhcPU0m.js";import"./index-D6ay35fe.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-ChZWIdMg.js";import"./index-C-d7IIsQ.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";const O={title:"Buttons/Action Button",component:l,args:{onClick:a(),size:"default",disabled:!1,actions:[],onDefaultAction:a()}},o={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:c=>i.jsx("div",{className:"flex flex-col gap-6",children:["default","outline","secondary","destructive"].map(t=>i.jsx("div",{className:"flex gap-2",children:["xxs","xs","sm","default","lg"].map(n=>i.jsxs(l,{...c,variant:t,size:n,children:[t,"-",n]},`${t}-${n}`))},t))})};var e,r,s;o.parameters={...o.parameters,docs:{...(e=o.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    actions: [{
      label: 'action 1',
      onClick: () => {}
    }, {
      label: 'action 2',
      onClick: () => {}
    }, {
      label: 'action 3',
      onClick: () => {}
    }]
  },
  render: args => <div className="flex flex-col gap-6">
      {['default', 'outline', 'secondary', 'destructive'].map(variant => <div key={variant} className="flex gap-2">
          {['xxs', 'xs', 'sm', 'default', 'lg'].map(size => <ActionButton key={\`\${variant}-\${size}\`} {...args} variant={variant} size={size}>
              {variant}-{size}
            </ActionButton>)}
        </div>)}
    </div>
}`,...(s=(r=o.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const R=["Variants"];export{o as Variants,R as __namedExportsOrder,O as default};
