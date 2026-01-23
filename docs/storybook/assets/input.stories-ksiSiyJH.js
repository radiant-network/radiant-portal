import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as L}from"./index-CBYaBgW8.js";import{c as z}from"./index-C2vczdB5.js";import{L as D}from"./label-BI8zg36L.js";import"./separator-ChZWIdMg.js";import{c}from"./utils-CDN07tui.js";import{I as s}from"./input-Bj-MPxry.js";import{s as T}from"./utils-Be9R-1lk.js";import{c as E}from"./createLucideIcon-B119WVF5.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./index-C66Dxnp2.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",key:"5owen"}],["circle",{cx:"7",cy:"17",r:"2",key:"u2ysq9"}],["path",{d:"M9 17h6",key:"r8uit2"}],["circle",{cx:"17",cy:"17",r:"2",key:"axvx0g"}]],u=E("Car",P),_=z("group/field flex w-full gap-3 data-[invalid=true]:text-destructive",{variants:{orientation:{vertical:["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],horizontal:["flex-row items-center","[&>[data-slot=field-label]]:flex-auto","has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"],responsive:["flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto","@md/field-group:[&>[data-slot=field-label]]:flex-auto","@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"]}},defaultVariants:{orientation:"vertical"}});function r({className:l,orientation:a="vertical",...t}){return e.jsx("div",{role:"group","data-slot":"field","data-orientation":a,className:c(_({orientation:a}),l),...t})}function d({className:l,...a}){return e.jsx(D,{"data-slot":"field-label",className:c("group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50","has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4","has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",l),...a})}function I({className:l,...a}){return e.jsx("div",{"data-slot":"field-label",className:c("flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",l),...a})}function o({className:l,...a}){return e.jsx("p",{"data-slot":"field-description",className:c("text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance","last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5","[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",l),...a})}function h({className:l,children:a,errors:t,...N}){const x=L.useMemo(()=>{var f;if(a)return a;if(!(t!=null&&t.length))return null;const n=[...new Map(t.map(i=>[i==null?void 0:i.message,i])).values()];return(n==null?void 0:n.length)==1?(f=n[0])==null?void 0:f.message:e.jsx("ul",{className:"ml-4 flex list-disc flex-col gap-1",children:n.map((i,y)=>(i==null?void 0:i.message)&&e.jsx("li",{children:i.message},y))})},[a,t]);return x?e.jsx("div",{role:"alert","data-slot":"field-error",className:c("text-destructive text-sm font-normal",l),...N,children:x}):null}r.__docgenInfo={description:"",methods:[],displayName:"Field",props:{orientation:{defaultValue:{value:"'vertical'",computed:!1},required:!1}}};d.__docgenInfo={description:"",methods:[],displayName:"FieldLabel"};o.__docgenInfo={description:"",methods:[],displayName:"FieldDescription"};h.__docgenInfo={description:"",methods:[],displayName:"FieldError",props:{errors:{required:!1,tsType:{name:"Array",elements:[{name:"union",raw:"{ message?: string } | undefined",elements:[{name:"signature",type:"object",raw:"{ message?: string }",signature:{properties:[{key:"message",value:{name:"string",required:!1}}]}},{name:"undefined"}]}],raw:"Array<{ message?: string } | undefined>"},description:""}}};I.__docgenInfo={description:"",methods:[],displayName:"FieldTitle"};const K={title:"Inputs/Input",component:s,args:{value:"Input value",onChange:()=>{},placeholder:"Placeholder"}},p={render:()=>e.jsx("div",{className:"flex flex-col gap-2",children:T.map(l=>e.jsxs("div",{children:[e.jsx("span",{children:l}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(s,{size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{size:l,value:"loremp ipsum",className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{endIcon:u,size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0}),e.jsx(s,{endIcon:u,value:"loremp ipsum",size:l,className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0})]})]},l))})},m={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 max-w-[400px]",children:[e.jsxs(r,{children:[e.jsx(d,{children:"Basic Input with Label"}),e.jsx(s,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(r,{children:[e.jsx(d,{children:"Input with Description"}),e.jsx(o,{children:"This is a helpful description to guide the user"}),e.jsx(s,{size:"sm",placeholder:"Enter your text here"})]}),e.jsxs(r,{children:[e.jsx(I,{children:"Input with Title"}),e.jsx(o,{children:"Titles can be used as an alternative to labels"}),e.jsx(s,{size:"sm",placeholder:"Placeholder"})]}),e.jsxs(r,{children:[e.jsx(d,{children:"Input with Error State"}),e.jsx(o,{children:"This field shows an error message below"}),e.jsx(s,{size:"sm",placeholder:"Placeholder",className:"border-destructive"}),e.jsx(h,{children:"This field is required"})]}),e.jsxs(r,{children:[e.jsx(d,{children:"Input with Multiple Errors"}),e.jsx(s,{size:"sm",placeholder:"Placeholder",className:"border-destructive"}),e.jsx(h,{errors:[{message:"This field is required"},{message:"Must be at least 3 characters"}]})]}),e.jsxs(r,{children:[e.jsx(d,{children:"Complete Field Example"}),e.jsx(o,{children:"This field demonstrates all available components: Label, Description, Input, and helper text."}),e.jsx(s,{size:"sm",placeholder:"Enter complete information",endIcon:u}),e.jsx(o,{className:"text-xs",children:"Additional helper text can go here"})]})]})};var g,F,b;p.parameters={...p.parameters,docs:{...(g=p.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      {sizes.map(size => <div key={size}>
          <span>{size}</span>
          <div className="flex gap-2">
            <Input size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input size={size} value="loremp ipsum" className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} value="loremp ipsum" size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
          </div>
        </div>)}
    </div>
}`,...(b=(F=p.parameters)==null?void 0:F.docs)==null?void 0:b.source}}};var v,w,j;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 max-w-[400px]">
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
}`,...(j=(w=m.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};const Q=["Default","WithFieldVariant"];export{p as Default,m as WithFieldVariant,Q as __namedExportsOrder,K as default};
