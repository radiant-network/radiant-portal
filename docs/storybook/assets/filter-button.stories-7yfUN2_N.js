import{g as h,j as e,r as U}from"./iframe-ic5Qxcay.js";import{F as u}from"./filter-button-CwHTQ0VB.js";import{U as p}from"./users-Bx4x50UH.js";import{S as b}from"./settings-cLO6YgXh.js";import{C as $}from"./calendar-CQWOHRT9.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-BQ_KDDi0.js";import"./separator-1IuDAtPm.js";import"./index-BYOZoyyb.js";import"./x-DwTnIsGu.js";import"./button-BcQGDfh9.js";import"./action-button-B_a_lzkE.js";import"./dropdown-menu-Bz4pCMIQ.js";import"./index-DADJ2x1d.js";import"./circle-DxKroGXL.js";import"./check-kaNqWciF.js";import"./i18n-Cigd5hm4.js";import"./checkbox-DjDMf7QJ.js";import"./index-DshgSYoq.js";import"./command-by36HEmY.js";import"./dialog-B_yGti1J.js";import"./popover-BwT8FhSe.js";import"./search-BfHePcXQ.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],D=h("Database",q);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],W=h("FileText",Z);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]],m=h("Filter",G),ve={title:"Buttons/Filter Button",component:u,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},s=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],E=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:p},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:D},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:W},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:b}],H=[{key:"download",label:"Download Report",icon:W},{key:"export",label:"Export Data",icon:D},{key:"schedule",label:"Schedule Analysis",icon:$},{key:"share",label:"Share Results",icon:p}],t=({initialSelected:o=[],...x})=>{const[R,V]=U.useState(o);return e.jsx(u,{...x,selected:R,onSelect:V})},i={render:()=>e.jsx("div",{className:"p-4 flex gap-2",children:["xs","sm","md","lg"].map(o=>e.jsx(u,{popoverSize:o,label:`size ${o}`,options:s,selected:[],onSelect:function(x){throw new Error("Function not implemented.")}},o))})},a={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(m,{className:"w-4 h-4"})})]})},n={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(p,{className:"size-4"})})]})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"size-4"})})]})},l={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(m,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(p,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"w-4 h-4"})})]})]})},c={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:s,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(m,{className:"size-4"})})]})},d={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:s,isOpen:!0,placeholder:"Search...",icon:e.jsx(m,{className:"size-4"})})]})};var g,v,N;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="p-4 flex gap-2">
      {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
      throw new Error('Function not implemented.');
    }} />)}
    </div>
}`,...(N=(v=i.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};var S,y,j;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="w-4 h-4" />} />
    </div>
}`,...(j=(y=a.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var O,k,f;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </div>
}`,...(f=(k=n.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var F,w,z;r.parameters={...r.parameters,docs:{...(F=r.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </div>
}`,...(z=(w=r.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var A,T,C;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div className="p-4 space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
        <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
        <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Action Mode</h3>
        <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="w-4 h-4" />} />
      </div>
    </div>
}`,...(C=(T=l.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var M,B,I;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...(I=(B=c.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var _,L,P;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...(P=(L=d.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};const Ne=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{r as ActionMode,l as AllVariants,d as OpenOnAppear,i as PopOverSize,a as WithCheckboxList,n as WithLongTextAndTooltips,c as WithPreselectedItems,Ne as __namedExportsOrder,ve as default};
