import{f as m,r as g,j as i,c as h}from"./iframe-QXLGoJMs.js";import{R as O,a as v}from"./radio-group-CFqn6YxB.js";import"./preload-helper-Dp1pzeXC.js";import"./circle-CPaoXLVL.js";import"./index-B231b3xm.js";import"./index-RG2AGCvg.js";const j=m({slots:{base:"flex gap-2 w-full max-w-[228px] cursor-pointer justify-between",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",box:"border p-4 rounded-md border-input",boxChecked:"border-primary bg-accent",itemContainer:"flex items-center gap-3"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}}},defaultVariants:{align:"start"}});function o({align:u="start",className:l,data:b,box:d,...t}){const a=j({align:u}),[x,f]=g.useState(t.defaultValue);return i.jsx("div",{className:a.base({className:l}),children:i.jsx(O,{onValueChange:e=>{var s;f(e),(s=t.onValueChange)==null||s.call(t,e)},...t,children:b.map(e=>{const s=x===e.id;return i.jsx("label",{htmlFor:e.id,className:h(d&&a.box({className:l}),d&&s&&a.boxChecked({className:l}),"cursor-pointer"),children:i.jsxs("div",{className:a.itemContainer(),children:[i.jsx(v,{id:e.id,value:e.id}),i.jsxs("div",{className:"flex flex-col flex-1 gap-1.5 pt-0.5",children:[i.jsx("span",{className:a.label(),children:e.label}),e.description&&i.jsx("span",{className:a.description(),children:e.description})]})]})},e.id)})})})}o.__docgenInfo={description:"",methods:[],displayName:"RadioGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ id: string; label: string; description?: string }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}}]}}],raw:"{ id: string; label: string; description?: string }[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const y={title:"Inputs/Radio Group",component:o,args:{}},n={args:{data:[{id:"option1",label:"Option 1"}]},render:()=>i.jsxs("div",{className:"flex flex-col gap-10",children:[i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Basic"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1a",label:"Option 1"}]}),i.jsx(o,{data:[{id:"option1b",label:"Option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1c",label:"Option 1"}],defaultValue:"option1c"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Description"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1aa",label:"Option 1",description:"This is option 1"}]}),i.jsx(o,{data:[{id:"option1bb",label:"Option 1",description:"This is option 1"}],align:"end"}),i.jsx(o,{data:[{id:"option1cc",label:"Option 1",description:"This is option 1"}],defaultValue:"option1cc"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1aaa",label:"Option 1",description:"This is option 1"},{id:"option2bbb",label:"Option 2",description:"This is option 2"},{id:"option3ccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaa"}),i.jsx(o,{data:[{id:"option1aaaa",label:"Option 1",description:"This is option 1"},{id:"option2bbbb",label:"Option 2",description:"This is option 2"},{id:"option3cccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaaa",align:"end"})]})]}),i.jsxs("div",{className:"flex flex-col gap-4",children:[i.jsx("span",{className:"font-semibold",children:"Box group"}),i.jsxs("div",{className:"flex gap-2",children:[i.jsx(o,{data:[{id:"option1d",label:"Option 1",description:"This is option 1"},{id:"option2e",label:"Option 2",description:"This is option 2"},{id:"option3f",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1d"}),i.jsx(o,{data:[{id:"option1g",label:"Option 1",description:"This is option 1"},{id:"option2h",label:"Option 2",description:"This is option 2"},{id:"option3i",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1g",align:"end"})]})]})]})};var p,r,c;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(c=(r=n.parameters)==null?void 0:r.docs)==null?void 0:c.source}}};const C=["Default"];export{n as Default,C as __namedExportsOrder,y as default};
