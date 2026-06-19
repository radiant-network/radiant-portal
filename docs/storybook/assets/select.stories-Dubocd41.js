import{j as e}from"./iframe-jcf7vZ_R.js";import{S as a}from"./api-C5s-SBNp.js";import{S as l,a as i,b as s,c as o,e as p,f as m,d as n}from"./select-C4DAmtax.js";import{C as _,A as t}from"./applications-config-CrN8ifR1.js";import{a as S,b as d}from"./story-section-Cpqu6Cmt.js";import{a as u}from"./utils-Be9R-1lk.js";import{B as g}from"./chunk-QUQL4437-NFsSyaH3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-mGHp8w0J.js";import"./index-CiCOYGE9.js";import"./chevron-down-BsOjEoAv.js";import"./check-DnaYg78d.js";import"./chevron-up-DxyCK08X.js";const v={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE}},L={title:"Components/Inputs/Select",component:l,args:{},decorators:[r=>e.jsx(g,{children:e.jsx(_,{config:v,children:e.jsx(r,{})})})]},c={args:{},render:()=>e.jsx(S,{title:"Sizes",children:u.map(r=>e.jsxs("div",{className:"flex w-[180px] flex-col gap-2",children:[e.jsx(d,{children:r}),e.jsxs(l,{children:[e.jsx(i,{size:r,children:e.jsx(s,{placeholder:"Select a fruit"})}),e.jsx(o,{children:e.jsxs(p,{children:[e.jsx(m,{children:"Fruits"}),e.jsx(n,{value:"apple",children:"Apple"}),e.jsx(n,{value:"banana",children:"Banana"}),e.jsx(n,{value:"blueberry",children:"Blueberry"}),e.jsx(n,{value:"grapes",children:"Grapes"}),e.jsx(n,{value:"pineapple",children:"Pineapple"})]})})]})]},r))})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const A=["Sizes"];export{c as Sizes,A as __namedExportsOrder,L as default};
