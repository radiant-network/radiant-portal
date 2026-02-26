import{j as c}from"./iframe-DScfH23H.js";import{u as l}from"./i18n-BkJc_JBM.js";import{R as n}from"./rich-text-editor-DpoavV0O.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-3qp1MTVc.js";import"./index-BF3FapFX.js";import"./dropdown-menu-og6sswEy.js";import"./index-CWodAqdm.js";import"./circle-CZ7yOVTR.js";import"./check-D0vOGmKE.js";import"./chevron-down-qtntijFz.js";const{fn:m}=__STORYBOOK_MODULE_TEST__,{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/RichText Editor",component:n,args:{value:"<h3>Hello</h3>",onChange:m(),placeholder:"Placeholder"}},o={render:s=>{const{t:p}=l();return c.jsx(n,{value:s.value,onChange:e("onChange"),onBlur:e("onBlur"),placeholder:p("common.editor.placeholder"),wrapperClassName:"max-w-[500px]",autoFocus:!0})}};var r,t,a;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="max-w-[500px]" autoFocus />;
  }
}`,...(a=(t=o.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const R=["Default"];export{o as Default,R as __namedExportsOrder,f as default};
