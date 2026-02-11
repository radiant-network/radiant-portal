import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as v}from"./index-B-lxVbXh.js";import{f as e}from"./index-FPNDRHs_.js";import{d as I}from"./query-pill-boolean-YTIgZfZH.js";import{Q as d}from"./query-builder-CuJJ9iCJ.js";import{B as c}from"./button-DVi2YR5Y.js";import{v as u,q as a}from"./query-builder-remote-Dsglp4p2.js";import{g as i,a as o}from"./utils-DHuzGzlP.js";import{U}from"./user-3oWHM7_v.js";import"./v4-CtRu48qb.js";import"./i18n-C40I7Y3q.js";import"./iframe-BPQjb6vk.js";import"./i18next-CYn7LYXT.js";import"./index-CBYaBgW8.js";import"./isEqual-DJddVrXl.js";import"./tooltip-0vX-MTK3.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./index-DnEzm5An.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfXWnpL9.js";import"./utils-CDN07tui.js";import"./sqon-BcXfVpY_.js";import"./api-BFDjw7rQ.js";import"./x-4HkHZ1eq.js";import"./createLucideIcon-B119WVF5.js";import"./input-Bj-MPxry.js";import"./index-C66Dxnp2.js";import"./dialog-TAP2eCwF.js";import"./index-Cq0TEE3l.js";import"./Combination-CrkgvPnV.js";import"./separator-ChZWIdMg.js";import"./index-C-d7IIsQ.js";import"./alert-dialog-store-CZoSfA8g.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./popover-CV3rAFUt.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./not-in-operator-icon-DdiM-lgK.js";import"./chevron-left-D5mG_tkl.js";import"./chevron-right-BONyyZTy.js";import"./accordion-DSXieqtP.js";import"./index-BCzuw4Jg.js";import"./index-ByDNlZau.js";import"./chevron-down-DOuPo75j.js";import"./card-Cyh3E19J.js";import"./skeleton-_T1otFf0.js";import"./trash-EX7KNg_H.js";import"./label-BI8zg36L.js";import"./hover-card-DGWDDH_5.js";import"./info-1oMsIW1a.js";import"./spinner-DMuui_2m.js";import"./number-format-CIhM6SrW.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./check-DSe_yRo5.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-CfgEC-S9.js";import"./button.variants-Du9eY_ux.js";import"./switch-Jy17y5RA.js";import"./index-DDveph9e.js";import"./star-B-jv0ErR.js";import"./select-DnbErV3f.js";import"./chevron-up-C0Hb7JXF.js";import"./list-item-with-action-DAQ8f2hu.js";import"./pen-BSZDi--G.js";const x={queryBar:{empty:"Use the search tools & facets on the left to build a query",deletePopover:{title:"Delete this query?",cancel:"Cancel",ok:"Delete"},customPill:{createTooltip:"Create a custom query",cannotSaveAsCustomPill:"Custom queries cannot include other custom queries"},saveDialog:{title:"Save this query",fields:{title:{label:"Query name",placeholder:"Untitled query"}},notice:'You will find your saved queries in the sidebar under the "Queries" heading.',cancel:"Cancel",ok:"Save"}},queryPill:{operator:{changeOperatorTo:"Change operator to",and:"and",or:"or"},facet:t=>t,customPill:{editDialog:{title:"Edit custom query",cancel:"Cancel",ok:"Save"},cantBeEmptyDialog:{title:"Query cannot be empty",description:"Your custom query must contain at least one criteria.",ok:"Close"},titleExistsDialog:{title:"Name already in use",description:"A custom query with this name already exists. Please assign a unique name.",ok:"Close"},saveDialog:{title:"Edit this query?",confirmationMessage:'You are about to edit the custom query "{title}", which may affect your results.',affectedFilters:"Affected saved filters:",cancel:"Cancel",ok:"Save"}}},toolbar:{combine:"Combine",newQuery:"New query",clearAll:"Clear all",clearAllDialog:{title:"Delete all queries?",description:"You are about to delete all your queries. They will be lost forever.",cancel:"Cancel",ok:"Delete"},labels:"Labels"},savedFilter:{deleteTooltip:"Delete filter",deleteDialog:{title:"Permanently delete this filter?",description:"You are about to permanently delete this filter and all of its queries.",cancel:"Cancel",ok:"Delete filter"},duplicateTooltip:"Duplicate filter",overwriteDialog:{title:"Unsaved changes",description:"You are about to create a new filter; all modifications will be lost.",cancel:"Cancel",ok:"Create"},editDialog:{title:"Edit filter",cancel:"Cancel",ok:"Save",fields:{title:{label:"Title",placeholder:"Untitled query"}}},myFilters:"My Filters",manageFilters:"Manage filters",manageDialog:{title:"Manage filters",close:"Close",lastSaveAt:"Last saved at: {lastSaveAt} ago"},newFilter:"New filter",saveTooltip:{whenEmpty:"Add a query to save",whenDirty:"Save changes",default:"Save filter"},shareTooltip:{whenNotSaved:"Save filter to share",default:"Share (Copy url)"},favoriteTooltip:{set:"Set as default filter",unset:"Unset default filter"},discardTooltip:"Discard unsaved changes",noSavedFilters:"You have no saved filters"}},Ve={title:"QueryBuilder/Query Builder",component:d,args:{id:"query-builder-id",enableCombine:!0,enableFavorite:!0,enableShowHideLabels:!0,initialShowHideLabels:!0,queryReferenceColors:I,resolveSyntheticSqon:e(),dictionary:x}},y="query-builder-id",T="query-builder-custom-pill-id",p="query-builder-query-pill-filter-id";function D({queryBuilderId:t}){return r.jsxs("div",{className:"space-y-2",children:[r.jsx("div",{children:"Testing Tools:"}),r.jsxs("div",{className:"flex border p-4 gap-2",children:[r.jsx(c,{color:"primary",size:"sm",onClick:()=>a.addQuery(t,i()),children:"Add query"}),r.jsx(c,{color:"primary",size:"sm",onClick:()=>{a.updateActiveQueryField(t,{field:"field",value:["new-value"]})},children:"Add field to active query"}),r.jsx(c,{color:"primary",size:"sm",onClick:()=>{a.updateActiveQueryField(t,{field:"field",value:[]})},children:"Remove field from active query"})]})]})}const l={args:{id:y,initialState:{...a.getLocalQueryBuilderState(y),savedFilters:[{id:u(),title:"Olivier's Filter",favorite:!1,queries:[i(),i(),i()]},{id:u(),title:"Francis' Filter",favorite:!1,queries:[i(),i()]},{id:u(),title:"Luc's Filter",favorite:!1,queries:[i(),i(),i()]}],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onCustomPillSave:e(),onCustomPillUpdate:e(),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e()},render:t=>r.jsxs("div",{className:"space-y-3",children:[r.jsx(d,{...t}),r.jsx(D,{queryBuilderId:y})]})},f=u(),n={args:{id:T,queryCountIcon:r.jsx(U,{size:14}),initialState:{activeQueryId:f,queries:[i(f),i()],savedFilters:[],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onCustomPillSave:t=>(v("onCustomPillSave")(t),new Promise(m=>setTimeout(()=>m(o(t)),750))),onCustomPillUpdate:t=>(v("onCustomPillUpdate")(t),new Promise(m=>setTimeout(()=>m(o(t)),750))),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e(),customPillConfig:{enable:!0,queryBuilderEditId:"qb-custom-pill-edit-id",fetchCustomPillById:()=>new Promise(t=>setTimeout(()=>t(o()),750)),validateCustomPillTitle:()=>new Promise(t=>setTimeout(()=>t(!0),750)),fetchSavedFiltersByCustomPillId:()=>new Promise(t=>setTimeout(()=>t([o(),o()]),750))}},render:t=>r.jsx(d,{...t})},s={args:{id:p,initialState:{...a.getLocalQueryBuilderState(p),savedFilters:[],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e(),queryPillFacetFilterConfig:{enable:!0,onFacetClick:t=>(v("onFacetClick")(t),r.jsx("div",{className:"italic text-sm",children:"Insert Filter Content"}))}},render:t=>r.jsxs("div",{className:"space-y-3",children:[r.jsx(d,{...t}),r.jsx(D,{queryBuilderId:p})]})};var C,g,S;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    id: qbId,
    initialState: {
      ...queryBuilderRemote.getLocalQueryBuilderState(qbId),
      savedFilters: [{
        id: v4(),
        title: "Olivier's Filter",
        favorite: false,
        queries: [generateRandomQuery(), generateRandomQuery(), generateRandomQuery()]
      }, {
        id: v4(),
        title: "Francis' Filter",
        favorite: false,
        queries: [generateRandomQuery(), generateRandomQuery()]
      }, {
        id: v4(),
        title: "Luc's Filter",
        favorite: false,
        queries: [generateRandomQuery(), generateRandomQuery(), generateRandomQuery()]
      }],
      selectedQueryIndexes: []
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onCustomPillSave: fn(),
    onCustomPillUpdate: fn(),
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn()
  },
  render: args => <div className="space-y-3">
      <QueryBuilder {...args} />
      <TestingTools queryBuilderId={qbId} />
    </div>
}`,...(S=(g=l.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var Q,h,F;n.parameters={...n.parameters,docs:{...(Q=n.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    id: qbCustomPillId,
    queryCountIcon: <UserIcon size={14} />,
    initialState: {
      activeQueryId: customPillActiveQueryId,
      queries: [generateRandomQuery(customPillActiveQueryId), generateRandomQuery()],
      savedFilters: [],
      selectedQueryIndexes: []
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onCustomPillSave: filter => {
      action('onCustomPillSave')(filter);
      return new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750));
    },
    onCustomPillUpdate: filter => {
      action('onCustomPillUpdate')(filter);
      return new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter(filter)), 750));
    },
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
    customPillConfig: {
      enable: true,
      queryBuilderEditId: 'qb-custom-pill-edit-id',
      fetchCustomPillById: () => new Promise(resolve => setTimeout(() => resolve(generateRandomUserSavedFilter()), 750)),
      validateCustomPillTitle: () => new Promise(resolve => setTimeout(() => resolve(true), 750)),
      fetchSavedFiltersByCustomPillId: () => new Promise(resolve => setTimeout(() => resolve([generateRandomUserSavedFilter(), generateRandomUserSavedFilter()]), 750))
    }
  },
  render: args => <QueryBuilder {...args} />
}`,...(F=(h=n.parameters)==null?void 0:h.docs)==null?void 0:F.source}}};var q,P,b;s.parameters={...s.parameters,docs:{...(q=s.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    id: qbQueryPillFilterId,
    initialState: {
      ...queryBuilderRemote.getLocalQueryBuilderState(qbQueryPillFilterId),
      savedFilters: [],
      selectedQueryIndexes: []
    },
    fetchQueryCount: async () => Promise.resolve(15),
    onStateChange: fn(),
    onActiveQueryChange: fn(),
    onQueryCreate: fn(),
    onQueryDelete: fn(),
    onQuerySelectChange: fn(),
    onQueryUpdate: fn(),
    onSavedFilterCreate: fn(),
    onSavedFilterDelete: fn(),
    onSavedFilterSave: fn(),
    onSavedFilterUpdate: fn(),
    queryPillFacetFilterConfig: {
      enable: true,
      onFacetClick: filter => {
        action('onFacetClick')(filter);
        return <div className="italic text-sm">Insert Filter Content</div>;
      }
    }
  },
  render: args => <div className="space-y-3">
      <QueryBuilder {...args} />
      <TestingTools queryBuilderId={qbQueryPillFilterId} />
    </div>
}`,...(b=(P=s.parameters)==null?void 0:P.docs)==null?void 0:b.source}}};const We=["Default","CustomPill","QueryPillFilter"];export{n as CustomPill,l as Default,s as QueryPillFilter,We as __namedExportsOrder,Ve as default};
