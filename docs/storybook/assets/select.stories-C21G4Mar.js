import{j as e}from"./iframe-DwMH2dBW.js";import{S as t}from"./api-QmR3WP_i.js";import{S as o,a as p,b as _,c as m,e as d,f as S,d as n}from"./select-BBekSMML.js";import{C as u,A as r}from"./applications-config-DXE5ztiN.js";import{a as g}from"./utils-Be9R-1lk.js";import{B as v}from"./chunk-UVKPFVEO-Cd7z_Nhh.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DA6RFYoh.js";import"./index-0WCYYc0R.js";import"./chevron-down-iZoV5io0.js";import"./check-B1gfskih.js";import"./chevron-up-DRLcC0QF.js";const x={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE}},G={title:"Inputs/Select",component:o,args:{},decorators:[a=>e.jsx(v,{children:e.jsx(u,{config:x,children:e.jsx(a,{})})})]},c={args:{},render:()=>e.jsx("div",{className:"w-[180px] flex flex-col gap-2",children:g.map(a=>e.jsxs("div",{children:[e.jsx("span",{children:a}),e.jsxs(o,{children:[e.jsx(p,{size:a,children:e.jsx(_,{placeholder:"Select a fruit"})}),e.jsx(m,{children:e.jsxs(d,{children:[e.jsx(S,{children:"Fruits"}),e.jsx(n,{value:"apple",children:"Apple"}),e.jsx(n,{value:"banana",children:"Banana"}),e.jsx(n,{value:"blueberry",children:"Blueberry"}),e.jsx(n,{value:"grapes",children:"Grapes"}),e.jsx(n,{value:"pineapple",children:"Pineapple"})]})})]})]},a))})};var l,s,i;c.parameters={...c.parameters,docs:{...(l=c.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(i=(s=c.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const T=["Default"];export{c as Default,T as __namedExportsOrder,G as default};
