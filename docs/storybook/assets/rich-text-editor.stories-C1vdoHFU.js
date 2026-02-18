import{j as c}from"./iframe-DiydeeGO.js";import{u as l}from"./i18n-3c6sQS03.js";import{R as n}from"./rich-text-editor-B6k0jVSA.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-DR0R7ySQ.js";import"./index-B7hOF3du.js";import"./dropdown-menu-CdVAlv0x.js";import"./index-D3WEPLb5.js";import"./circle-BhlZk34l.js";import"./check-Dn9AvtKh.js";import"./chevron-down-E2GPlgB7.js";const{fn:m}=__STORYBOOK_MODULE_TEST__,{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/RichText Editor",component:n,args:{value:"<h3>Hello</h3>",onChange:m(),placeholder:"Placeholder"}},o={render:s=>{const{t:p}=l();return c.jsx(n,{value:s.value,onChange:e("onChange"),onBlur:e("onBlur"),placeholder:p("common.editor.placeholder"),wrapperClassName:"max-w-[500px]",autoFocus:!0})}};var r,t,a;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="max-w-[500px]" autoFocus />;
  }
}`,...(a=(t=o.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const R=["Default"];export{o as Default,R as __namedExportsOrder,f as default};
