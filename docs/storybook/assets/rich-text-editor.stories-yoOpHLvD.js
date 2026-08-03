import{j as t,r as g}from"./iframe-_3pDU_m1.js";import{u as d}from"./i18n-DIfamP6U.js";import{R as a}from"./rich-text-editor-VtVmWE0t.js";import{R as x}from"./rich-text-viewer-DzW4kczm.js";import{B as h}from"./button-B7AkeCKU.js";import{a as u}from"./story-section-9tet9DgD.js";import{S}from"./story-error-field-BNsG3pzf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D93W_M_b.js";import"./with-selector-C0zJBQzn.js";import"./separator-CIL6Up82.js";import"./toggle-DwHUgtz8.js";import"./popover-DKYSjZY8.js";import"./input-7KRj1inv.js";import"./label-C7drXKr7.js";import"./x-5OkV8dD4.js";import"./underline-mcJzmHgt.js";import"./action-button-BLggGiKX.js";import"./dropdown-menu-DkZCJalM.js";import"./index-BKRaFSoB.js";import"./index-7oRQ5vhD.js";import"./check-DZQ1hz2N.js";import"./circle-B6SE5RnA.js";import"./index-DSZtqkGG.js";const{fn:f}=__STORYBOOK_MODULE_TEST__,{action:r}=__STORYBOOK_MODULE_ACTIONS__,q={title:"Components/Inputs/Rich Text Editor",component:a,args:{value:"<h3>Hello</h3>",onChange:f(),placeholder:"Placeholder"}},n={render:o=>{const{t:e}=d();return t.jsx(u,{title:"Default",children:t.jsx(a,{value:o.value,onChange:r("onChange"),onBlur:r("onBlur"),placeholder:e("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0})})}},s={render:o=>{const{t:e}=d();return t.jsx(u,{title:"With actions",children:t.jsx(a,{value:o.value,onChange:r("onChange"),onBlur:r("onBlur"),placeholder:e("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0,actions:[t.jsx(h,{variant:"outline",size:"2xs",children:e("common.cancel")},"cancel"),t.jsx(h,{size:"2xs",children:e("common.save")},"save")]})})}},l={args:{value:'<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>'},render:o=>{const[e,c]=g.useState(o.value??"");return t.jsx(u,{title:"Viewer",children:t.jsxs("div",{className:"flex w-full gap-6",children:[t.jsx(a,{className:"w-[800px]",value:e,onChange:i=>c(i)}),t.jsx(x,{value:e,wrapperClassName:"max-w-[800px]",autoFocus:!0})]})})}},p={render:()=>{const{t:o}=d(),[e,c]=g.useState(""),i=e.replace(/<[^>]*>/g,"").replaceAll("&nbsp;","").trim()==="";return t.jsx(u,{title:"Error",children:t.jsx(S,{label:"Note",width:500,invalid:i,children:t.jsx(a,{"aria-invalid":i,value:"",onChange:m=>{c(m),r("onChange")(m)},onBlur:r("onBlur"),placeholder:o("common.editor.placeholder")})})})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};const G=["Default","WithActions","Viewer","ErrorState"];export{n as Default,p as ErrorState,l as Viewer,s as WithActions,G as __namedExportsOrder,q as default};
