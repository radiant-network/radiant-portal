import{j as e}from"./iframe-C7m9FALj.js";import{S as i,a as p,b as o,c as m,e as d,f as u,d as r}from"./select-Dl0zlMy7.js";import{C as S,A as l}from"./applications-config-Ca17-4U4.js";import{a as g}from"./utils-Be9R-1lk.js";import{B as x}from"./chunk-UVKPFVEO-4G5nDoTu.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B4o9B4_n.js";import"./index-9FvLAPic.js";import"./chevron-down-DaNFNi5d.js";import"./check-CljsLVET.js";import"./chevron-up-BSDRqeJo.js";const v={variant_entity:{app_id:l.variant_entity},germline_snv_occurrence:{app_id:l.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:l.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:l.admin},portal:{name:"",navigation:{}}},A={title:"Inputs/Select",component:i,args:{},decorators:[a=>e.jsx(x,{children:e.jsx(S,{config:v,children:e.jsx(a,{})})})]},n={args:{},render:()=>e.jsx("div",{className:"w-[180px] flex flex-col gap-2",children:g.map(a=>e.jsxs("div",{children:[e.jsx("span",{children:a}),e.jsxs(i,{children:[e.jsx(p,{size:a,children:e.jsx(o,{placeholder:"Select a fruit"})}),e.jsx(m,{children:e.jsxs(d,{children:[e.jsx(u,{children:"Fruits"}),e.jsx(r,{value:"apple",children:"Apple"}),e.jsx(r,{value:"banana",children:"Banana"}),e.jsx(r,{value:"blueberry",children:"Blueberry"}),e.jsx(r,{value:"grapes",children:"Grapes"}),e.jsx(r,{value:"pineapple",children:"Pineapple"})]})})]})]},a))})};var t,c,s;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
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
}`,...(s=(c=n.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};const w=["Default"];export{n as Default,w as __namedExportsOrder,A as default};
