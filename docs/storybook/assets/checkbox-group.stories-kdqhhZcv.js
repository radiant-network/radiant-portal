import{r as v,j as e,c,b as q}from"./iframe-Ba5Iybcr.js";import{C as W}from"./checkbox-vH5nwXQs.js";import{S as I}from"./separator-D1idYbj8.js";import{L as y}from"./label-B7UtrO04.js";import{S as w}from"./switch-DOitDu3b.js";import{S as A,a as s}from"./story-section-5UYrVqPJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DmuAEkKK.js";import"./check-C9wVWpMx.js";const B=q({slots:{base:"flex flex-col gap-2 w-full",item:"w-full",itemDisabled:"opacity-50 cursor-not-allowed",itemLabel:"block cursor-pointer",box:"border rounded-md border-input has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",boxChecked:"border-primary bg-accent",checkboxInBox:"focus-visible:ring-0 focus-visible:outline-none",checkboxDisabled:"disabled:opacity-100",itemContainer:"flex items-center gap-3",content:"flex flex-col flex-1 gap-1.5 pt-0.5",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",extraContent:"flex flex-col gap-4"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function t({align:k="start",className:C,data:S,box:r,value:h,defaultValue:N,onValueChange:V,name:O,...F}){const a=B({align:k}),G=v.useId(),[D,T]=v.useState(N??[]),m=h!==void 0,b=m?h:D,E=(i,n)=>{let o=b.filter(d=>d!==i);n&&(o=[...o,i]),m||T(o),V?.(o)};return e.jsx("div",{role:"group","data-slot":"checkbox-group",className:a.base({className:C}),...F,children:S.map(i=>{const n=b.includes(i.id),o=i.disabled,d=`${G}-${i.id}`,f=`${d}-label`,g=`${d}-description`;return e.jsxs("div",{"data-slot":"checkbox-group-item","data-state":n?"checked":"unchecked","data-disabled":o||void 0,className:c(a.item(),r&&a.box(),r&&n&&a.boxChecked(),o&&a.itemDisabled()),children:[e.jsx("label",{htmlFor:d,className:c(a.itemLabel(),r&&"p-4",o&&"cursor-not-allowed"),children:e.jsxs("div",{className:a.itemContainer(),children:[e.jsx(W,{id:d,name:O,value:i.id,checked:n,disabled:o,className:c(r&&a.checkboxInBox(),o&&a.checkboxDisabled()),"aria-labelledby":f,"aria-describedby":i.description?g:void 0,onCheckedChange:R=>E(i.id,R===!0)}),e.jsxs("div",{className:a.content(),children:[e.jsx("span",{id:f,className:a.label(),children:i.label}),i.description&&e.jsx("span",{id:g,className:a.description(),children:i.description})]})]})}),n&&i.extraContent&&e.jsxs("div",{"data-slot":"checkbox-group-item-extra",className:c(a.extraContent(),r?"px-4 pb-4":"mt-4"),children:[e.jsx(I,{}),i.extraContent]})]},i.id)})})}t.__docgenInfo={description:"",methods:[],displayName:"CheckboxGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: string;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  extraContent?: React.ReactNode;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"extraContent",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!1}}]}}],raw:"CheckboxGroupFieldItem[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},value:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},defaultValue:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"value"}],return:{name:"void"}}},description:""},name:{required:!1,tsType:{name:"string"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const Y={title:"Components/Inputs/Checkbox Group",component:t,args:{}},p=[{id:"option1",label:"Option 1"}],l=[{id:"option1",label:"Option 1",description:"This is option 1"}],x=[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],j=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],L=[{id:"option1",label:"Option 1",description:"This is option 1",disabled:!0,extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(w,{id:"option1-disabled-extra-switch",disabled:!0}),e.jsx(y,{htmlFor:"option1-disabled-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:"This is option 2",disabled:!0}],_=[{id:"option1",label:"Option 1",description:e.jsxs(e.Fragment,{children:["This is option 1."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]}),extraContent:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("span",{className:"text-sm font-medium text-foreground",children:["Extra content ",e.jsx("span",{className:"text-destructive",children:"*"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(w,{id:"option1-extra-switch"}),e.jsx(y,{htmlFor:"option1-extra-switch",className:"text-sm font-normal",children:"An option nested in the extra content"})]})]})},{id:"option2",label:"Option 2",description:e.jsxs(e.Fragment,{children:["This is option 2."," ",e.jsx("a",{href:"#",className:"text-primary underline underline-offset-4",children:"View permissions"})]})}],u={args:{data:p},render:()=>e.jsxs(A,{children:[e.jsx(s,{title:"Basic",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:p}),e.jsx(t,{data:p,align:"end"}),e.jsx(t,{data:p,defaultValue:["option1"]})]})}),e.jsx(s,{title:"Description",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx(t,{data:l}),e.jsx(t,{data:l,align:"end"}),e.jsx(t,{data:l,defaultValue:["option1"]})]})}),e.jsx(s,{title:"Box",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:l,box:!0})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:l,box:!0,align:"end"})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:l,box:!0,defaultValue:["option1"]})})]})}),e.jsx(s,{title:"Group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,defaultValue:["option1"],align:"end"})})]})}),e.jsx(s,{title:"Box group",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:x,box:!0,defaultValue:["option1","option3"],align:"end"})})]})}),e.jsx(s,{title:"Disabled",description:"Default and box types, unselected and selected — the whole item stops being a click target.",children:e.jsxs("div",{className:"flex gap-20",children:[e.jsx("div",{style:{width:280},children:e.jsx(t,{data:j,defaultValue:["option1"]})}),e.jsx("div",{style:{width:280},children:e.jsx(t,{data:j,box:!0,defaultValue:["option1"]})}),e.jsx("div",{style:{width:420},children:e.jsx(t,{data:L,box:!0,defaultValue:["option1"]})})]})}),e.jsx(s,{title:"Extra content",description:"Extra content is revealed under the description once the item is selected. The whole item is a click target, but nested interactive controls — a link in the description, a switch in the extra content — keep their own behaviour.",children:e.jsx("div",{style:{width:420},children:e.jsx(t,{data:_,box:!0,defaultValue:["option1"]})})})]})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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

      <StorySection title="Extra content" description={'Extra content is revealed under the description once the item is selected. The whole item is a click ' + 'target, but nested interactive controls — a link in the description, a switch in the extra content — ' + 'keep their own behaviour.'}>
        <div style={{
        width: 420
      }}>
          <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...u.parameters?.docs?.source}}};const Z=["AllVariants"];export{u as AllVariants,Z as __namedExportsOrder,Y as default};
