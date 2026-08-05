import{r as j,j as e,c as u,b as H}from"./iframe-DDMqSXul.js";import{C as P}from"./checkbox-CkndReWd.js";import{B as s}from"./badge-Cyqq1gQt.js";import{L as y}from"./label-Dz3Q6mWi.js";import{S as w}from"./separator-Cc_T2enW.js";import{S as k}from"./switch-BItIlVge.js";import{S as M,a as n,b as O}from"./story-section-29Pt7KkT.js";import{S as m}from"./story-error-field-DUfizuM7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DnBA83kq.js";import"./check-Dl2pt11_.js";import"./x-nQNHfXDX.js";import"./index-CrIDshkt.js";const U=H({slots:{base:"flex flex-col gap-2 w-full",item:"w-full",itemDisabled:"opacity-50 cursor-not-allowed",label:"block w-full cursor-pointer",box:"border rounded-md border-input has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",boxChecked:"border-primary bg-accent",checkboxInBox:"focus-visible:ring-0 focus-visible:outline-none",checkboxDisabled:"disabled:opacity-100",itemContainer:"flex items-center gap-3",contentWrapper:"flex flex-1 flex-col items-start gap-1.5",labelContent:"flex w-full items-start gap-2",content:"flex flex-col flex-1 gap-1.5 pt-0.5",title:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",extraContent:"w-full"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}},invalid:{true:{title:"text-destructive",box:"has-[:focus-visible]:ring-destructive/50",boxChecked:"border-destructive bg-alert-error/20"}}},defaultVariants:{align:"start"}});function t({align:l="start",className:r,data:h,box:d,value:N,defaultValue:R,onValueChange:D,name:B,"aria-invalid":b,...q}){const a=U({align:l,invalid:b===!0||b==="true"}),A=j.useId(),[I,$]=j.useState(R??[]),C=N!==void 0,S=C?N:I,L=(i,c)=>{let o=S.filter(p=>p!==i);c&&(o=[...o,i]),C||$(o),D?.(o)};return e.jsx("div",{role:"group","data-slot":"checkbox-group","aria-invalid":b,className:a.base({className:r}),...q,children:h.map(i=>{const c=S.includes(i.id),o=i.disabled,p=`${A}-${i.id}`,V=`${p}-label`,T=`${p}-description`;return e.jsx("div",{"data-slot":"checkbox-group-item","data-state":c?"checked":"unchecked","data-disabled":o||void 0,className:u(a.item(),d&&a.box(),d&&c&&a.boxChecked(),o&&a.itemDisabled()),children:e.jsxs("div",{className:u(a.itemContainer(),d&&"p-4"),children:[e.jsx(P,{id:p,name:B,value:i.id,checked:c,disabled:o,className:u(d&&a.checkboxInBox(),o?a.checkboxDisabled():"cursor-pointer"),"aria-invalid":b,"aria-labelledby":V,"aria-describedby":i.description?T:void 0,onCheckedChange:_=>L(i.id,_===!0)}),e.jsxs("div",{className:a.contentWrapper(),children:[e.jsx("label",{htmlFor:p,className:u(a.label(),o&&"cursor-not-allowed"),children:e.jsxs("div",{className:a.labelContent(),children:[e.jsxs("div",{className:u(a.content()),children:[e.jsx("span",{id:V,className:a.title(),children:i.label}),i.description&&e.jsx("span",{id:T,className:a.description(),children:i.description})]}),i.extraTitle&&e.jsx("div",{"data-slot":"checkbox-group-item-extra-title",children:i.extraTitle})]})}),c&&i.extraContent&&e.jsx("div",{"data-slot":"checkbox-group-item-extra",className:a.extraContent(),children:i.extraContent})]})]})},i.id)})})}t.__docgenInfo={description:"",methods:[],displayName:"CheckboxGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  extraTitle?: React.ReactNode;
  extraContent?: React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"extraTitle",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"extraContent",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}}]}}],raw:"CheckboxGroupFieldItem[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},value:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultValue:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"value"}],return:{name:"void"}}},description:""},name:{required:!1,tsType:{name:"string"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const ue={title:"Components/Inputs/Checkbox Group",component:t,args:{}},z=[{id:"option1err",label:"Horse"},{id:"option2err",label:"Red panda"},{id:"option3err",label:"Otter"}];function W(l){const r=`${l}-extra-switch`;return[{id:"option1box",label:"Horse",description:"This is a description.",extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(w,{style:{marginTop:"16px"}}),e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{id:r}),e.jsx(y,{htmlFor:r,className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2box",label:"Red panda",description:"This is a description."}]}const J=W("error-box"),K=W("error-checked-box"),Q=[{id:"option1box",label:"Horse",description:"This is a description."},{id:"option2box",label:"Red panda",description:"This is a description."}];function X(){const[l,r]=j.useState([]),[h,d]=j.useState([]);return e.jsxs("div",{className:"flex flex-col gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(O,{children:"Empty — the error clears as soon as an option is picked, and comes back if all are cleared"}),e.jsxs("div",{className:"flex gap-20",children:[e.jsx(m,{label:"What is your favorite animal?",error:"Please pick at least one option",invalid:l.length===0,children:e.jsx(t,{value:l,onValueChange:r,"aria-invalid":l.length===0,data:z,style:{marginLeft:"16px"}})}),e.jsx(m,{label:"What is your favorite animal?",error:"Please pick at least one option",invalid:h.length===0,width:420,children:e.jsx(t,{box:!0,value:h,onValueChange:d,"aria-invalid":h.length===0,data:J})})]})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(O,{children:"Checked while still in error"}),e.jsxs("div",{className:"flex gap-20",children:[e.jsx(m,{label:"What is your favorite animal?",error:"Please pick at least one option",width:420,children:e.jsx(t,{"aria-invalid":!0,defaultValue:["option1box"],data:Q})}),e.jsx(m,{label:"What is your favorite animal?",error:"Please pick at least one option",width:420,children:e.jsx(t,{box:!0,"aria-invalid":!0,defaultValue:["option1box"],data:K})})]})]})]})}const f=[{id:"option1",label:"Option 1"}],x=[{id:"option1",label:"Option 1",description:"This is option 1"}],v=[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],E=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],Y=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0,extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(w,{style:{marginTop:"16px"}}),e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{id:"option1-disabled-extra-switch",disabled:!0}),e.jsx(y,{htmlFor:"option1-disabled-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],F=[{id:"option1",label:"Option 1",description:"This is option 1",extraTitle:e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-1.5",children:[e.jsx(s,{variant:"green",children:"Recommended"}),e.jsx(s,{variant:"blue",children:"SNV"}),e.jsx(s,{variant:"violet",children:"WGS"})]})},{id:"option2",label:"Option 2",description:"This is option 2",extraTitle:e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-1.5",children:[e.jsx(s,{variant:"amber",children:"Beta"}),e.jsx(s,{variant:"cyan",children:"CNV"})]})}],Z=[{id:"option1",label:"Option 1",description:"This is option 1",extraTitle:e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-1.5",style:{width:160},children:[e.jsx(s,{variant:"green",children:"Recommended"}),e.jsx(s,{variant:"blue",children:"SNV"}),e.jsx(s,{variant:"violet",children:"WGS"}),e.jsx(s,{variant:"cyan",children:"CNV"}),e.jsx(s,{variant:"amber",children:"Beta"}),e.jsx(s,{variant:"neutral",children:"Deprecated"})]})}],G=[{id:"option1",label:"Option 1",description:e.jsxs(e.Fragment,{children:["This is option 1."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]}),extraTitle:e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-1.5",children:[e.jsx(s,{variant:"green",children:"Recommended"}),e.jsx(s,{variant:"blue",children:"SNV"})]}),extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(w,{style:{marginTop:"16px"}}),e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(k,{id:"option1-extra-switch"}),e.jsx(y,{htmlFor:"option1-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:e.jsxs(e.Fragment,{children:["This is option 2."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]})}],g={args:{data:f},render:()=>e.jsxs(M,{children:[e.jsx(n,{title:"Basic",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:f}),e.jsx(t,{data:f,align:"end"}),e.jsx(t,{data:f,defaultValue:["option1"]})]})}),e.jsx(n,{title:"Description",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:x}),e.jsx(t,{data:x,align:"end"}),e.jsx(t,{data:x,defaultValue:["option1"]})]})}),e.jsx(n,{title:"Box",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,box:!0})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,box:!0,align:"end"})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,box:!0,defaultValue:["option1"]})})]})}),e.jsx(n,{title:"Group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:v,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:v,defaultValue:["option1"],align:"end"})})]})}),e.jsx(n,{title:"Box group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:v,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:v,box:!0,defaultValue:["option1","option3"],align:"end"})})]})}),e.jsx(n,{title:"Disabled",description:"Default and box types, unselected and selected — the whole item stops being a click target.",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:E,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:E,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:Y,box:!0,defaultValue:["option1"]})})]})}),e.jsxs(n,{title:"Extra title",description:'Extra title is a generic slot at the right of the label and description — the content brings its own layout and its own width. With align="end" it stays between the text and the checkbox.',children:[e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:420},children:e.jsx(t,{data:F,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:F,box:!0,defaultValue:["option1"],align:"end"})})]}),e.jsx("div",{style:{width:420,marginTop:"20px"},children:e.jsx(t,{data:Z,box:!0,defaultValue:["option1"]})})]}),e.jsx(n,{title:"Extra content",description:"Extra content is a generic slot revealed under the label, description and extra title once the item is selected, and spans the same width — the content brings its own layout.",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:420},children:e.jsx(t,{data:G,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:G,box:!0,defaultValue:["option1"],align:"end"})})]})}),e.jsx(n,{title:"Error",description:"In error, the field label, the message, the option labels and the checkboxes turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.",children:e.jsx(X,{})})]})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const be=["AllVariants"];export{g as AllVariants,be as __namedExportsOrder,ue as default};
