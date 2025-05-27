import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as d}from"./button-CbbVWId-.js";import{H as q,a as w,b as D}from"./capitalize-DEtw7XLf.js";import{u as N}from"./i18n-C5vBEqwx.js";import{r as j}from"./index-t5q4d8OJ.js";import{u as T,a as Q,Q as b,b as z,P as B,C as _,c as M,g as n}from"./utils-DU4SEXNg.js";import{c as U}from"./query-builder-remote-CV1kkaXN.js";import{a as L}from"./alert-dialog-store-CZoSfA8g.js";import{c as v}from"./createLucideIcon-BOZfVBeY.js";import{E as R}from"./external-link-CD_azT8g.js";import{I as V}from"./info-A6rwbVaT.js";import{T as E}from"./trash-DZaBvLz0.js";import{a as m}from"./index-B-lxVbXh.js";import"./index-yBjzXJbu.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./ActionButton-D4jVLNva.js";import"./dropdown-menu-xf-jiMEf.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-BiFLoO8l.js";import"./index-CTFHtJli.js";import"./index-V1T-MO6M.js";import"./utils-CytzSlOG.js";import"./check-1JYhj4AL.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-e_tKH1yv.js";import"./spinner-BoKAmKqu.js";import"./iframe-C_I-Y06G.js";import"./less-than-or-equal-operator-icon-BeMEXZ7b.js";import"./not-in-operator-icon-C8Fl8SMz.js";import"./api-CU3RBd8i.js";import"./chevron-left-JBJxu620.js";import"./x-Bt7o6wSZ.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./dialog-DVZakI6I.js";import"./index-w83wLIv_.js";import"./input-DXdBqDMR.js";import"./separator-Bb2s55f8.js";import"./tooltip-BvHXuUN3.js";import"./index-BmfKZQ-K.js";import"./v4-CtRu48qb.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],H=v("ChartColumn",O);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]],A=v("ChartLine",$);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],G=v("ChartPie",Y);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}],["circle",{cx:"18.5",cy:"5.5",r:".5",fill:"currentColor",key:"lysivs"}],["circle",{cx:"11.5",cy:"11.5",r:".5",fill:"currentColor",key:"byv1b8"}],["circle",{cx:"7.5",cy:"16.5",r:".5",fill:"currentColor",key:"nkw3mc"}],["circle",{cx:"17.5",cy:"14.5",r:".5",fill:"currentColor",key:"1gjh6j"}],["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}]],K=v("ChartScatter",J);function y({customPills:c,onSelectPill:a,onSavePill:t,onDuplicatePill:r,onDeletePill:l,validateCustomPillTitle:u,fetchSavedFiltersByCustomPillId:s,learnMoreLink:F}){const{t:o}=N(),I=T(),[P,h]=j.useState(null),x=Q({id:"customPillFilterQueryBuilder",state:{activeQueryId:"",selectedQueryIndexes:[],queries:[],savedFilters:c},onCustomPillUpdate:async i=>await t(i)}),k=i=>L.open({type:"warning",title:o("common.customPillFilter.deleteDialog.title",{defaultValue:"Delete this query?"}),description:o("common.customPillFilter.deleteDialog.description",{title:i.title,defaultValue:`You are about to delete this custom query "${i.title}", which may affect your results."`}),cancelProps:{children:o("common.customPillFilter.deleteDialog.cancel",{defaultValue:"Cancel"})},actionProps:{color:"destructive",onClick:()=>l(i.id),children:o("common.customPillFilter.deleteDialog.ok",{defaultValue:"Delete"})}}),f=o("common.customPillFilter.info",{defaultValue:"You can create custom queries by adding criteria to the query bar and clicking the save button."});return c.length===0?e.jsxs("div",{className:"flex flex-col gap-3 justify-center",children:[e.jsxs("div",{className:"flex gap-1 justify-center items-center text-slate",children:[e.jsx(H,{size:20}),e.jsx(G,{size:20}),e.jsx(A,{size:20}),e.jsx(K,{size:20})]}),e.jsx("div",{className:"text-sm text-center",children:f}),e.jsx("a",{className:"flex justify-center",href:F,target:"_blank",rel:"noreferrer",children:e.jsxs(d,{variant:"link",className:"py-0 h-5",children:[o("common.customPillFilter.learnMore",{defaultValue:"Learn more"}),e.jsx(R,{})]})})]}):e.jsx(b.Provider,{value:I,children:e.jsxs(z.Provider,{value:{queryBuilder:x,fetchQueryCount:async()=>0,getQueryReferenceColor:()=>"",showLabels:!0,resolveSyntheticSqon:i=>i,customPillConfig:{enable:!0,queryBuilderEditId:"subCustomPillFilterQueryBuilder",fetchCustomPillById:()=>{},validateCustomPillTitle:u,fetchSavedFiltersByCustomPillId:s}},children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-1",children:["My Queries"," ",e.jsxs(q,{children:[e.jsx(w,{asChild:!0,children:e.jsx(V,{size:16})}),e.jsx(D,{side:"left",className:"w-[200px] space-y-3",children:e.jsx("div",{className:"text-sm",children:f})})]})]}),e.jsx("div",{className:"space-y-3",children:c.map(i=>e.jsxs("div",{className:"flex gap-1.5 group",children:[e.jsx("button",{className:"flex items-center border-2 rounded-sm border-primary px-2 h-6 text-xs whitespace-nowrap overflow-hidden hover:underline",onClick:()=>a(i),children:e.jsx("span",{className:"overflow-hidden text-ellipsis",children:i.title})}),e.jsxs("div",{className:"hidden items-center group-hover:flex gap-1",children:[e.jsx(d,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>h(i),children:e.jsx(B,{})}),e.jsx(d,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>r(U(i,x).copy()),children:e.jsx(_,{})}),e.jsx(d,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>k(i),children:e.jsx(E,{})})]})]},i.id))})]}),P&&e.jsx(M,{open:!0,onOpenChange:()=>h(null),queryPill:P})]})})}y.__docgenInfo={description:`validateCustomPillTitle
fetchSavedFiltersByCustomPillId`,methods:[],displayName:"CustomPillFilter",props:{customPills:{required:!0,tsType:{name:"Array",elements:[{name:"IUserSavedFilter"}],raw:"IUserSavedFilter[]"},description:""},onSelectPill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => void",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"void"}}},description:""},onSavePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => Promise<IUserSavedFilter>",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"Promise",elements:[{name:"IUserSavedFilter"}],raw:"Promise<IUserSavedFilter>"}}},description:""},onDuplicatePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => void",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"void"}}},description:""},onDeletePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pillId: string) => void",signature:{arguments:[{type:{name:"string"},name:"pillId"}],return:{name:"void"}}},description:""},validateCustomPillTitle:{required:!0,tsType:{name:"signature",raw:"QueryPillCustomConfig['validateCustomPillTitle']"},description:""},fetchSavedFiltersByCustomPillId:{required:!0,tsType:{name:"signature",raw:"QueryPillCustomConfig['fetchSavedFiltersByCustomPillId']"},description:""},learnMoreLink:{required:!0,tsType:{name:"string"},description:""}}};const Ve={title:"Feature/Query Filters/Custom Pill Filter",component:y},p={args:{},render:()=>{const[c,a]=j.useState([n(),n(),n()]);return e.jsx("div",{className:"rounded border p-5 max-w-[300px]",children:e.jsx(y,{customPills:[],onSelectPill:m("onSelectPill"),onDuplicatePill:t=>{m("onDuplicatePill"),a(r=>[...r,{...n(t),queries:t.queries}])},onDeletePill:t=>{m("onDeletePill")(),a(r=>r.filter(l=>l.id!==t))},onSavePill:async t=>new Promise(r=>{setTimeout(()=>{m("onSavePill")(t),a(l=>{const u=l.findIndex(s=>s.id===t.id);if(u>-1){const s=[...l];return s[u]={...n(t),queries:t.queries,title:t.title},s}return l}),r(t)},1e3)}),validateCustomPillTitle:()=>new Promise(t=>setTimeout(()=>t(!0),750)),fetchSavedFiltersByCustomPillId:()=>new Promise(t=>setTimeout(()=>t([]),750)),learnMoreLink:"https://google.com"})})}};var g,C,S;p.parameters={...p.parameters,docs:{...(g=p.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {} as any,
  // No args needed for this story
  render: () => {
    // This is to simulate a dynamic list of custom pills
    const [customPills, setCustomPills] = useState([generateRandomUserSavedFilter(), generateRandomUserSavedFilter(), generateRandomUserSavedFilter()]);
    return <div className="rounded border p-5 max-w-[300px]">
        <CustomPillFilter customPills={[]} onSelectPill={action('onSelectPill')} onDuplicatePill={pill => {
        action('onDuplicatePill');
        setCustomPills(prev => [...prev, {
          ...generateRandomUserSavedFilter(pill),
          queries: pill.queries
        }]);
      }} onDeletePill={pillId => {
        action('onDeletePill')();
        setCustomPills(prev => prev.filter(pill => pill.id !== pillId));
      }} onSavePill={async pill => {
        // Simulate saving the pill
        return new Promise(resolve => {
          setTimeout(() => {
            action('onSavePill')(pill);
            setCustomPills(prev => {
              const existingPillIndex = prev.findIndex(p => p.id === pill.id);
              if (existingPillIndex > -1) {
                const updatedPills = [...prev];
                updatedPills[existingPillIndex] = {
                  ...generateRandomUserSavedFilter(pill),
                  queries: pill.queries,
                  title: pill.title
                };
                return updatedPills;
              }
              return prev;
            });
            resolve(pill as any);
          }, 1000);
        });
      }} validateCustomPillTitle={() => new Promise(resolve => setTimeout(() => resolve(true), 750))} fetchSavedFiltersByCustomPillId={() => new Promise(resolve => setTimeout(() => resolve([]), 750))} learnMoreLink="https://google.com" />
      </div>;
  }
}`,...(S=(C=p.parameters)==null?void 0:C.docs)==null?void 0:S.source}}};const Ee=["Default"];export{p as Default,Ee as __namedExportsOrder,Ve as default};
