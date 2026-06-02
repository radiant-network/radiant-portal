import{j as e}from"./iframe-Cmiex3IG.js";import{S as t}from"./api-CNFUPySA.js";import{S as l,a as s,b as i,c as o,e as p,f as _,d as n}from"./select-BmyIdouT.js";import{C as m,A as r}from"./applications-config-BEWoMBeD.js";import{a as d}from"./utils-Be9R-1lk.js";import{B as S}from"./chunk-QUQL4437-s57FPwL9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-OjUxLgF4.js";import"./index-CdS5h6eN.js";import"./chevron-down-DP0b3L58.js";import"./check-BHUZAyPW.js";import"./chevron-up-VYYoQ-QT.js";const u={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE}},b={title:"Inputs/Select",component:l,args:{},decorators:[a=>e.jsx(S,{children:e.jsx(m,{config:u,children:e.jsx(a,{})})})]},c={args:{},render:()=>e.jsx("div",{className:"w-[180px] flex flex-col gap-2",children:d.map(a=>e.jsxs("div",{children:[e.jsx("span",{children:a}),e.jsxs(l,{children:[e.jsx(s,{size:a,children:e.jsx(i,{placeholder:"Select a fruit"})}),e.jsx(o,{children:e.jsxs(p,{children:[e.jsx(_,{children:"Fruits"}),e.jsx(n,{value:"apple",children:"Apple"}),e.jsx(n,{value:"banana",children:"Banana"}),e.jsx(n,{value:"blueberry",children:"Blueberry"}),e.jsx(n,{value:"grapes",children:"Grapes"}),e.jsx(n,{value:"pineapple",children:"Pineapple"})]})})]})]},a))})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="w-[180px] flex flex-col gap-2">
      {selectSizes.map(size => <div key={size}>
          <span>{size}</span>
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
    </div>
}`,...c.parameters?.docs?.source}}};const O=["Default"];export{c as Default,O as __namedExportsOrder,b as default};
