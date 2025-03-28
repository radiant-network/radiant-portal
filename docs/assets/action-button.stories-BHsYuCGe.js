import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{f as a}from"./index-BZkcKs8Z.js";import{u as x}from"./i18n-Ber6Uh7x.js";import{A as s}from"./ActionButton-BJjHF_QO.js";import{b as f,a as g}from"./utils-DXcs_An2.js";import"./index-yBjzXJbu.js";import"./iframe-DkzBV2aV.js";import"./index-tvICUrOf.js";import"./dropdown-menu-waw6TUZR.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";const q={title:"Base/Buttons/Action Button",component:s,tags:["autodocs"],args:{onClick:a(),size:"default",actions:[],onDefaultAction:a()}},n={args:{children:"Button"},render:o=>{const{t:r}=x();return t.jsx("div",{className:"flex flex-col gap-2",children:f.map(z=>t.jsx("div",{className:"flex gap-2",children:g.map(i=>t.jsx(s,{size:"default",color:z,variant:i,...o,children:r(`common.buttons.variants.${i}`)}))}))})}},e={args:{children:"Button"},render:o=>{const{t:r}=x();return t.jsxs("div",{className:"flex gap-2",children:[t.jsx(s,{...o,size:"default",color:"primary",children:r("common.buttons.sizes.default")}),t.jsx(s,{...o,size:"xs",color:"primary",children:r("common.buttons.sizes.xs")}),t.jsx(s,{...o,size:"sm",color:"primary",children:r("common.buttons.sizes.sm")}),t.jsx(s,{...o,size:"md",color:"primary",children:r("common.buttons.sizes.md")}),t.jsx(s,{...o,size:"lg",color:"primary",children:r("common.buttons.sizes.lg")})]})}};var m,c,u;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Button"
  },
  render: args => {
    const {
      t
    } = useI18n();
    return <div className="flex flex-col gap-2">
        {buttonColors.map(color => {
        return <div className="flex gap-2">
              {buttonVariants.map(variant => <ActionButton size="default" color={color} variant={variant} {...args}>
                  {t(\`common.buttons.variants.\${variant}\`)}
                </ActionButton>)}
            </div>;
      })}
      </div>;
  }
}`,...(u=(c=n.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var l,p,d;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: "Button"
  },
  render: args => {
    const {
      t
    } = useI18n();
    return <div className="flex gap-2">
        <ActionButton {...args} size="default" color="primary">
          {t('common.buttons.sizes.default')}
        </ActionButton>
        <ActionButton {...args} size="xs" color="primary">
          {t('common.buttons.sizes.xs')}
        </ActionButton>
        <ActionButton {...args} size="sm" color="primary">
          {t('common.buttons.sizes.sm')}
        </ActionButton>
        <ActionButton {...args} size="md" color="primary">
          {t('common.buttons.sizes.md')}
        </ActionButton>
        <ActionButton {...args} size="lg" color="primary">
          {t('common.buttons.sizes.lg')}
        </ActionButton>
      </div>;
  }
}`,...(d=(p=e.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const w=["Variants","Sizes"];export{e as Sizes,n as Variants,w as __namedExportsOrder,q as default};
