import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as U}from"./index-CBYaBgW8.js";import{F as h}from"./filter-button-vZLR6Lhq.js";import{c as u}from"./createLucideIcon-B119WVF5.js";import{U as d}from"./users-BCnyYR8e.js";import{S as b}from"./settings-Dw4TSVKU.js";import{C as $}from"./calendar-C8AAVYXt.js";import"./badge-Bvz88wlt.js";import"./index-C66Dxnp2.js";import"./utils-CDN07tui.js";import"./separator-ChZWIdMg.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./x-4HkHZ1eq.js";import"./button-Blo1Ss9S.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./button.variants-Du9eY_ux.js";import"./spinner-DMuui_2m.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-BnrpIskt.js";import"./iframe-D0umrBDw.js";import"./i18next-CYn7LYXT.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./command-CqDCn1-N.js";import"./index-Cq0TEE3l.js";import"./dialog-TAP2eCwF.js";import"./popover-CV3rAFUt.js";import"./search-DKmUqS9g.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],D=u("Database",q);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],W=u("FileText",Z);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]],m=u("Filter",G),We={title:"Buttons/Filter Button",component:h,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},s=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],E=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:d},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:D},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:W},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:b}],H=[{key:"download",label:"Download Report",icon:W},{key:"export",label:"Export Data",icon:D},{key:"schedule",label:"Schedule Analysis",icon:$},{key:"share",label:"Share Results",icon:d}],t=({initialSelected:o=[],...x})=>{const[R,V]=U.useState(o);return e.jsx(h,{...x,selected:R,onSelect:V})},i={render:()=>e.jsx("div",{className:"p-4 flex gap-2",children:["xs","sm","md","lg"].map(o=>e.jsx(h,{popoverSize:o,label:`size ${o}`,options:s,selected:[],onSelect:function(x){throw new Error("Function not implemented.")}},o))})},a={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(m,{className:"w-4 h-4"})})]})},n={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(d,{className:"size-4"})})]})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"size-4"})})]})},l={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:s,placeholder:"Search status...",icon:e.jsx(m,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:E,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(d,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:H,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(b,{className:"w-4 h-4"})})]})]})},c={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:s,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(m,{className:"size-4"})})]})},p={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:s,isOpen:!0,placeholder:"Search...",icon:e.jsx(m,{className:"size-4"})})]})};var g,v,N;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(I=(B=c.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var _,L,P;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...(P=(L=p.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};const Ee=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{r as ActionMode,l as AllVariants,p as OpenOnAppear,i as PopOverSize,a as WithCheckboxList,n as WithLongTextAndTooltips,c as WithPreselectedItems,Ee as __namedExportsOrder,We as default};
