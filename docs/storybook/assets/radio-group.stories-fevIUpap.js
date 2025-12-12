import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./index-CBYaBgW8.js";import{c as g}from"./index-C66Dxnp2.js";import{R as h,a as O}from"./radio-group-DekDLgvf.js";import{c as v}from"./utils-CDN07tui.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-BCzuw4Jg.js";import"./index-DnEzm5An.js";import"./index-BL8Z-moU.js";import"./index-C2iKAgIe.js";import"./index-SF2qmtPV.js";import"./index-CWHKeK-O.js";const j=g({slots:{base:"flex gap-2 w-full max-w-[228px] cursor-pointer justify-between",label:"text-sm font-medium text-foreground",description:"text-sm text-muted-foreground font-normal",box:"border p-4 rounded-md border-input",boxChecked:"border-primary bg-accent",itemContainer:"flex items-center gap-3"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function o({align:u="start",className:l,data:m,box:d,...t}){const a=j({align:u}),[x,f]=b.useState(t.defaultValue);return i.jsx("div",{className:a.base({className:l}),children:i.jsx(h,{onValueChange:e=>{var s;f(e),(s=t.onValueChange)==null||s.call(t,e)},...t,children:m.map(e=>{const s=x===e.id;return i.jsx("div",{className:v(d&&a.box({className:l}),d&&s&&a.boxChecked({className:l})),children:i.jsxs("div",{className:a.itemContainer(),children:[i.jsx(O,{id:e.id,value:e.id}),i.jsxs("div",{className:"flex flex-col flex-1 gap-1.5",children:[i.jsx("label",{htmlFor:e.id,className:a.label(),children:e.label}),e.description&&i.jsx("span",{className:a.description(),children:e.description})]})]})},e.id)})})})}o.__docgenInfo={description:"",methods:[],displayName:"RadioGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ id: string; label: string; description?: string }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}}]}}],raw:"{ id: string; label: string; description?: string }[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const A={title:"Inputs/Radio Group",component:o,args:{}},n={args:{data:[{id:"option1",label:"Option 1"}]},render:()=>i.jsxs("div",{className:"flex flex-col gap-10",children:[i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Basic"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1",label:"Option 1"}]}),i.jsx(o,{data:[{id:"option1",label:"Option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1",label:"Option 1"}],defaultValue:"option1"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Description"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"}]}),i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"}],defaultValue:"option1"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],defaultValue:"option1"}),i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],defaultValue:"option1",align:"end"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Box group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1"}),i.jsx(o,{data:[{id:"option1",label:"Option 1",description:"This is option 1"},{id:"option2",label:"Option 2",description:"This is option 2"},{id:"option3",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1",align:"end"})]})]})]})};var p,r,c;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
          id: 'option1',
          label: 'Option 1'
        }]} />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1'
        }]} align="end" />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1'
        }]} defaultValue="option1" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Description</span>
        <div className="flex gap-2">
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }]} />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }]} align="end" />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }]} defaultValue="option1" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Group</span>
        <div className="flex gap-2">
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3',
          label: 'Option 3',
          description: 'This is option 3'
        }]} defaultValue="option1" />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3',
          label: 'Option 3',
          description: 'This is option 3'
        }]} defaultValue="option1" align="end" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Box group</span>
        <div className="flex gap-2">
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3',
          label: 'Option 3',
          description: 'This is option 3'
        }]} box defaultValue="option1" />
          <RadioGroupField data={[{
          id: 'option1',
          label: 'Option 1',
          description: 'This is option 1'
        }, {
          id: 'option2',
          label: 'Option 2',
          description: 'This is option 2'
        }, {
          id: 'option3',
          label: 'Option 3',
          description: 'This is option 3'
        }]} box defaultValue="option1" align="end" />
        </div>
      </div>
    </div>
}`,...(c=(r=n.parameters)==null?void 0:r.docs)==null?void 0:c.source}}};const z=["Default"];export{n as Default,z as __namedExportsOrder,A as default};
