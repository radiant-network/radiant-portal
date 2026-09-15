import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,r as i,t as a}from"./radio-group-C9g4xe0J.js";import{n as o,t as s}from"./utils-hYbUpBR2.js";import{n as c,t as l}from"./dist-BxNp_DKL.js";import{i as u,n as d,r as f,t as p}from"./story-section-DVTm6cGm.js";import{n as m,t as h}from"./story-error-field-DeLRAi8K.js";function g({align:e=`start`,className:t,data:n,box:i,value:o,defaultValue:c,onValueChange:l,"aria-invalid":u,...d}){let f=y({align:e,invalid:u===!0||u===`true`}),[p,m]=(0,_.useState)(c),h=o!==void 0,g=h?o:p,b=e=>{h||m(e),l?.(e)};return(0,v.jsx)(`div`,{className:f.base({className:t}),children:(0,v.jsx)(a,{...d,"aria-invalid":u,value:o,defaultValue:c,onValueChange:b,children:n.map(e=>{let n=g===e.id;return(0,v.jsx)(`label`,{htmlFor:e.id,className:s(i&&f.box({className:t}),i&&n&&f.boxChecked({className:t}),`cursor-pointer`),children:(0,v.jsxs)(`div`,{className:f.itemContainer(),children:[(0,v.jsx)(r,{id:e.id,value:e.id,"aria-invalid":u}),(0,v.jsxs)(`div`,{className:`flex flex-col flex-1 gap-1.5 pt-0.5`,children:[(0,v.jsx)(`span`,{className:f.label(),children:e.label}),e.description&&(0,v.jsx)(`span`,{className:f.description(),children:e.description})]})]})},e.id)})})})}var _,v,y;function b(){return(b=e((()=>{_=t(),l(),i(),o(),v=n(),y=c({slots:{base:`flex gap-2 w-full max-w-[228px] cursor-pointer justify-between`,label:`text-sm font-medium text-foreground leading-none`,description:`text-sm text-muted-foreground font-normal`,box:`border p-4 rounded-md border-input`,boxChecked:`border-primary bg-accent`,itemContainer:`flex items-center gap-3`},variants:{align:{start:{itemContainer:`flex items-start gap-3`},end:{itemContainer:`flex items-start gap-3 flex-row-reverse`}},invalid:{true:{label:`text-destructive`,boxChecked:`border-destructive bg-alert-error/20`}}},defaultVariants:{align:`start`}}),g.__docgenInfo={description:``,methods:[],displayName:`RadioGroupField`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{ id: string; label: string; description?: string }`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`description`,value:{name:`string`,required:!1}}]}}],raw:`{ id: string; label: string; description?: string }[]`},description:``},box:{required:!1,tsType:{name:`boolean`},description:``},align:{defaultValue:{value:`'start'`,computed:!1},required:!1}}}})))()}function x(){let[e,t]=(0,S.useState)(),[n,r]=(0,S.useState)();return(0,C.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,C.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,C.jsx)(p,{children:`Empty — the error clears as soon as an option is picked, and comes back if it is cleared`}),(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(h,{label:`How old are you?`,error:`Please pick an option`,invalid:!e,children:(0,C.jsx)(g,{value:e,onValueChange:t,"aria-invalid":!e,data:T,style:{marginLeft:`16px`}})}),(0,C.jsx)(h,{label:`How old are you?`,error:`Please pick an option`,invalid:!n,children:(0,C.jsx)(g,{box:!0,value:n,onValueChange:r,"aria-invalid":!n,data:E})})]})]}),(0,C.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,C.jsx)(p,{children:`Checked while still in error — the box turns red and gets a pale red fill; without a box, only the dot appears`}),(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(h,{label:`How old are you?`,error:`Please pick an option`,children:(0,C.jsx)(g,{"aria-invalid":!0,defaultValue:D[1].id,data:D,style:{marginLeft:`16px`}})}),(0,C.jsx)(h,{label:`How old are you?`,error:`Please pick an option`,children:(0,C.jsx)(g,{box:!0,"aria-invalid":!0,defaultValue:O[1].id,data:O})})]})]})]})}var S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{S=t(),b(),u(),m(),C=n(),w={title:`Components/Inputs/Radio Group`,component:g,args:{}},T=[{id:`option1err`,label:`18 and under`},{id:`option2err`,label:`19 - 60`},{id:`option3err`,label:`60 and over`}],E=[{id:`option1box`,label:`18 and under`,description:`Enjoy your young`},{id:`option2box`,label:`19 - 60`,description:`Be brave`},{id:`option3box`,label:`60 and over`,description:`Enjoy no work anymore`}],D=T.map(e=>({...e,id:`${e.id}-checked`})),O=E.map(e=>({...e,id:`${e.id}-checked`})),k={args:{data:[{id:`option1`,label:`Option 1`}]},render:()=>(0,C.jsxs)(f,{children:[(0,C.jsx)(d,{title:`Basic`,children:(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(g,{data:[{id:`option1a`,label:`Option 1`}]}),(0,C.jsx)(g,{data:[{id:`option1b`,label:`Option 1`}],align:`end`}),(0,C.jsx)(g,{data:[{id:`option1c`,label:`Option 1`}],defaultValue:`option1c`})]})}),(0,C.jsx)(d,{title:`Description`,children:(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(g,{data:[{id:`option1aa`,label:`Option 1`,description:`This is option 1`}]}),(0,C.jsx)(g,{data:[{id:`option1bb`,label:`Option 1`,description:`This is option 1`}],align:`end`}),(0,C.jsx)(g,{data:[{id:`option1cc`,label:`Option 1`,description:`This is option 1`}],defaultValue:`option1cc`})]})}),(0,C.jsx)(d,{title:`Group`,children:(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(g,{data:[{id:`option1aaa`,label:`Option 1`,description:`This is option 1`},{id:`option2bbb`,label:`Option 2`,description:`This is option 2`},{id:`option3ccc`,label:`Option 3`,description:`This is option 3`}],defaultValue:`option1aaa`}),(0,C.jsx)(g,{data:[{id:`option1aaaa`,label:`Option 1`,description:`This is option 1`},{id:`option2bbbb`,label:`Option 2`,description:`This is option 2`},{id:`option3cccc`,label:`Option 3`,description:`This is option 3`}],defaultValue:`option1aaaa`,align:`end`})]})}),(0,C.jsx)(d,{title:`Box group`,children:(0,C.jsxs)(`div`,{className:`flex gap-20`,children:[(0,C.jsx)(g,{data:[{id:`option1d`,label:`Option 1`,description:`This is option 1`},{id:`option2e`,label:`Option 2`,description:`This is option 2`},{id:`option3f`,label:`Option 3`,description:`This is option 3`}],box:!0,defaultValue:`option1d`}),(0,C.jsx)(g,{data:[{id:`option1g`,label:`Option 1`,description:`This is option 1`},{id:`option2h`,label:`Option 2`,description:`This is option 2`},{id:`option3i`,label:`Option 3`,description:`This is option 3`}],box:!0,defaultValue:`option1g`,align:`end`})]})}),(0,C.jsx)(d,{title:`Error`,description:`In error, the field label, the message, the option labels and the radio circles turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill.`,children:(0,C.jsx)(x,{})})]})},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}},A=[`AllVariants`]})))()}j();export{k as AllVariants,A as __namedExportsOrder,w as default};