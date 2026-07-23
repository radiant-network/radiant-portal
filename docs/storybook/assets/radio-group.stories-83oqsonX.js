import{r as x,j as i,c as h,b as m}from"./iframe-DUYxWSE4.js";import{R as g,a as f}from"./radio-group-DnfW14VE.js";import{S as O,a}from"./story-section-BP93x530.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIzFjBAZ.js";import"./index-d-V1lAha.js";import"./index-viTvDaxJ.js";import"./circle-CnzHj9YT.js";const T=m({slots:{base:"flex gap-2 w-full max-w-[228px] cursor-pointer justify-between",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",box:"border p-4 rounded-md border-input",boxChecked:"border-primary bg-accent",itemContainer:"flex items-center gap-3"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function o({align:p="start",className:s,data:r,box:l,...d}){const e=T({align:p}),[c,u]=x.useState(d.defaultValue);return i.jsx("div",{className:e.base({className:s}),children:i.jsx(g,{onValueChange:t=>{u(t),d.onValueChange?.(t)},...d,children:r.map(t=>{const b=c===t.id;return i.jsx("label",{htmlFor:t.id,className:h(l&&e.box({className:s}),l&&b&&e.boxChecked({className:s}),"cursor-pointer"),children:i.jsxs("div",{className:e.itemContainer(),children:[i.jsx(f,{id:t.id,value:t.id}),i.jsxs("div",{className:"flex flex-col flex-1 gap-1.5 pt-0.5",children:[i.jsx("span",{className:e.label(),children:t.label}),t.description&&i.jsx("span",{className:e.description(),children:t.description})]})]})},t.id)})})})}o.__docgenInfo={description:"",methods:[],displayName:"RadioGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ id: string; label: string; description?: string }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}}]}}],raw:"{ id: string; label: string; description?: string }[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const N={title:"Components/Inputs/Radio Group",component:o,args:{}},n={args:{data:[{id:"option1",label:"Option 1"}]},render:()=>i.jsxs(O,{children:[i.jsx(a,{title:"Basic",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(o,{data:[{id:"option1a",label:"Option 1"}]}),i.jsx(o,{data:[{id:"option1b",label:"Option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1c",label:"Option 1"}],defaultValue:"option1c"})]})}),i.jsx(a,{title:"Description",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(o,{data:[{id:"option1aa",label:"Option 1",description:"This is option 1"}]}),i.jsx(o,{data:[{id:"option1bb",label:"Option 1",description:"This is option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1cc",label:"Option 1",description:"This is option 1"}],defaultValue:"option1cc"})]})}),i.jsx(a,{title:"Group",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(o,{data:[{id:"option1aaa",label:"Option 1",description:"This is option 1"},{id:"option2bbb",label:"Option 2",description:"This is option 2"},{id:"option3ccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaa"}),i.jsx(o,{data:[{id:"option1aaaa",label:"Option 1",description:"This is option 1"},{id:"option2bbbb",label:"Option 2",description:"This is option 2"},{id:"option3cccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaaa",align:"end"})]})}),i.jsx(a,{title:"Box group",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(o,{data:[{id:"option1d",label:"Option 1",description:"This is option 1"},{id:"option2e",label:"Option 2",description:"This is option 2"},{id:"option3f",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1d"}),i.jsx(o,{data:[{id:"option1g",label:"Option 1",description:"This is option 1"},{id:"option2h",label:"Option 2",description:"This is option 2"},{id:"option3i",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1g",align:"end"})]})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      id: 'option1',
      label: 'Option 1'
    }]
  },
  render: () => <StoryShowcase>
      <StorySection title="Basic">
        <div className="flex gap-20">
          <RadioGroupField data={[{
          id: 'option1a',
          label: 'Option 1'
        }]} />
          <RadioGroupField data={[{
          id: 'option1b',
          label: 'Option 1'
        }]} align="end" />
          <RadioGroupField data={[{
          id: 'option1c',
          label: 'Option 1'
        }]} defaultValue="option1c" />
        </div>
      </StorySection>

      <StorySection title="Description">
        <div className="flex gap-20">
          <RadioGroupField data={[{
          id: 'option1aa',
          label: 'Option 1',
          description: 'This is option 1'
        }]} />
          <RadioGroupField data={[{
          id: 'option1bb',
          label: 'Option 1',
          description: 'This is option 1'
        }]} align="end" />
          <RadioGroupField data={[{
          id: 'option1cc',
          label: 'Option 1',
          description: 'This is option 1'
        }]} defaultValue="option1cc" />
        </div>
      </StorySection>

      <StorySection title="Group">
        <div className="flex gap-20">
          <RadioGroupField data={[{
          id: 'option1aaa',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2bbb',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3ccc',
          label: 'Option 3',
          description: 'This is option 3'
        }]} defaultValue="option1aaa" />
          <RadioGroupField data={[{
          id: 'option1aaaa',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2bbbb',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3cccc',
          label: 'Option 3',
          description: 'This is option 3'
        }]} defaultValue="option1aaaa" align="end" />
        </div>
      </StorySection>

      <StorySection title="Box group">
        <div className="flex gap-20">
          <RadioGroupField data={[{
          id: 'option1d',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2e',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3f',
          label: 'Option 3',
          description: 'This is option 3'
        }]} box defaultValue="option1d" />
          <RadioGroupField data={[{
          id: 'option1g',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2h',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3i',
          label: 'Option 3',
          description: 'This is option 3'
        }]} box defaultValue="option1g" align="end" />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...n.parameters?.docs?.source}}};const C=["AllVariants"];export{n as AllVariants,C as __namedExportsOrder,N as default};
