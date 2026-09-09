import{u as d,j as e,r as g,B as h}from"./iframe-CgZaKe5d.js";import{R as r}from"./rich-text-editor-XW5B4rAa.js";import{R as x}from"./rich-text-viewer-vI9BRb1w.js";import{a as u}from"./story-section-Cd-IQlgl.js";import{S}from"./story-error-field-D-p-uhDX.js";import"./preload-helper-PPVm8Dsz.js";import"./with-selector-pinLDNQu.js";import"./toggle-CDqT2PMS.js";import"./popover-DDZSXOOd.js";import"./input-wTxIY8D5.js";import"./label-C-mLdX7m.js";import"./x-C9LJTscZ.js";import"./underline-CMuPCCtW.js";import"./index-DOoNJz6V.js";const{fn:f}=__STORYBOOK_MODULE_TEST__,{action:a}=__STORYBOOK_MODULE_ACTIONS__,F={title:"Components/Inputs/Rich Text Editor",component:r,args:{value:"<h3>Hello</h3>",onChange:f(),placeholder:"Placeholder"}},n={render:o=>{const{t}=d();return e.jsx(u,{title:"Default",children:e.jsx(r,{value:o.value,onChange:a("onChange"),onBlur:a("onBlur"),placeholder:t("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0})})}},s={render:o=>{const{t}=d();return e.jsx(u,{title:"With actions",children:e.jsx(r,{value:o.value,onChange:a("onChange"),onBlur:a("onBlur"),placeholder:t("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0,actions:[e.jsx(h,{variant:"outline",size:"2xs",children:t("common.cancel")},"cancel"),e.jsx(h,{size:"2xs",children:t("common.save")},"save")]})})}},l={args:{value:'<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>'},render:o=>{const[t,c]=g.useState(o.value??"");return e.jsx(u,{title:"Viewer",children:e.jsxs("div",{className:"flex w-full gap-6",children:[e.jsx(r,{className:"w-[800px]",value:t,onChange:i=>c(i)}),e.jsx(x,{value:t,wrapperClassName:"max-w-[800px]",autoFocus:!0})]})})}},p={render:()=>{const{t:o}=d(),[t,c]=g.useState(""),i=t.replace(/<[^>]*>/g,"").replaceAll("&nbsp;","").trim()==="";return e.jsx(u,{title:"Error",children:e.jsx(S,{label:"Note",width:500,invalid:i,children:e.jsx(r,{"aria-invalid":i,value:"",onChange:m=>{c(m),a("onChange")(m)},onBlur:a("onBlur"),placeholder:o("common.editor.placeholder")})})})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <StorySection title="Default">
        <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="min-w-[500px]" autoFocus />
      </StorySection>;
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const D=["Default","WithActions","Viewer","ErrorState"];export{n as Default,p as ErrorState,l as Viewer,s as WithActions,D as __namedExportsOrder,F as default};
