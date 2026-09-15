import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./checkbox--Wdc3fbi.js";import{n as a,t as o}from"./label-abL0Evlz.js";import{n as s,t as c}from"./separator-BSWu3sd9.js";import{n as l,t as u}from"./switch-CdkVHDMl.js";import{n as d,t as f}from"./utils-hYbUpBR2.js";import{n as p,t as m}from"./dist-BxNp_DKL.js";import{i as h,n as g,r as _,t as v}from"./story-section-DVTm6cGm.js";import{n as y,t as b}from"./badge-BnbeGwIF.js";import{n as x,t as S}from"./story-error-field-DeLRAi8K.js";function C({align:e=`start`,className:t,data:n,box:r,value:a,defaultValue:o,onValueChange:s,name:c,"aria-invalid":l,...u}){let d=E({align:e,invalid:l===!0||l===`true`}),p=(0,w.useId)(),[m,h]=(0,w.useState)(o??[]),g=a!==void 0,_=g?a:m,v=(e,t)=>{let n=_.filter(t=>t!==e);t&&(n=[...n,e]),g||h(n),s?.(n)};return(0,T.jsx)(`div`,{role:`group`,"data-slot":`checkbox-group`,"aria-invalid":l,className:d.base({className:t}),...u,children:n.map(e=>{let t=_.includes(e.id),n=e.disabled,a=`${p}-${e.id}`,o=`${a}-label`,s=`${a}-description`;return(0,T.jsx)(`div`,{"data-slot":`checkbox-group-item`,"data-state":t?`checked`:`unchecked`,"data-disabled":n||void 0,className:f(d.item(),r&&d.box(),r&&t&&d.boxChecked(),n&&d.itemDisabled()),children:(0,T.jsxs)(`div`,{className:f(d.itemContainer(),r&&`p-4`),children:[(0,T.jsx)(i,{id:a,name:c,value:e.id,checked:t,disabled:n,className:f(r&&d.checkboxInBox(),n?d.checkboxDisabled():`cursor-pointer`),"aria-invalid":l,"aria-labelledby":o,"aria-describedby":e.description?s:void 0,onCheckedChange:t=>v(e.id,t===!0)}),(0,T.jsxs)(`div`,{className:d.contentWrapper(),children:[(0,T.jsx)(`label`,{htmlFor:a,className:f(d.label(),n&&`cursor-not-allowed`),children:(0,T.jsxs)(`div`,{className:d.labelContent(),children:[(0,T.jsxs)(`div`,{className:f(d.content()),children:[(0,T.jsx)(`span`,{id:o,className:d.title(),children:e.label}),e.description&&(0,T.jsx)(`span`,{id:s,className:d.description(),children:e.description})]}),e.extraTitle&&(0,T.jsx)(`div`,{"data-slot":`checkbox-group-item-extra-title`,children:e.extraTitle})]})}),t&&e.extraContent&&(0,T.jsx)(`div`,{"data-slot":`checkbox-group-item-extra`,className:d.extraContent(),children:e.extraContent})]})]})},e.id)})})}var w,T,E;function D(){return(D=e((()=>{w=t(),m(),r(),d(),T=n(),E=p({slots:{base:`flex flex-col gap-2 w-full`,item:`w-full`,itemDisabled:`opacity-50 cursor-not-allowed`,label:`block w-full cursor-pointer`,box:`border rounded-md border-input has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]`,boxChecked:`border-primary bg-accent`,checkboxInBox:`focus-visible:ring-0 focus-visible:outline-none`,checkboxDisabled:`disabled:opacity-100`,itemContainer:`flex items-center gap-3`,contentWrapper:`flex flex-1 flex-col items-start gap-1.5`,labelContent:`flex w-full items-start gap-2`,content:`flex flex-col flex-1 gap-1.5 pt-0.5`,title:`text-sm font-medium text-foreground leading-none`,description:`text-sm text-muted-foreground font-normal`,extraContent:`w-full`},variants:{align:{start:{itemContainer:`flex items-start gap-3`},end:{itemContainer:`flex items-start gap-3 flex-row-reverse`}},invalid:{true:{title:`text-destructive`,box:`has-[:focus-visible]:ring-destructive/50`,boxChecked:`border-destructive bg-alert-error/20`}}},defaultVariants:{align:`start`}}),C.__docgenInfo={description:``,methods:[],displayName:`CheckboxGroupField`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  extraTitle?: React.ReactNode;
  extraContent?: React.ReactNode;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}},{key:`disabled`,value:{name:`boolean`,required:!1}},{key:`extraTitle`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}},{key:`extraContent`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}}]}}],raw:`CheckboxGroupFieldItem[]`},description:``},box:{required:!1,tsType:{name:`boolean`},description:``},value:{required:!1,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``},defaultValue:{required:!1,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``},onValueChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: string[]) => void`,signature:{arguments:[{type:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},name:`value`}],return:{name:`void`}}},description:``},name:{required:!1,tsType:{name:`string`},description:``},align:{defaultValue:{value:`'start'`,computed:!1},required:!1}}}})))()}function O(e){let t=`${e}-extra-switch`;return[{id:`option1box`,label:`Horse`,description:`This is a description.`,extraContent:(0,j.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,j.jsx)(c,{style:{marginTop:`16px`}}),(0,j.jsxs)(`span`,{className:`text-sm font-medium text-foreground`,children:[`Extra content `,(0,j.jsx)(`span`,{className:`text-destructive`,children:`*`})]}),(0,j.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,j.jsx)(u,{id:t}),(0,j.jsx)(o,{htmlFor:t,className:`text-sm font-normal`,children:`An option nested in the extra content`})]})]})},{id:`option2box`,label:`Red panda`,description:`This is a description.`}]}function k(){let[e,t]=(0,A.useState)([]),[n,r]=(0,A.useState)([]);return(0,j.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,j.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,j.jsx)(v,{children:`Empty — the error clears as soon as an option is picked, and comes back if all are cleared`}),(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(S,{label:`What is your favorite animal?`,error:`Please pick at least one option`,invalid:e.length===0,children:(0,j.jsx)(C,{value:e,onValueChange:t,"aria-invalid":e.length===0,data:N,style:{marginLeft:`16px`}})}),(0,j.jsx)(S,{label:`What is your favorite animal?`,error:`Please pick at least one option`,invalid:n.length===0,width:420,children:(0,j.jsx)(C,{box:!0,value:n,onValueChange:r,"aria-invalid":n.length===0,data:P})})]})]}),(0,j.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,j.jsx)(v,{children:`Checked while still in error`}),(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(S,{label:`What is your favorite animal?`,error:`Please pick at least one option`,width:420,children:(0,j.jsx)(C,{"aria-invalid":!0,defaultValue:[`option1box`],data:I})}),(0,j.jsx)(S,{label:`What is your favorite animal?`,error:`Please pick at least one option`,width:420,children:(0,j.jsx)(C,{box:!0,"aria-invalid":!0,defaultValue:[`option1box`],data:F})})]})]})]})}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{A=t(),D(),y(),a(),s(),l(),h(),x(),j=n(),M={title:`Components/Inputs/Checkbox Group`,component:C,args:{}},N=[{id:`option1err`,label:`Horse`},{id:`option2err`,label:`Red panda`},{id:`option3err`,label:`Otter`}],P=O(`error-box`),F=O(`error-checked-box`),I=[{id:`option1box`,label:`Horse`,description:`This is a description.`},{id:`option2box`,label:`Red panda`,description:`This is a description.`}],L=[{id:`option1`,label:`Option 1`}],R=[{id:`option1`,label:`Option 1`,description:`This is option 1`}],z=[{id:`option1`,label:`Option 1`,description:`This is option 1`},{id:`option2`,label:`Option 2`,description:`This is option 2`},{id:`option3`,label:`Option 3`,description:`This is option 3`}],B=[{id:`option1`,label:`Option 1`,description:`This is option 1`,disabled:!0},{id:`option2`,label:`Option 2`,description:`This is option 2`,disabled:!0}],V=[{id:`option1`,label:`Option 1`,description:`This is option 1`,disabled:!0,extraContent:(0,j.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,j.jsx)(c,{style:{marginTop:`16px`}}),(0,j.jsxs)(`span`,{className:`text-sm font-medium text-foreground`,children:[`Extra content `,(0,j.jsx)(`span`,{className:`text-destructive`,children:`*`})]}),(0,j.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,j.jsx)(u,{id:`option1-disabled-extra-switch`,disabled:!0}),(0,j.jsx)(o,{htmlFor:`option1-disabled-extra-switch`,className:`text-sm font-normal`,children:`An option nested in the extra content`})]})]})},{id:`option2`,label:`Option 2`,description:`This is option 2`,disabled:!0}],H=[{id:`option1`,label:`Option 1`,description:`This is option 1`,extraTitle:(0,j.jsxs)(`div`,{className:`flex flex-wrap items-center justify-end gap-1.5`,children:[(0,j.jsx)(b,{variant:`green`,children:`Recommended`}),(0,j.jsx)(b,{variant:`blue`,children:`SNV`}),(0,j.jsx)(b,{variant:`violet`,children:`WGS`})]})},{id:`option2`,label:`Option 2`,description:`This is option 2`,extraTitle:(0,j.jsxs)(`div`,{className:`flex flex-wrap items-center justify-end gap-1.5`,children:[(0,j.jsx)(b,{variant:`amber`,children:`Beta`}),(0,j.jsx)(b,{variant:`cyan`,children:`CNV`})]})}],U=[{id:`option1`,label:`Option 1`,description:`This is option 1`,extraTitle:(0,j.jsxs)(`div`,{className:`flex flex-wrap items-center justify-end gap-1.5`,style:{width:160},children:[(0,j.jsx)(b,{variant:`green`,children:`Recommended`}),(0,j.jsx)(b,{variant:`blue`,children:`SNV`}),(0,j.jsx)(b,{variant:`violet`,children:`WGS`}),(0,j.jsx)(b,{variant:`cyan`,children:`CNV`}),(0,j.jsx)(b,{variant:`amber`,children:`Beta`}),(0,j.jsx)(b,{variant:`neutral`,children:`Deprecated`})]})}],W=[{id:`option1`,label:`Option 1`,description:(0,j.jsxs)(j.Fragment,{children:[`This is option 1.`,` `,(0,j.jsx)(`a`,{href:`#`,className:`text-primary underline underline-offset-4`,children:`View permissions`})]}),extraTitle:(0,j.jsxs)(`div`,{className:`flex flex-wrap items-center justify-end gap-1.5`,children:[(0,j.jsx)(b,{variant:`green`,children:`Recommended`}),(0,j.jsx)(b,{variant:`blue`,children:`SNV`})]}),extraContent:(0,j.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,j.jsx)(c,{style:{marginTop:`16px`}}),(0,j.jsxs)(`span`,{className:`text-sm font-medium text-foreground`,children:[`Extra content `,(0,j.jsx)(`span`,{className:`text-destructive`,children:`*`})]}),(0,j.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,j.jsx)(u,{id:`option1-extra-switch`}),(0,j.jsx)(o,{htmlFor:`option1-extra-switch`,className:`text-sm font-normal`,children:`An option nested in the extra content`})]})]})},{id:`option2`,label:`Option 2`,description:(0,j.jsxs)(j.Fragment,{children:[`This is option 2.`,` `,(0,j.jsx)(`a`,{href:`#`,className:`text-primary underline underline-offset-4`,children:`View permissions`})]})}],G={args:{data:L},render:()=>(0,j.jsxs)(_,{children:[(0,j.jsx)(g,{title:`Basic`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(C,{data:L}),(0,j.jsx)(C,{data:L,align:`end`}),(0,j.jsx)(C,{data:L,defaultValue:[`option1`]})]})}),(0,j.jsx)(g,{title:`Description`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(C,{data:R}),(0,j.jsx)(C,{data:R,align:`end`}),(0,j.jsx)(C,{data:R,defaultValue:[`option1`]})]})}),(0,j.jsx)(g,{title:`Box`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:R,box:!0})}),(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:R,box:!0,align:`end`})}),(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:R,box:!0,defaultValue:[`option1`]})})]})}),(0,j.jsx)(g,{title:`Group`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:z,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:z,defaultValue:[`option1`],align:`end`})})]})}),(0,j.jsx)(g,{title:`Box group`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:z,box:!0,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:z,box:!0,defaultValue:[`option1`,`option3`],align:`end`})})]})}),(0,j.jsx)(g,{title:`Disabled`,description:`Default and box types, unselected and selected — the whole item stops being a click target.`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:B,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:280},children:(0,j.jsx)(C,{data:B,box:!0,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:420},children:(0,j.jsx)(C,{data:V,box:!0,defaultValue:[`option1`]})})]})}),(0,j.jsxs)(g,{title:`Extra title`,description:`Extra title is a generic slot at the right of the label and description — the content brings its own layout and its own width. With align="end" it stays between the text and the checkbox.`,children:[(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:420},children:(0,j.jsx)(C,{data:H,box:!0,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:420},children:(0,j.jsx)(C,{data:H,box:!0,defaultValue:[`option1`],align:`end`})})]}),(0,j.jsx)(`div`,{style:{width:420,marginTop:`20px`},children:(0,j.jsx)(C,{data:U,box:!0,defaultValue:[`option1`]})})]}),(0,j.jsx)(g,{title:`Extra content`,description:`Extra content is a generic slot revealed under the label, description and extra title once the item is selected, and spans the same width — the content brings its own layout.`,children:(0,j.jsxs)(`div`,{className:`flex gap-20`,children:[(0,j.jsx)(`div`,{style:{width:420},children:(0,j.jsx)(C,{data:W,box:!0,defaultValue:[`option1`]})}),(0,j.jsx)(`div`,{style:{width:420},children:(0,j.jsx)(C,{data:W,box:!0,defaultValue:[`option1`],align:`end`})})]})}),(0,j.jsx)(g,{title:`Error`,description:`In error, the field label, the message, the option labels and the checkboxes turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.`,children:(0,j.jsx)(k,{})})]})},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    data: singleOption
  },
  render: () => <StoryShowcase>
      <StorySection title="Basic">
        <div className="flex gap-20">
          <CheckboxGroupField data={singleOption} />
          <CheckboxGroupField data={singleOption} align="end" />
          <CheckboxGroupField data={singleOption} defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection title="Description">
        <div className="flex gap-20">
          <CheckboxGroupField data={singleOptionWithDescription} />
          <CheckboxGroupField data={singleOptionWithDescription} align="end" />
          <CheckboxGroupField data={singleOptionWithDescription} defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection title="Box">
        <div className="flex gap-20">
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={singleOptionWithDescription} box />
          </div>
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={singleOptionWithDescription} box align="end" />
          </div>
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={singleOptionWithDescription} box defaultValue={['option1']} />
          </div>
        </div>
      </StorySection>

      <StorySection title="Group">
        <div className="flex gap-20">
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={options} defaultValue={['option1']} />
          </div>
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={options} defaultValue={['option1']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection title="Box group">
        <div className="flex gap-20">
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={options} box defaultValue={['option1']} />
          </div>
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={options} box defaultValue={['option1', 'option3']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection title="Disabled" description="Default and box types, unselected and selected — the whole item stops being a click target.">
        <div className="flex gap-20">
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={disabledOptions} defaultValue={['option1']} />
          </div>
          <div style={{
          width: 280
        }}>
            <CheckboxGroupField data={disabledOptions} box defaultValue={['option1']} />
          </div>
          <div style={{
          width: 420
        }}>
            <CheckboxGroupField data={disabledOptionsWithExtraContent} box defaultValue={['option1']} />
          </div>
        </div>
      </StorySection>

      <StorySection title="Extra title" description={'Extra title is a generic slot at the right of the label and description — the content brings its own ' + 'layout and its own width. With align="end" it stays between the text and the checkbox.'}>
        <div className="flex gap-20">
          <div style={{
          width: 420
        }}>
            <CheckboxGroupField data={optionsWithExtraTitle} box defaultValue={['option1']} />
          </div>
          <div style={{
          width: 420
        }}>
            <CheckboxGroupField data={optionsWithExtraTitle} box defaultValue={['option1']} align="end" />
          </div>
        </div>
        <div style={{
        width: 420,
        marginTop: '20px'
      }}>
          <CheckboxGroupField data={optionsWithManyExtraTitleBadges} box defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection title="Extra content" description={'Extra content is a generic slot revealed under the label, description and extra title once the item ' + 'is selected, and spans the same width — the content brings its own layout.'}>
        <div className="flex gap-20">
          <div style={{
          width: 420
        }}>
            <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} />
          </div>
          <div style={{
          width: 420
        }}>
            <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection title="Error" description="In error, the field label, the message, the option labels and the checkboxes turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.">
        <CheckboxGroupErrorDemo />
      </StorySection>
    </StoryShowcase>
}`,...G.parameters?.docs?.source}}},K=[`AllVariants`]})))()}q();export{G as AllVariants,K as __namedExportsOrder,M as default};