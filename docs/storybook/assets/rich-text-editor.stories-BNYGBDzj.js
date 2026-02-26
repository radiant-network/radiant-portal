import{j as c}from"./iframe-DMgXTsUt.js";import{u as l}from"./i18n-BeXLuT2M.js";import{R as n}from"./rich-text-editor-jaLUEyNL.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-BHEYhOBk.js";import"./index-6FsEz12V.js";import"./dropdown-menu-D9pNxrVY.js";import"./index-HfLmxDMw.js";import"./circle-Cbw1kZCn.js";import"./check-D1fRC3F_.js";import"./chevron-down-Cfkk-HJ7.js";const{fn:m}=__STORYBOOK_MODULE_TEST__,{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/RichText Editor",component:n,args:{value:"<h3>Hello</h3>",onChange:m(),placeholder:"Placeholder"}},o={render:s=>{const{t:p}=l();return c.jsx(n,{value:s.value,onChange:e("onChange"),onBlur:e("onBlur"),placeholder:p("common.editor.placeholder"),wrapperClassName:"max-w-[500px]",autoFocus:!0})}};var r,t,a;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="max-w-[500px]" autoFocus />;
  }
}`,...(a=(t=o.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const R=["Default"];export{o as Default,R as __namedExportsOrder,f as default};
