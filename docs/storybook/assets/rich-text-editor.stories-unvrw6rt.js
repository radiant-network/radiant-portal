import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./button-Cn480Lud.js";import{n as a,t as o}from"./rich-text-editor-By9A48iG.js";import{n as s,t as c}from"./i18n-87HgNCfy.js";import{i as l,n as u}from"./story-section-DVTm6cGm.js";import{n as d,t as f}from"./story-error-field-DeLRAi8K.js";import{n as p,t as m}from"./rich-text-viewer-B53VRTJB.js";var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{c(),a(),p(),h=t(),r(),l(),d(),g=n(),{fn:_}=__STORYBOOK_MODULE_TEST__,{action:v}=__STORYBOOK_MODULE_ACTIONS__,y={title:`Components/Inputs/Rich Text Editor`,component:o,args:{value:`<h3>Hello</h3>`,onChange:_(),placeholder:`Placeholder`}},b={render:e=>{let{t}=s();return(0,g.jsx)(u,{title:`Default`,children:(0,g.jsx)(o,{value:e.value,onChange:v(`onChange`),onBlur:v(`onBlur`),placeholder:t(`common.editor.placeholder`),wrapperClassName:`min-w-[500px]`,autoFocus:!0})})}},x={render:e=>{let{t}=s();return(0,g.jsx)(u,{title:`With actions`,children:(0,g.jsx)(o,{value:e.value,onChange:v(`onChange`),onBlur:v(`onBlur`),placeholder:t(`common.editor.placeholder`),wrapperClassName:`min-w-[500px]`,autoFocus:!0,actions:[(0,g.jsx)(i,{variant:`outline`,size:`2xs`,children:t(`common.cancel`)},`cancel`),(0,g.jsx)(i,{size:`2xs`,children:t(`common.save`)},`save`)]})})}},S={args:{value:`<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>`},render:e=>{let[t,n]=(0,h.useState)(e.value??``);return(0,g.jsx)(u,{title:`Viewer`,children:(0,g.jsxs)(`div`,{className:`flex w-full gap-6`,children:[(0,g.jsx)(o,{className:`w-[800px]`,value:t,onChange:e=>n(e)}),(0,g.jsx)(m,{value:t,wrapperClassName:`max-w-[800px]`,autoFocus:!0})]})})}},C={render:()=>{let{t:e}=s(),[t,n]=(0,h.useState)(``),r=t.replace(/<[^>]*>/g,``).replaceAll(`&nbsp;`,``).trim()===``;return(0,g.jsx)(u,{title:`Error`,children:(0,g.jsx)(f,{label:`Note`,width:500,invalid:r,children:(0,g.jsx)(o,{"aria-invalid":r,value:``,onChange:e=>{n(e),v(`onChange`)(e)},onBlur:v(`onBlur`),placeholder:e(`common.editor.placeholder`)})})})}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <StorySection title="Default">
        <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="min-w-[500px]" autoFocus />
      </StorySection>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <StorySection title="With actions">
        <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="min-w-[500px]" autoFocus actions={[<Button key="cancel" variant="outline" size="2xs">
              {t('common.cancel')}
            </Button>, <Button key="save" size="2xs">
              {t('common.save')}
            </Button>]} />
      </StorySection>;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    value: '<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>'
  },
  render: args => {
    const [value, setValue] = useState<string>(args.value ?? '');
    return <StorySection title="Viewer">
        <div className="flex w-full gap-6">
          <RichTextEditor className="w-[800px]" value={value} onChange={value => setValue(value)} />
          <RichTextViewer value={value} wrapperClassName="max-w-[800px]" autoFocus />
        </div>
      </StorySection>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    const [value, setValue] = useState('');
    // The editor always returns markup, so strip the tags to know whether it holds text.
    const isEmpty = value.replace(/<[^>]*>/g, '').replaceAll('&nbsp;', '').trim() === '';
    return <StorySection title="Error">
        <StoryErrorField label="Note" width={500} invalid={isEmpty}>
          <RichTextEditor aria-invalid={isEmpty} value="" onChange={next => {
          setValue(next);
          action('onChange')(next);
        }} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} />
        </StoryErrorField>
      </StorySection>;
  }
}`,...C.parameters?.docs?.source}}},w=[`Default`,`WithActions`,`Viewer`,`ErrorState`]})))()}T();export{b as Default,C as ErrorState,S as Viewer,x as WithActions,w as __namedExportsOrder,y as default};