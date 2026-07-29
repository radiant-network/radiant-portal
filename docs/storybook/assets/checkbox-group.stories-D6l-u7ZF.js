import{r as j,j as e,c as p,b as q}from"./iframe-BCdw1Zpv.js";import{C as I}from"./checkbox-DMX3BjE_.js";import{S as A}from"./separator-CxLC1eka.js";import{B as n}from"./badge-BhM3_JBV.js";import{L as k}from"./label-l8FzOQVN.js";import{S as C}from"./switch-BBPprQIy.js";import{S as L,a as s}from"./story-section-DgtXw29J.js";import"./preload-helper-PPVm8Dsz.js";import"./index-NqJJUEGy.js";import"./check-DAngudb0.js";import"./x-DwSUWTV9.js";const _=q({slots:{base:"flex flex-col gap-2 w-full",item:"w-full",itemDisabled:"opacity-50 cursor-not-allowed",itemLabel:"block cursor-pointer",box:"border rounded-md border-input has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",boxChecked:"border-primary bg-accent",checkboxInBox:"focus-visible:ring-0 focus-visible:outline-none",checkboxDisabled:"disabled:opacity-100",itemContainer:"flex items-center gap-3",contentContainer:"flex flex-1 items-start gap-2 self-stretch pt-0.5",content:"flex flex-col flex-1 gap-1.5",contentWithExtraTitle:"min-w-[50%]",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",extraTitle:"flex flex-wrap items-center gap-1.5",extraContent:"flex flex-col gap-4"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function t({align:N="start",className:S,data:V,box:c,value:m,defaultValue:T,onValueChange:F,name:O,...G}){const a=_({align:N}),E=j.useId(),[W,R]=j.useState(T??[]),b=m!==void 0,v=b?m:W,D=(i,l)=>{let o=v.filter(d=>d!==i);l&&(o=[...o,i]),b||R(o),F?.(o)};return e.jsx("div",{role:"group","data-slot":"checkbox-group",className:a.base({className:S}),...G,children:V.map(i=>{const l=v.includes(i.id),o=i.disabled,d=`${E}-${i.id}`,f=`${d}-label`,g=`${d}-description`;return e.jsxs("div",{"data-slot":"checkbox-group-item","data-state":l?"checked":"unchecked","data-disabled":o||void 0,className:p(a.item(),c&&a.box(),c&&l&&a.boxChecked(),o&&a.itemDisabled()),children:[e.jsx("label",{htmlFor:d,className:p(a.itemLabel(),c&&"p-4",o&&"cursor-not-allowed"),children:e.jsxs("div",{className:a.itemContainer(),children:[e.jsx(I,{id:d,name:O,value:i.id,checked:l,disabled:o,className:p(c&&a.checkboxInBox(),o&&a.checkboxDisabled()),"aria-labelledby":f,"aria-describedby":i.description?g:void 0,onCheckedChange:B=>D(i.id,B===!0)}),e.jsxs("div",{className:a.contentContainer(),children:[e.jsxs("div",{className:p(a.content(),i.extraTitle&&a.contentWithExtraTitle()),children:[e.jsx("span",{id:f,className:a.label(),children:i.label}),i.description&&e.jsx("span",{id:g,className:a.description(),children:i.description})]}),i.extraTitle&&e.jsx("div",{"data-slot":"checkbox-group-item-extra-title",className:a.extraTitle(),children:i.extraTitle})]})]})}),l&&i.extraContent&&e.jsxs("div",{"data-slot":"checkbox-group-item-extra",className:p(a.extraContent(),c?"px-4 pb-4":"mt-4"),children:[e.jsx(A,{}),i.extraContent]})]},i.id)})})}t.__docgenInfo={description:"",methods:[],displayName:"CheckboxGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  extraTitle?: React.ReactNode;
  extraContent?: React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"extraTitle",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"extraContent",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}}]}}],raw:"CheckboxGroupFieldItem[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},value:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultValue:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"value"}],return:{name:"void"}}},description:""},name:{required:!1,tsType:{name:"string"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const ie={title:"Components/Inputs/Checkbox Group",component:t,args:{}},x=[{id:"option1",label:"Option 1"}],r=[{id:"option1",label:"Option 1",description:"This is option 1"}],h=[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],y=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],$=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0,extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(C,{id:"option1-disabled-extra-switch",disabled:!0}),e.jsx(k,{htmlFor:"option1-disabled-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],w=[{id:"option1",label:"Option 1",description:"This is option 1",extraTitle:e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"green",children:"Recommended"}),e.jsx(n,{variant:"blue",children:"SNV"}),e.jsx(n,{variant:"violet",children:"WGS"})]})},{id:"option2",label:"Option 2",description:"This is option 2",extraTitle:e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"amber",children:"Beta"}),e.jsx(n,{variant:"cyan",children:"CNV"})]})}],M=[{id:"option1",label:"Option 1",description:"This is option 1",extraTitle:e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"green",children:"Recommended"}),e.jsx(n,{variant:"blue",children:"SNV"}),e.jsx(n,{variant:"violet",children:"WGS"}),e.jsx(n,{variant:"cyan",children:"CNV"}),e.jsx(n,{variant:"amber",children:"Beta"}),e.jsx(n,{variant:"neutral",children:"Deprecated"})]})}],U=[{id:"option1",label:"Option 1",description:e.jsxs(e.Fragment,{children:["This is option 1."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]}),extraTitle:e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"green",children:"Recommended"}),e.jsx(n,{variant:"blue",children:"SNV"})]}),extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(C,{id:"option1-extra-switch"}),e.jsx(k,{htmlFor:"option1-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:e.jsxs(e.Fragment,{children:["This is option 2."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]})}],u={args:{data:x},render:()=>e.jsxs(L,{children:[e.jsx(s,{title:"Basic",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:x}),e.jsx(t,{data:x,align:"end"}),e.jsx(t,{data:x,defaultValue:["option1"]})]})}),e.jsx(s,{title:"Description",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:r}),e.jsx(t,{data:r,align:"end"}),e.jsx(t,{data:r,defaultValue:["option1"]})]})}),e.jsx(s,{title:"Box",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:r,box:!0})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:r,box:!0,align:"end"})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:r,box:!0,defaultValue:["option1"]})})]})}),e.jsx(s,{title:"Group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:h,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:h,defaultValue:["option1"],align:"end"})})]})}),e.jsx(s,{title:"Box group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:h,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:h,box:!0,defaultValue:["option1","option3"],align:"end"})})]})}),e.jsx(s,{title:"Disabled",description:"Default and box types, unselected and selected — the whole item stops being a click target.",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:y,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:y,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:$,box:!0,defaultValue:["option1"]})})]})}),e.jsxs(s,{title:"Extra title",description:'Extra title sits at the right of the label and description, vertically centered. With align="end" it stays between the text and the checkbox. When the content is too wide for the item, it wraps onto several lines, and the label and description column keeps at least half the width.',children:[e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:420},children:e.jsx(t,{data:w,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:w,box:!0,defaultValue:["option1"],align:"end"})})]}),e.jsx("div",{style:{width:420,marginTop:"20px"},children:e.jsx(t,{data:M,box:!0,defaultValue:["option1"]})})]}),e.jsx(s,{title:"Extra content",description:"Extra content is revealed under the description once the item is selected. The whole item is a click target, but nested interactive controls — a link in the description, a switch in the extra content — keep their own behaviour.",children:e.jsx("div",{style:{width:420},children:e.jsx(t,{data:U,box:!0,defaultValue:["option1"]})})})]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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

      <StorySection title="Extra title" description={'Extra title sits at the right of the label and description, vertically centered. With align="end" it ' + 'stays between the text and the checkbox. When the content is too wide for the item, it wraps onto ' + 'several lines, and the label and description column keeps at least half the width.'}>
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

      <StorySection title="Extra content" description={'Extra content is revealed under the description once the item is selected. The whole item is a click ' + 'target, but nested interactive controls — a link in the description, a switch in the extra content — ' + 'keep their own behaviour.'}>
        <div style={{
        width: 420
      }}>
          <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...u.parameters?.docs?.source}}};const ae=["AllVariants"];export{u as AllVariants,ae as __namedExportsOrder,ie as default};
