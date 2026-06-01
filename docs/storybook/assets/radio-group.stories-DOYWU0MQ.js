import{r as b,j as i,c as x,f}from"./iframe-CgYzld9M.js";import{R as m,a as g}from"./radio-group-CnDrqOk0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CPRKa62s.js";import"./index-D5qyD-5a.js";import"./index-BU8vtByU.js";import"./circle-BJPs1Iry.js";const h=f({slots:{base:"flex gap-2 w-full max-w-[228px] cursor-pointer justify-between",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",box:"border p-4 rounded-md border-input",boxChecked:"border-primary bg-accent",itemContainer:"flex items-center gap-3"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function o({align:d="start",className:s,data:p,box:l,...n}){const a=h({align:d}),[r,c]=b.useState(n.defaultValue);return i.jsx("div",{className:a.base({className:s}),children:i.jsx(m,{onValueChange:e=>{c(e),n.onValueChange?.(e)},...n,children:p.map(e=>{const u=r===e.id;return i.jsx("label",{htmlFor:e.id,className:x(l&&a.box({className:s}),l&&u&&a.boxChecked({className:s}),"cursor-pointer"),children:i.jsxs("div",{className:a.itemContainer(),children:[i.jsx(g,{id:e.id,value:e.id}),i.jsxs("div",{className:"flex flex-col flex-1 gap-1.5 pt-0.5",children:[i.jsx("span",{className:a.label(),children:e.label}),e.description&&i.jsx("span",{className:a.description(),children:e.description})]})]})},e.id)})})})}o.__docgenInfo={description:"",methods:[],displayName:"RadioGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ id: string; label: string; description?: string }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}}]}}],raw:"{ id: string; label: string; description?: string }[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const R={title:"Inputs/Radio Group",component:o,args:{}},t={args:{data:[{id:"option1",label:"Option 1"}]},render:()=>i.jsxs("div",{className:"flex flex-col gap-10",children:[i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Basic"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1a",label:"Option 1"}]}),i.jsx(o,{data:[{id:"option1b",label:"Option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1c",label:"Option 1"}],defaultValue:"option1c"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Description"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1aa",label:"Option 1",description:"This is option 1"}]}),i.jsx(o,{data:[{id:"option1bb",label:"Option 1",description:"This is option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1cc",label:"Option 1",description:"This is option 1"}],defaultValue:"option1cc"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1aaa",label:"Option 1",description:"This is option 1"},{id:"option2bbb",label:"Option 2",description:"This is option 2"},{id:"option3ccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaa"}),i.jsx(o,{data:[{id:"option1aaaa",label:"Option 1",description:"This is option 1"},{id:"option2bbbb",label:"Option 2",description:"This is option 2"},{id:"option3cccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaaa",align:"end"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Box group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1d",label:"Option 1",description:"This is option 1"},{id:"option2e",label:"Option 2",description:"This is option 2"},{id:"option3f",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1d"}),i.jsx(o,{data:[{id:"option1g",label:"Option 1",description:"This is option 1"},{id:"option2h",label:"Option 2",description:"This is option 2"},{id:"option3i",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1g",align:"end"})]})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      id: 'option1',
      label: 'Option 1'
    }]
  },
  render: () => <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Basic</span>
        <div className="flex gap-2">
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
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Description</span>
        <div className="flex gap-2">
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
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Group</span>
        <div className="flex gap-2">
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
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Box group</span>
        <div className="flex gap-2">
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
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};const F=["Default"];export{t as Default,F as __namedExportsOrder,R as default};
