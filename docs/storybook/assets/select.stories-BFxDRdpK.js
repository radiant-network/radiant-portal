import{j as e,S as n,r as u}from"./iframe-CEIjD8md.js";import{S as l,a as o,b as p,c as S,e as d,f as g,d as a}from"./select-DN2j-4cl.js";import{C as v,A as t}from"./applications-config-CNrpF8an.js";import{a as m,b as x}from"./story-section-akNb6BHm.js";import{S as j}from"./story-error-field-ilQIUul_.js";import{a as h}from"./utils-Be9R-1lk.js";import{B as C}from"./chunk-QUQL4437-CMT0E8nl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CarIRmcY.js";import"./chevron-down-5uSI5hu_.js";import"./chevron-up-C3ynASbf.js";import"./index-DrHHB82D.js";import"./label-B7YzvmnB.js";const f={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE}},F={title:"Components/Inputs/Select",component:l,args:{},decorators:[r=>e.jsx(C,{children:e.jsx(v,{config:f,children:e.jsx(r,{})})})]},c={args:{},render:()=>e.jsx(m,{title:"Sizes",children:h.map(r=>e.jsxs("div",{className:"flex w-[180px] flex-col gap-2",children:[e.jsx(x,{children:r}),e.jsxs(l,{children:[e.jsx(o,{size:r,children:e.jsx(p,{placeholder:"Select a fruit"})}),e.jsx(S,{children:e.jsxs(d,{children:[e.jsx(g,{children:"Fruits"}),e.jsx(a,{value:"apple",children:"Apple"}),e.jsx(a,{value:"banana",children:"Banana"}),e.jsx(a,{value:"blueberry",children:"Blueberry"}),e.jsx(a,{value:"grapes",children:"Grapes"}),e.jsx(a,{value:"pineapple",children:"Pineapple"})]})})]})]},r))})};function E(){const[r,_]=u.useState(),i=!r;return e.jsx(j,{label:"Fruit",invalid:i,children:e.jsxs(l,{value:r,onValueChange:_,children:[e.jsx(o,{size:"sm","aria-invalid":i,children:e.jsx(p,{placeholder:"Select a fruit"})}),e.jsx(S,{children:e.jsxs(d,{children:[e.jsx(a,{value:"apple",children:"Apple"}),e.jsx(a,{value:"banana",children:"Banana"})]})})]})})}const s={args:{},render:()=>e.jsx(m,{title:"Error",children:e.jsx(E,{})})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Sizes">
      {selectSizes.map(size => <div key={size} className="flex w-[180px] flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <Select>
            <SelectTrigger size={size}>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>)}
    </StorySection>
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Error">
      <SelectErrorDemo />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const M=["Sizes","ErrorState"];export{s as ErrorState,c as Sizes,M as __namedExportsOrder,F as default};
