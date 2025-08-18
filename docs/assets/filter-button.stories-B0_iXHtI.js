import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as H}from"./index-CGj_12n1.js";import{F as C}from"./filter-button-DVd_Himz.js";import{c as l}from"./createLucideIcon-8Lr1oLzj.js";import{U as c}from"./users-GEp5q2No.js";import{S as m}from"./settings-DYVxWNf4.js";import"./command-CyxFVnX1.js";import"./index-CGTI_uD1.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CIckazZy.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-CKNrATXZ.js";import"./utils-D-KgF5mV.js";import"./dialog-T07bgruI.js";import"./index-C66Dxnp2.js";import"./x-CubKniSv.js";import"./checkbox-CZhHNwpD.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./popover-OCK0dKJe.js";import"./index-CbbSLEvm.js";import"./tooltip-Bh6uXa7k.js";import"./button-EPSq8v9I.js";import"./ActionButton-3Jbj_BdW.js";import"./dropdown-menu-CdOBzT_z.js";import"./button.variants-BQkt_1YJ.js";import"./ellipsis-BM4jpslE.js";import"./spinner-BMSZ66Eg.js";import"./i18n-BujETb1P.js";import"./iframe-uCmLZiSP.js";import"./context-DkqwYzW-.js";import"./badge-aQXnmXeU.js";import"./separator-6xmuS_PL.js";import"./search-DqA1hdnz.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],V=l("Calendar",R);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],I=l("Database",E);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],z=l("FileText",U);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]],d=l("Filter",q),Ce={title:"Buttons/Filter Button",component:C,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},p=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],B=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:c},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:I},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:z},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:m}],_=[{key:"download",label:"Download Report",icon:z},{key:"export",label:"Export Data",icon:I},{key:"schedule",label:"Schedule Analysis",icon:V},{key:"share",label:"Share Results",icon:c}],t=({initialSelected:L=[],...D})=>{const[W,P]=H.useState(L);return e.jsx(C,{...D,selected:W,onSelect:P})},o={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:p,placeholder:"Search status...",icon:e.jsx(d,{className:"w-4 h-4"})})]})},s={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:B,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(c,{className:"size-4"})})]})},i={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:_,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(m,{className:"size-4"})})]})},a={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:p,placeholder:"Search status...",icon:e.jsx(d,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:B,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(c,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:_,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(m,{className:"w-4 h-4"})})]})]})},n={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:p,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(d,{className:"size-4"})})]})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:p,isOpen:!0,placeholder:"Search...",icon:e.jsx(d,{className:"size-4"})})]})};var h,u,b;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="w-4 h-4" />} />
    </div>
}`,...(b=(u=o.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var x,N,g;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </div>
}`,...(g=(N=s.parameters)==null?void 0:N.docs)==null?void 0:g.source}}};var y,v,S;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </div>
}`,...(S=(v=i.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var k,j,O;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(O=(j=a.parameters)==null?void 0:j.docs)==null?void 0:O.source}}};var f,A,F;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...(F=(A=n.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var M,T,w;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...(w=(T=r.parameters)==null?void 0:T.docs)==null?void 0:w.source}}};const Ie=["WithCheckboxList","WithLongTextAndTooltips","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{i as ActionMode,a as AllVariants,r as OpenOnAppear,o as WithCheckboxList,s as WithLongTextAndTooltips,n as WithPreselectedItems,Ie as __namedExportsOrder,Ce as default};
