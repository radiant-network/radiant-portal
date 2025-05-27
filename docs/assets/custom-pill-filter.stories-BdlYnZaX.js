import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{B as c}from"./button-CbbVWId-.js";import{H as F,a as C,b as I}from"./capitalize-DEtw7XLf.js";import{u as D}from"./i18n-CJXa5-w1.js";import{r as h}from"./index-t5q4d8OJ.js";import{u as j,a as q,Q as w,b as Q,P as N,C as U,c as T,g as a}from"./utils-CtktDC6R.js";import{c as b}from"./query-builder-remote-CV1kkaXN.js";import{a as z}from"./alert-dialog-store-CZoSfA8g.js";import{I as B}from"./info-A6rwbVaT.js";import{T as R}from"./trash-DZaBvLz0.js";import{a as m}from"./index-B-lxVbXh.js";import"./index-yBjzXJbu.js";import"./index-Bjkhh2p3.js";import"./index-CC5eZYhG.js";import"./index-fNjTmf9T.js";import"./ActionButton-D4jVLNva.js";import"./dropdown-menu-xf-jiMEf.js";import"./index-KhTUl610.js";import"./Combination-CdAak5pT.js";import"./index-BiFLoO8l.js";import"./index-CTFHtJli.js";import"./index-V1T-MO6M.js";import"./utils-CytzSlOG.js";import"./check-1JYhj4AL.js";import"./createLucideIcon-BOZfVBeY.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-e_tKH1yv.js";import"./spinner-BoKAmKqu.js";import"./iframe-COl4o3pn.js";import"./less-than-or-equal-operator-icon-BeMEXZ7b.js";import"./not-in-operator-icon-C8Fl8SMz.js";import"./api-CU3RBd8i.js";import"./chevron-left-JBJxu620.js";import"./x-Bt7o6wSZ.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./dialog-DVZakI6I.js";import"./index-w83wLIv_.js";import"./input-DXdBqDMR.js";import"./separator-Bb2s55f8.js";import"./tooltip-BvHXuUN3.js";import"./index-BmfKZQ-K.js";import"./v4-CtRu48qb.js";function p({customPills:u,onSelectPill:o,onSavePill:i,onDuplicatePill:l,onDeletePill:s}){const{t:r}=D(),n=j(),[v,P]=h.useState(null),y=q({id:"customPillFilterQueryBuilder",state:{activeQueryId:"",selectedQueryIndexes:[],queries:[],savedFilters:u},onCustomPillUpdate:async t=>await i(t)}),S=t=>z.open({type:"warning",title:r("common.customPillFilter.deleteDialog.title",{defaultValue:"Delete this query?"}),description:r("common.customPillFilter.deleteDialog.description",{title:t.title,defaultValue:`You are about to delete this custom query "${t.title}", which may affect your results."`}),cancelProps:{children:r("common.customPillFilter.deleteDialog.cancel",{defaultValue:"Cancel"})},actionProps:{color:"destructive",onClick:()=>s(t.id),children:r("common.customPillFilter.deleteDialog.ok",{defaultValue:"Delete"})}});return e.jsx(w.Provider,{value:n,children:e.jsxs(Q.Provider,{value:{queryBuilder:y,fetchQueryCount:async()=>0,getQueryReferenceColor:()=>"",showLabels:!0,resolveSyntheticSqon:t=>t},children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-1",children:["My Queries"," ",e.jsxs(F,{children:[e.jsx(C,{asChild:!0,children:e.jsx(B,{size:16})}),e.jsx(I,{side:"left",className:"w-[200px] space-y-3",children:e.jsx("div",{className:"text-sm",children:r("common.customPillFilter.info",{defaultValue:"You can create custom queries by adding criteria to the query bar and clicking the save button."})})})]})]}),e.jsx("div",{className:"space-y-3",children:u.map(t=>e.jsxs("div",{className:"flex gap-1.5 group",children:[e.jsx("button",{className:"flex items-center border-2 rounded-sm border-primary px-2 h-6 text-xs whitespace-nowrap overflow-hidden hover:underline",onClick:()=>o(t),children:e.jsx("span",{className:"overflow-hidden text-ellipsis",children:t.title})}),e.jsxs("div",{className:"hidden items-center group-hover:flex gap-1",children:[e.jsx(c,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>P(t),children:e.jsx(N,{})}),e.jsx(c,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>l(b(t,y).copy()),children:e.jsx(U,{})}),e.jsx(c,{iconOnly:!0,variant:"ghost",size:"xs",className:"[&_svg]:size-3.5 size-5",onClick:()=>S(t),children:e.jsx(R,{})})]})]},t.id))})]}),v&&e.jsx(T,{open:!0,onOpenChange:()=>P(null),queryPill:v})]})})}p.__docgenInfo={description:"",methods:[],displayName:"CustomPillFilter",props:{customPills:{required:!0,tsType:{name:"Array",elements:[{name:"IUserSavedFilter"}],raw:"IUserSavedFilter[]"},description:""},onSelectPill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => void",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"void"}}},description:""},onSavePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => Promise<IUserSavedFilter>",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"Promise",elements:[{name:"IUserSavedFilter"}],raw:"Promise<IUserSavedFilter>"}}},description:""},onDuplicatePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pill: ISavedFilter) => void",signature:{arguments:[{type:{name:"ISavedFilter"},name:"pill"}],return:{name:"void"}}},description:""},onDeletePill:{required:!0,tsType:{name:"signature",type:"function",raw:"(pillId: string) => void",signature:{arguments:[{type:{name:"string"},name:"pillId"}],return:{name:"void"}}},description:""}}};const je={title:"Feature/Query Filters/Custom Pill Filter",component:p},d={args:{},render:()=>{const[u,o]=h.useState([a(),a(),a()]);return e.jsx(p,{customPills:u,onSelectPill:m("onSelectPill"),onDuplicatePill:i=>{m("onDuplicatePill"),o(l=>[...l,{...a(i),queries:i.queries}])},onDeletePill:i=>{m("onDeletePill")(),o(l=>l.filter(s=>s.id!==i))},onSavePill:async i=>new Promise(l=>{setTimeout(()=>{m("onSavePill")(i),o(s=>{const r=s.findIndex(n=>n.id===i.id);if(r>-1){const n=[...s];return n[r]={...a(i),queries:i.queries,title:i.title},n}return s}),l(i)},1e3)})})}};var g,x,f;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {} as any,
  // No args needed for this story
  render: () => {
    // This is to simulate a dynamic list of custom pills
    const [customPills, setCustomPills] = useState([generateRandomUserSavedFilter(), generateRandomUserSavedFilter(), generateRandomUserSavedFilter()]);
    return <CustomPillFilter customPills={customPills} onSelectPill={action('onSelectPill')} onDuplicatePill={pill => {
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
    }} />;
  }
}`,...(f=(x=d.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const qe=["Default"];export{d as Default,qe as __namedExportsOrder,je as default};
