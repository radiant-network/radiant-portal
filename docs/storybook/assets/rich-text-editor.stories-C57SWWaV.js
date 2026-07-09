import{j as t,r as m}from"./iframe-Bl6A8JHh.js";import{u}from"./i18n-CU5lE6mY.js";import{R as s}from"./rich-text-editor-DY4bJ42a.js";import{R as h}from"./rich-text-viewer-BBcjVNZQ.js";import{B as p}from"./button-CtPLaqJS.js";import{a as l}from"./story-section-Buu6OzgL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-EbWQjguD.js";import"./with-selector-PIaAeJdc.js";import"./separator-C0nFDG4e.js";import"./toggle-BUJ3n9nX.js";import"./popover-HC32ocFi.js";import"./input-D0PRAIuy.js";import"./label-DA7PVQJW.js";import"./x-CPOpEMiU.js";import"./underline-DuaC6_RQ.js";import"./action-button-YErJw3iJ.js";import"./dropdown-menu-B_s2SHH-.js";import"./index-LoDBT14K.js";import"./index-D7r_obL0.js";import"./check-unQJhoTi.js";import"./circle-BRirejCk.js";const{fn:g}=__STORYBOOK_MODULE_TEST__,{action:n}=__STORYBOOK_MODULE_ACTIONS__,z={title:"Components/Inputs/Rich Text Editor",component:s,args:{value:"<h3>Hello</h3>",onChange:g(),placeholder:"Placeholder"}},a={render:o=>{const{t:e}=u();return t.jsx(l,{title:"Default",children:t.jsx(s,{value:o.value,onChange:n("onChange"),onBlur:n("onBlur"),placeholder:e("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0})})}},r={render:o=>{const{t:e}=u();return t.jsx(l,{title:"With actions",children:t.jsx(s,{value:o.value,onChange:n("onChange"),onBlur:n("onBlur"),placeholder:e("common.editor.placeholder"),wrapperClassName:"min-w-[500px]",autoFocus:!0,actions:[t.jsx(p,{variant:"outline",size:"2xs",children:e("common.cancel")},"cancel"),t.jsx(p,{size:"2xs",children:e("common.save")},"save")]})})}},i={args:{value:'<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>'},render:o=>{const[e,c]=m.useState(o.value??"");return t.jsx(l,{title:"Viewer",children:t.jsxs("div",{className:"flex w-full gap-6",children:[t.jsx(s,{className:"w-[800px]",value:e,onChange:d=>c(d)}),t.jsx(h,{value:e,wrapperClassName:"max-w-[800px]",autoFocus:!0})]})})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <StorySection title="Default">
        <RichTextEditor value={args.value} onChange={action('onChange')} onBlur={action('onBlur')} placeholder={t('common.editor.placeholder')} wrapperClassName="min-w-[500px]" autoFocus />
      </StorySection>;
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Y=["Default","WithActions","Viewer"];export{a as Default,i as Viewer,r as WithActions,Y as __namedExportsOrder,z as default};
