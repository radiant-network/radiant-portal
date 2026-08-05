import{r as b,j as i,c as G,b as R}from"./iframe-BzMpq4Hc.js";import{R as N,a as C}from"./radio-group-CqSuFaQg.js";import{S as F,a as s,b as m}from"./story-section-DVNANUlR.js";import{S as p}from"./story-error-field-FbozJQY9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cc45Ah96.js";import"./index-BG0WSpn-.js";import"./index-BeQDYjR0.js";import"./circle-Cikc3-Oi.js";import"./index-B5eiDOej.js";import"./label-CSyXSd-r.js";import"./separator-BoZNDwc5.js";const E=R({slots:{base:"flex gap-2 w-full max-w-[228px] cursor-pointer justify-between",label:"text-sm font-medium text-foreground leading-none",description:"text-sm text-muted-foreground font-normal",box:"border p-4 rounded-md border-input",boxChecked:"border-primary bg-accent",itemContainer:"flex items-center gap-3"},variants:{align:{start:{itemContainer:"flex items-start gap-3"},end:{itemContainer:"flex items-start gap-3 flex-row-reverse"}},invalid:{true:{label:"text-destructive",boxChecked:"border-destructive bg-alert-error/20"}}},defaultVariants:{align:"start"}});function e({align:o="start",className:n,data:r,box:l,value:u,defaultValue:x,onValueChange:O,"aria-invalid":d,...y}){const a=E({align:o,invalid:d===!0||d==="true"}),[S,T]=b.useState(x),h=u!==void 0,V=h?u:S,k=t=>{h||T(t),O?.(t)};return i.jsx("div",{className:a.base({className:n}),children:i.jsx(N,{...y,"aria-invalid":d,value:u,defaultValue:x,onValueChange:k,children:r.map(t=>{const w=V===t.id;return i.jsx("label",{htmlFor:t.id,className:G(l&&a.box({className:n}),l&&w&&a.boxChecked({className:n}),"cursor-pointer"),children:i.jsxs("div",{className:a.itemContainer(),children:[i.jsx(C,{id:t.id,value:t.id,"aria-invalid":d}),i.jsxs("div",{className:"flex flex-col flex-1 gap-1.5 pt-0.5",children:[i.jsx("span",{className:a.label(),children:t.label}),t.description&&i.jsx("span",{className:a.description(),children:t.description})]})]})},t.id)})})})}e.__docgenInfo={description:"",methods:[],displayName:"RadioGroupField",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ id: string; label: string; description?: string }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}}]}}],raw:"{ id: string; label: string; description?: string }[]"},description:""},box:{required:!1,tsType:{name:"boolean"},description:""},align:{defaultValue:{value:"'start'",computed:!1},required:!1}}};const M={title:"Components/Inputs/Radio Group",component:e,args:{}},j=[{id:"option1err",label:"18 and under"},{id:"option2err",label:"19 - 60"},{id:"option3err",label:"60 and over"}],v=[{id:"option1box",label:"18 and under",description:"Enjoy your young"},{id:"option2box",label:"19 - 60",description:"Be brave"},{id:"option3box",label:"60 and over",description:"Enjoy no work anymore"}],f=j.map(o=>({...o,id:`${o.id}-checked`})),g=v.map(o=>({...o,id:`${o.id}-checked`}));function B(){const[o,n]=b.useState(),[r,l]=b.useState();return i.jsxs("div",{className:"flex flex-col gap-8",children:[i.jsxs("div",{className:"flex flex-col gap-3",children:[i.jsx(m,{children:"Empty — the error clears as soon as an option is picked, and comes back if it is cleared"}),i.jsxs("div",{className:"flex gap-20",children:[i.jsx(p,{label:"How old are you?",error:"Please pick an option",invalid:!o,children:i.jsx(e,{value:o,onValueChange:n,"aria-invalid":!o,data:j,style:{marginLeft:"16px"}})}),i.jsx(p,{label:"How old are you?",error:"Please pick an option",invalid:!r,children:i.jsx(e,{box:!0,value:r,onValueChange:l,"aria-invalid":!r,data:v})})]})]}),i.jsxs("div",{className:"flex flex-col gap-3",children:[i.jsx(m,{children:"Checked while still in error — the box turns red and gets a pale red fill; without a box, only the dot appears"}),i.jsxs("div",{className:"flex gap-20",children:[i.jsx(p,{label:"How old are you?",error:"Please pick an option",children:i.jsx(e,{"aria-invalid":!0,defaultValue:f[1].id,data:f,style:{marginLeft:"16px"}})}),i.jsx(p,{label:"How old are you?",error:"Please pick an option",children:i.jsx(e,{box:!0,"aria-invalid":!0,defaultValue:g[1].id,data:g})})]})]})]})}const c={args:{data:[{id:"option1",label:"Option 1"}]},render:()=>i.jsxs(F,{children:[i.jsx(s,{title:"Basic",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(e,{data:[{id:"option1a",label:"Option 1"}]}),i.jsx(e,{data:[{id:"option1b",label:"Option 1"}],align:"end"}),i.jsx(e,{data:[{id:"option1c",label:"Option 1"}],defaultValue:"option1c"})]})}),i.jsx(s,{title:"Description",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(e,{data:[{id:"option1aa",label:"Option 1",description:"This is option 1"}]}),i.jsx(e,{data:[{id:"option1bb",label:"Option 1",description:"This is option 1"}],align:"end"}),i.jsx(e,{data:[{id:"option1cc",label:"Option 1",description:"This is option 1"}],defaultValue:"option1cc"})]})}),i.jsx(s,{title:"Group",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(e,{data:[{id:"option1aaa",label:"Option 1",description:"This is option 1"},{id:"option2bbb",label:"Option 2",description:"This is option 2"},{id:"option3ccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaa"}),i.jsx(e,{data:[{id:"option1aaaa",label:"Option 1",description:"This is option 1"},{id:"option2bbbb",label:"Option 2",description:"This is option 2"},{id:"option3cccc",label:"Option 3",description:"This is option 3"}],defaultValue:"option1aaaa",align:"end"})]})}),i.jsx(s,{title:"Box group",children:i.jsxs("div",{className:"flex gap-20",children:[i.jsx(e,{data:[{id:"option1d",label:"Option 1",description:"This is option 1"},{id:"option2e",label:"Option 2",description:"This is option 2"},{id:"option3f",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1d"}),i.jsx(e,{data:[{id:"option1g",label:"Option 1",description:"This is option 1"},{id:"option2h",label:"Option 2",description:"This is option 2"},{id:"option3i",label:"Option 3",description:"This is option 3"}],box:!0,defaultValue:"option1g",align:"end"})]})}),i.jsx(s,{title:"Error",description:"In error, the field label, the message, the option labels and the radio circles turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.",children:i.jsx(B,{})})]})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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

      <StorySection title="Error" description="In error, the field label, the message, the option labels and the radio circles turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.">
        <RadioGroupErrorDemo />
      </StorySection>
    </StoryShowcase>
}`,...c.parameters?.docs?.source}}};const Q=["AllVariants"];export{c as AllVariants,Q as __namedExportsOrder,M as default};
