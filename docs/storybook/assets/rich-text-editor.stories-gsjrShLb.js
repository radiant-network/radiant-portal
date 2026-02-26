import{j as c}from"./iframe-CxSY7Paf.js";import{u as l}from"./i18n-BFt0O6_s.js";import{R as n}from"./rich-text-editor-BbY9Z7uH.js";import"./preload-helper-Dp1pzeXC.js";import"./separator-Co05gwko.js";import"./index-Cw83H7Iw.js";import"./dropdown-menu-7KW9uYmU.js";import"./index-w7TOK4tZ.js";import"./circle-BRvajDZy.js";import"./check-DpHxaibB.js";import"./chevron-down-C2tXHT3U.js";const{fn:m}=__STORYBOOK_MODULE_TEST__,{action:e}=__STORYBOOK_MODULE_ACTIONS__,f={title:"Inputs/RichText Editor",component:n,args:{value:"<h3>Hello</h3>",onChange:m(),placeholder:"Placeholder"}},o={render:s=>{const{t:p}=l();return c.jsx(n,{value:s.value,onChange:e("onChange"),onBlur:e("onBlur"),placeholder:p("common.editor.placeholder"),wrapperClassName:"max-w-[500px]",autoFocus:!0})}};var r,t,a;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="max-w-[500px]" autoFocus />;
  }
}`,...(a=(t=o.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const R=["Default"];export{o as Default,R as __namedExportsOrder,f as default};
