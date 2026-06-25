import{d as v,j as e,c as n,r as w}from"./iframe-x0eT-xyE.js";import{c as j}from"./index-CjK4zf9t.js";import{L as I}from"./label-UxOfftzp.js";import"./separator-Da2YlRWj.js";import{I as s}from"./input-BUsSqvEc.js";import{a as f,b as y}from"./story-section-B-UwUZjU.js";import{s as N}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";const z=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],u=v("car",z),L=j("group/field flex w-full gap-2 data-[invalid=true]:text-destructive",{variants:{orientation:{vertical:["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],horizontal:["flex-row items-center","[&>[data-slot=field-label]]:flex-auto","has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"],responsive:["flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto","@md/field-group:[&>[data-slot=field-label]]:flex-auto","@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"]}},defaultVariants:{orientation:"vertical"}});function t({className:l,orientation:a="vertical",...o}){return e.jsx("div",{role:"group","data-slot":"field","data-orientation":a,className:n(L({orientation:a}),l),...o})}function i({className:l,...a}){return e.jsx(I,{"data-slot":"field-label",className:n("group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50","has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4","has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",l),...a})}function g({className:l,...a}){return e.jsx("div",{"data-slot":"field-label",className:n("flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",l),...a})}function r({className:l,...a}){return e.jsx("p",{"data-slot":"field-description",className:n("text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance","last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5","[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",l),...a})}function h({className:l,children:a,errors:o,...F}){const x=w.useMemo(()=>{if(a)return a;if(!o?.length)return null;const m=[...new Map(o.map(d=>[d?.message,d])).values()];return m?.length==1?m[0]?.message:e.jsx("ul",{className:"ml-4 flex list-disc flex-col gap-1",children:m.map((d,b)=>d?.message&&e.jsx("li",{children:d.message},b))})},[a,o]);return x?e.jsx("div",{role:"alert","data-slot":"field-error",className:n("text-destructive text-sm font-normal",l),...F,children:x}):null}t.__docgenInfo={description:"",methods:[],displayName:"Field",props:{orientation:{defaultValue:{value:"'vertical'",computed:!1},required:!1}}};i.__docgenInfo={description:"",methods:[],displayName:"FieldLabel"};r.__docgenInfo={description:"",methods:[],displayName:"FieldDescription"};h.__docgenInfo={description:"",methods:[],displayName:"FieldError",props:{errors:{required:!1,tsType:{name:"Array",elements:[{name:"union",raw:"{ message?: string } | undefined",elements:[{name:"signature",type:"object",raw:"{ message?: string }",signature:{properties:[{key:"message",value:{name:"string",required:!1}}]}},{name:"undefined"}]}],raw:"Array<{ message?: string } | undefined>"},description:""}}};g.__docgenInfo={description:"",methods:[],displayName:"FieldTitle"};const q={title:"Components/Inputs/Input",component:s,args:{value:"Input value",onChange:()=>{},placeholder:"Placeholder"}},c={render:()=>e.jsx(f,{title:"Sizes",children:N.map(l=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(y,{children:l}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{size:l,value:"loremp ipsum",className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{endIcon:u,size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{endIcon:u,value:"loremp ipsum",size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})]})]},l))})},p={render:()=>e.jsx(f,{title:"Field variants",children:e.jsxs("div",{className:"flex max-w-[400px] flex-col gap-6",children:[e.jsxs(t,{children:[e.jsx(i,{children:"Basic Input with Label"}),e.jsx(s,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(t,{children:[e.jsx(i,{children:"Input with Description"}),e.jsx(r,{children:"This is a helpful description to guide the user"}),e.jsx(s,{size:"sm",placeholder:"Enter your text here"})]}),e.jsxs(t,{children:[e.jsx(g,{children:"Input with Title"}),e.jsx(r,{children:"Titles can be used as an alternative to labels"}),e.jsx(s,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(t,{children:[e.jsx(i,{children:"Input with Error State"}),e.jsx(r,{children:"This field shows an error message below"}),e.jsx(s,{size:"sm",placeholder:"Placeholder",className:"border-destructive"}),e.jsx(h,{children:"This field is required"})]}),e.jsxs(t,{children:[e.jsx(i,{children:"Input with Multiple Errors"}),e.jsx(s,{size:"sm",placeholder:"Placeholder",className:"border-destructive"}),e.jsx(h,{errors:[{message:"This field is required"},{message:"Must be at least 3 characters"}]})]}),e.jsxs(t,{children:[e.jsx(i,{children:"Complete Field Example"}),e.jsx(r,{children:"This field demonstrates all available components: Label, Description, Input, and helper text."}),e.jsx(s,{size:"sm",placeholder:"Enter complete information",endIcon:u}),e.jsx(r,{className:"text-xs",children:"Additional helper text can go here"})]})]})})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes">
      {sizes.map(size => <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <div className="flex gap-2">
            <Input size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input size={size} value="loremp ipsum" className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} value="loremp ipsum" size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
          </div>
        </div>)}
    </StorySection>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Field variants">
      <div className="flex max-w-[400px] flex-col gap-6">
        {/* Basic Field with Label */}
        <Field>
          <FieldLabel>Basic Input with Label</FieldLabel>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label and Description */}
        <Field>
          <FieldLabel>Input with Description</FieldLabel>
          <FieldDescription>This is a helpful description to guide the user</FieldDescription>
          <Input size="sm" placeholder="Enter your text here" />
        </Field>

        {/* Field with Title (alternative to Label) */}
        <Field>
          <FieldTitle>Input with Title</FieldTitle>
          <FieldDescription>Titles can be used as an alternative to labels</FieldDescription>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label, Description and Error */}
        <Field>
          <FieldLabel>Input with Error State</FieldLabel>
          <FieldDescription>This field shows an error message below</FieldDescription>
          <Input size="sm" placeholder="Placeholder" className="border-destructive" />
          <FieldError>This field is required</FieldError>
        </Field>

        {/* Field with multiple errors */}
        <Field>
          <FieldLabel>Input with Multiple Errors</FieldLabel>
          <Input size="sm" placeholder="Placeholder" className="border-destructive" />
          <FieldError errors={[{
          message: 'This field is required'
        }, {
          message: 'Must be at least 3 characters'
        }]} />
        </Field>

        {/* Complete Field with all elements */}
        <Field>
          <FieldLabel>Complete Field Example</FieldLabel>
          <FieldDescription>
            This field demonstrates all available components: Label, Description, Input, and helper text.
          </FieldDescription>
          <Input size="sm" placeholder="Enter complete information" endIcon={Car} />
          <FieldDescription className="text-xs">Additional helper text can go here</FieldDescription>
        </Field>
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}};const M=["Sizes","WithFieldVariant"];export{c as Sizes,p as WithFieldVariant,M as __namedExportsOrder,q as default};
