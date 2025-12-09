import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as $}from"./index-CBYaBgW8.js";import{F as u}from"./filter-button-D1TiM8qS.js";import{c as d}from"./createLucideIcon-B119WVF5.js";import{U as m}from"./users-BCnyYR8e.js";import{S as b}from"./settings-Dw4TSVKU.js";import"./badge-B5hMF8F4.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./separator-B36Ht569.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./x-4HkHZ1eq.js";import"./command-BHrLYDRM.js";import"./index-BuSTw3Vl.js";import"./index-Ba5mf8A5.js";import"./index-ycEarWk3.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-BZEiv_1o.js";import"./checkbox-B4fiCiBj.js";import"./index-SF2qmtPV.js";import"./index-BtWW-1ow.js";import"./check-DSe_yRo5.js";import"./dialog-DGUkvaXj.js";import"./popover-CQOPJ8xY.js";import"./index-DrGCp3O6.js";import"./tooltip-BjBxR1Ac.js";import"./index-BiH9rn-5.js";import"./i18n-D69N6MIH.js";import"./iframe-CBhLDB2j.js";import"./i18next-CYn7LYXT.js";import"./button-pzkp80Kr.js";import"./action-button-KkvxmIWD.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-C6lL4ijz.js";import"./button.variants-Du9eY_ux.js";import"./spinner-CKwzofCp.js";import"./search-DKmUqS9g.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],q=d("Calendar",U);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],D=d("Database",Z);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],W=d("FileText",G);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]],h=d("Filter",J),Le={title:"Buttons/Filter Button",component:u,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},s=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],E=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:m},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:D},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:W},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:b}],H=[{key:"download",label:"Download Report",icon:W},{key:"export",label:"Export Data",icon:D},{key:"schedule",label:"Schedule Analysis",icon:q},{key:"share",label:"Share Results",icon:m}],t=({initialSelected:o=[],...x})=>{const[R,V]=$.useState(o);return e.jsx(u,{...x,selected:R,onSelect:V})},i={render:()=>e.jsx("div",{className:"p-4 flex gap-2",children:["xs","sm","md","lg"].map(o=>e.jsx(u,{popoverSize:o,label:`size ${o}`,options:s,selected:[],onSelect:function(x){throw new Error("Function not implemented.")}},o))})},a={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(h,{className:"w-4 h-4"})})]})},n={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(m,{className:"size-4"})})]})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"size-4"})})]})},l={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(h,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(m,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"w-4 h-4"})})]})]})},c={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:s,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(h,{className:"size-4"})})]})},p={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:s,isOpen:!0,placeholder:"Search...",icon:e.jsx(h,{className:"size-4"})})]})};var v,g,N;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="p-4 flex gap-2">
      {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
      throw new Error('Function not implemented.');
    }} />)}
    </div>
}`,...(N=(g=i.parameters)==null?void 0:g.docs)==null?void 0:N.source}}};var S,y,k;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="w-4 h-4" />} />
    </div>
}`,...(k=(y=a.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var j,O,f;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </div>
}`,...(f=(O=n.parameters)==null?void 0:O.docs)==null?void 0:f.source}}};var F,w,z;r.parameters={...r.parameters,docs:{...(F=r.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </div>
}`,...(z=(w=r.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var A,M,T;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(T=(M=l.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var C,B,I;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...(I=(B=c.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var _,L,P;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...(P=(L=p.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};const Pe=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{r as ActionMode,l as AllVariants,p as OpenOnAppear,i as PopOverSize,a as WithCheckboxList,n as WithLongTextAndTooltips,c as WithPreselectedItems,Pe as __namedExportsOrder,Le as default};
