import{j as e}from"./iframe-ic5Qxcay.js";import{S as i,a as p,b as o,c as d,e as m,f as u,d as r}from"./select-BMV_LGFF.js";import{C as S,A as t}from"./applications-config-BMmgC7pC.js";import{a as x}from"./utils-Be9R-1lk.js";import{B as v}from"./chunk-EPOLDU6W-BMYMZ5VL.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DADJ2x1d.js";import"./index-DshgSYoq.js";import"./chevron-down-phpPST6C.js";import"./check-kaNqWciF.js";import"./chevron-up-D3TGdidm.js";const g={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},A={title:"Inputs/Select",component:i,args:{},decorators:[a=>e.jsx(v,{children:e.jsx(S,{config:g,children:e.jsx(a,{})})})]},l={args:{},render:()=>e.jsx("div",{className:"w-[180px] flex flex-col gap-2",children:x.map(a=>e.jsxs("div",{children:[e.jsx("span",{children:a}),e.jsxs(i,{children:[e.jsx(p,{size:a,children:e.jsx(o,{placeholder:"Select a fruit"})}),e.jsx(d,{children:e.jsxs(m,{children:[e.jsx(u,{children:"Fruits"}),e.jsx(r,{value:"apple",children:"Apple"}),e.jsx(r,{value:"banana",children:"Banana"}),e.jsx(r,{value:"blueberry",children:"Blueberry"}),e.jsx(r,{value:"grapes",children:"Grapes"}),e.jsx(r,{value:"pineapple",children:"Pineapple"})]})})]})]},a))})};var n,c,s;l.parameters={...l.parameters,docs:{...(n=l.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(s=(c=l.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};const w=["Default"];export{l as Default,w as __namedExportsOrder,A as default};
