import{j as o}from"./jsx-runtime-Cf8x2fCZ.js";import{f as x}from"./index-BZkcKs8Z.js";import{u as p}from"./i18n-Ber6Uh7x.js";import{B as r}from"./button-8ZB15y1Y.js";import{b as z,a as f}from"./utils-DXcs_An2.js";import"./index-yBjzXJbu.js";import"./iframe-DkzBV2aV.js";import"./index-tvICUrOf.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-BJjHF_QO.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-DL58Pmf8.js";const D={title:"Base/Buttons/Button",component:r,tags:["autodocs"],args:{onClick:x(),size:"default"}},s={args:{},render:()=>{const{t}=p();return o.jsx("div",{className:"flex flex-col gap-2",children:z.map(d=>o.jsx("div",{className:"flex gap-2",children:f.map(e=>o.jsx(r,{color:d,variant:e,children:t(`common.buttons.variants.${e}`)}))}))})}},n={args:{},render:()=>{const{t}=p();return o.jsxs("div",{className:"flex gap-2",children:[o.jsx(r,{size:"default",color:"primary",children:t("common.buttons.sizes.default")}),o.jsx(r,{size:"xs",color:"primary",children:t("common.buttons.sizes.xs")}),o.jsx(r,{size:"sm",color:"primary",children:t("common.buttons.sizes.sm")}),o.jsx(r,{size:"md",color:"primary",children:t("common.buttons.sizes.md")}),o.jsx(r,{size:"lg",color:"primary",children:t("common.buttons.sizes.lg")})]})}};var a,m,i;s.parameters={...s.parameters,docs:{...(a=s.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const {
      t
    } = useI18n();
    return <div className="flex flex-col gap-2">
        {buttonColors.map(color => {
        return <div className="flex gap-2">
              {buttonVariants.map(variant => <Button color={color} variant={variant}>
                  {t(\`common.buttons.variants.\${variant}\`)}
                </Button>)}
            </div>;
      })}
      </div>;
  }
}`,...(i=(m=s.parameters)==null?void 0:m.docs)==null?void 0:i.source}}};var c,u,l;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {},
  render: () => {
    const {
      t
    } = useI18n();
    return <div className="flex gap-2">
        <Button size="default" color="primary">
          {t('common.buttons.sizes.default')}
        </Button>
        <Button size="xs" color="primary">
          {t('common.buttons.sizes.xs')}
        </Button>
        <Button size="sm" color="primary">
          {t('common.buttons.sizes.sm')}
        </Button>
        <Button size="md" color="primary">
          {t('common.buttons.sizes.md')}
        </Button>
        <Button size="lg" color="primary">
          {t('common.buttons.sizes.lg')}
        </Button>
      </div>;
  }
}`,...(l=(u=n.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const F=["Variants","Sizes"];export{n as Sizes,s as Variants,F as __namedExportsOrder,D as default};
