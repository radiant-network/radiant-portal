import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as p,a as s,b as c,c as o,e as m,f as d,d as r}from"./select-DHqrYng3.js";import{C as S}from"./applications-config-q4OA8PiL.js";import{a as u}from"./utils-Be9R-1lk.js";import{B as x}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CcLUv2_A.js";import"./index-Dmw9mmVb.js";import"./index-COcwYKbe.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CIckazZy.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-qxuqJ0RB.js";import"./index-BGxt8iJ2.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./chevron-down-BLzVWgYU.js";import"./chevron-up-BzG59QGX.js";const v={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},O={title:"Inputs/Select",component:p,args:{},decorators:[t=>e.jsx(x,{children:e.jsx(S,{config:v,children:e.jsx(t,{})})})]},a={args:{},render:()=>e.jsx("div",{className:"w-[180px] flex flex-col gap-2",children:u.map(t=>e.jsxs("div",{children:[e.jsx("span",{children:t}),e.jsxs(p,{children:[e.jsx(s,{size:t,children:e.jsx(c,{placeholder:"Select a fruit"})}),e.jsx(o,{children:e.jsxs(m,{children:[e.jsx(d,{children:"Fruits"}),e.jsx(r,{value:"apple",children:"Apple"}),e.jsx(r,{value:"banana",children:"Banana"}),e.jsx(r,{value:"blueberry",children:"Blueberry"}),e.jsx(r,{value:"grapes",children:"Grapes"}),e.jsx(r,{value:"pineapple",children:"Pineapple"})]})})]})]},t))})};var l,i,n;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(n=(i=a.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};const q=["Default"];export{a as Default,q as __namedExportsOrder,O as default};
