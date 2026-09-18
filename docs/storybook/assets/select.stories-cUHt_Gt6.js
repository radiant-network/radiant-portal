import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{a as r,c as i,i as a,l as o,n as s,r as c,s as l,t as u}from"./select-DMsOFfHJ.js";import{m as d,w as f}from"./api-BJIZDprh.js";import{i as p,n as m,t as h}from"./story-section-DVTm6cGm.js";import{r as g,t as _}from"./lib-CZRp1gG1.js";import{i as v,n as y,t as b}from"./applications-config-D877dlRU.js";import{n as x,t as S}from"./story-error-field-DeLRAi8K.js";import{n as C,t as w}from"./utils-DY5BCjP1.js";function T(){let[e,t]=(0,E.useState)(),n=!e;return(0,D.jsx)(S,{label:`Fruit`,invalid:n,children:(0,D.jsxs)(u,{value:e,onValueChange:t,children:[(0,D.jsx)(l,{size:`sm`,"aria-invalid":n,children:(0,D.jsx)(i,{placeholder:`Select a fruit`})}),(0,D.jsx)(s,{children:(0,D.jsxs)(c,{children:[(0,D.jsx)(a,{value:`apple`,children:`Apple`}),(0,D.jsx)(a,{value:`banana`,children:`Banana`})]})})]})})}var E,D,O,k,A,j,M;function N(){return(N=e((()=>{E=t(),g(),f(),o(),v(),p(),x(),w(),D=n(),O={variant_entity:{app_id:b.variant_entity},germline_snv_occurrence:{app_id:b.germline_snv_occurrence,aggregations:[],saved_filter_type:d.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:b.germline_cnv_occurrence,aggregations:[],saved_filter_type:d.GERMLINE_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:b.admin},portal:{name:``,navigation:{}},somatic_snv_to_occurrence:{app_id:b.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:d.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:b.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:d.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:b.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:d.SOMATIC_CNV_OCCURRENCE}},k={title:`Components/Inputs/Select`,component:u,args:{},decorators:[e=>(0,D.jsx)(_,{children:(0,D.jsx)(y,{config:O,children:(0,D.jsx)(e,{})})})]},A={args:{},render:()=>(0,D.jsx)(m,{title:`Sizes`,children:C.map(e=>(0,D.jsxs)(`div`,{className:`flex w-[180px] flex-col gap-2`,children:[(0,D.jsx)(h,{children:e}),(0,D.jsxs)(u,{children:[(0,D.jsx)(l,{size:e,children:(0,D.jsx)(i,{placeholder:`Select a fruit`})}),(0,D.jsx)(s,{children:(0,D.jsxs)(c,{children:[(0,D.jsx)(r,{children:`Fruits`}),(0,D.jsx)(a,{value:`apple`,children:`Apple`}),(0,D.jsx)(a,{value:`banana`,children:`Banana`}),(0,D.jsx)(a,{value:`blueberry`,children:`Blueberry`}),(0,D.jsx)(a,{value:`grapes`,children:`Grapes`}),(0,D.jsx)(a,{value:`pineapple`,children:`Pineapple`})]})})]})]},e))})},j={args:{},render:()=>(0,D.jsx)(m,{title:`Error`,children:(0,D.jsx)(T,{})})},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Error">
      <SelectErrorDemo />
    </StorySection>
}`,...j.parameters?.docs?.source}}},M=[`Sizes`,`ErrorState`]})))()}N();export{j as ErrorState,A as Sizes,M as __namedExportsOrder,k as default};