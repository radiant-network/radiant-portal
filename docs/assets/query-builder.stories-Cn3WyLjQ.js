import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{f as e}from"./index-B7YJKKKT.js";import{a as p}from"./index-B-lxVbXh.js";import{Q as d}from"./query-builder-S2dRdC--.js";import{d as I}from"./data-DpiuidmJ.js";import{B as m}from"./button-Lb4z2BrY.js";import{v as u,q as a}from"./query-builder-remote-C8T8ZF2t.js";import{g as i,a as o}from"./utils-BbYx3uln.js";import{U}from"./user-Dv_C2EEw.js";import"./v4-CtRu48qb.js";import"./index-DQLiH3RP.js";import"./index-DTwDs4x6.js";import"./dropdown-menu-Begym49V.js";import"./index-Dw-eQTPP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-Df1s8XGk.js";import"./chevron-right--l3G0NFC.js";import"./chevron-down-QEmn0_AS.js";import"./popover-DRJBelA9.js";import"./trash-DCT5GB8X.js";import"./tooltip-DogpHjiW.js";import"./dialog-H5nkUZvT.js";import"./index-DYxu_S6A.js";import"./x-ClsbQ_rO.js";import"./label-E-AdJZe_.js";import"./index-C66Dxnp2.js";import"./info-rYv3sqpq.js";import"./input-DyY2UfVx.js";import"./i18n-C0c3TCKd.js";import"./iframe-Luliyu6-.js";import"./context-DNAkM4o1.js";import"./spinner-DHVcj7-u.js";import"./number-format-D03oK8BY.js";import"./checkbox-Ce_wbgB6.js";import"./index-DDGWSPzp.js";import"./alert-dialog-store-CZoSfA8g.js";import"./ActionButton-BqVcLudk.js";import"./button.variants-BQkt_1YJ.js";import"./ellipsis-BtlAG3ey.js";import"./switch-DeZNfVrI.js";import"./list-item-with-action-CPLNvYNt.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./select-B3-ZNG_-.js";import"./en-US-Bm9FTEXR.js";import"./star-DfQf5eJj.js";import"./card-fYcqLYhc.js";import"./separator-PkW7KAol.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./not-in-operator-icon-DdiM-lgK.js";import"./api-fYFwtGmU.js";import"./string-format-D2CEWHqQ.js";import"./chevron-left-DGpQFcG5.js";const x={queryBar:{empty:"Use the search tools & facets on the left to build a query",deletePopover:{title:"Delete this query?",cancel:"Cancel",ok:"Delete"},customPill:{createTooltip:"Create a custom query",cannotSaveAsCustomPill:"Custom queries cannot include other custom queries"},saveDialog:{title:"Save this query",fields:{title:{label:"Query name",placeholder:"Untitled query"}},notice:'You will find your saved queries in the sidebar under the "Queries" heading.',cancel:"Cancel",ok:"Save"}},queryPill:{operator:{changeOperatorTo:"Change operator to",and:"and",or:"or"},facet:t=>t,customPill:{editDialog:{title:"Edit custom query",cancel:"Cancel",ok:"Save"},cantBeEmptyDialog:{title:"Query cannot be empty",description:"Your custom query must contain at least one criteria.",ok:"Close"},titleExistsDialog:{title:"Name already in use",description:"A custom query with this name already exists. Please assign a unique name.",ok:"Close"},saveDialog:{title:"Edit this query?",confirmationMessage:'You are about to edit the custom query "{title}", which may affect your results.',affectedFilters:"Affected saved filters:",cancel:"Cancel",ok:"Save"}}},toolbar:{combine:"Combine",newQuery:"New query",clearAll:"Clear all",clearAllDialog:{title:"Delete all queries?",description:"You are about to delete all your queries. They will be lost forever.",cancel:"Cancel",ok:"Delete"},labels:"Labels"},savedFilter:{deleteTooltip:"Delete filter",deleteDialog:{title:"Permanently delete this filter?",description:"You are about to permanently delete this filter and all of its queries.",cancel:"Cancel",ok:"Delete filter"},duplicateTooltip:"Duplicate filter",overwriteDialog:{title:"Unsaved changes",description:"You are about to create a new filter; all modifications will be lost.",cancel:"Cancel",ok:"Create"},editDialog:{title:"Edit filter",cancel:"Cancel",ok:"Save",fields:{title:{label:"Title",placeholder:"Untitled query"}}},myFilters:"My Filters",manageFilters:"Manage filters",manageDialog:{title:"Manage filters",close:"Close",lastSaveAt:"Last saved at: {lastSaveAt} ago"},newFilter:"New filter",saveTooltip:{whenEmpty:"Add a query to save",whenDirty:"Save changes",default:"Save filter"},shareTooltip:{whenNotSaved:"Save filter to share",default:"Share (Copy url)"},favoriteTooltip:{set:"Set as default filter",unset:"Unset default filter"},discardTooltip:"Discard unsaved changes",noSavedFilters:"You have no saved filters"}},Ne={title:"Feature/Query Builder",component:d,args:{id:"query-builder-id",enableCombine:!0,enableFavorite:!0,enableShowHideLabels:!0,initialShowHideLabels:!0,queryReferenceColors:I,resolveSyntheticSqon:e(),dictionary:x}},y="query-builder-id",T="query-builder-custom-pill-id",v="query-builder-query-pill-filter-id";function D({queryBuilderId:t}){return r.jsxs("div",{className:"space-y-2",children:[r.jsx("div",{children:"Testing Tools:"}),r.jsxs("div",{className:"flex border p-4 gap-2",children:[r.jsx(m,{color:"primary",size:"sm",onClick:()=>a.addQuery(t,i()),children:"Add query"}),r.jsx(m,{color:"primary",size:"sm",onClick:()=>{a.updateActiveQueryField(t,{field:"field",value:["new-value"]})},children:"Add field to active query"}),r.jsx(m,{color:"primary",size:"sm",onClick:()=>{a.updateActiveQueryField(t,{field:"field",value:[]})},children:"Remove field from active query"})]})]})}const l={args:{id:y,initialState:{...a.getLocalQueryBuilderState(y),savedFilters:[{id:u(),title:"Olivier's Filter",favorite:!1,queries:[i(),i(),i()]},{id:u(),title:"Francis' Filter",favorite:!1,queries:[i(),i()]},{id:u(),title:"Luc's Filter",favorite:!1,queries:[i(),i(),i()]}],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onCustomPillSave:e(),onCustomPillUpdate:e(),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e()},render:t=>r.jsxs("div",{className:"space-y-6",children:[r.jsx(d,{...t}),r.jsx(D,{queryBuilderId:y})]})},f=u(),n={args:{id:T,queryCountIcon:r.jsx(U,{size:14}),initialState:{activeQueryId:f,queries:[i(f),i()],savedFilters:[],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onCustomPillSave:t=>(p("onCustomPillSave")(t),new Promise(c=>setTimeout(()=>c(o(t)),750))),onCustomPillUpdate:t=>(p("onCustomPillUpdate")(t),new Promise(c=>setTimeout(()=>c(o(t)),750))),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e(),customPillConfig:{enable:!0,queryBuilderEditId:"qb-custom-pill-edit-id",fetchCustomPillById:()=>new Promise(t=>setTimeout(()=>t(o()),750)),validateCustomPillTitle:()=>new Promise(t=>setTimeout(()=>t(!0),750)),fetchSavedFiltersByCustomPillId:()=>new Promise(t=>setTimeout(()=>t([o(),o()]),750))}},render:t=>r.jsx(d,{...t})},s={args:{id:v,initialState:{...a.getLocalQueryBuilderState(v),savedFilters:[],selectedQueryIndexes:[]},fetchQueryCount:async()=>Promise.resolve(15),onStateChange:e(),onActiveQueryChange:e(),onQueryCreate:e(),onQueryDelete:e(),onQuerySelectChange:e(),onQueryUpdate:e(),onSavedFilterCreate:e(),onSavedFilterDelete:e(),onSavedFilterSave:e(),onSavedFilterUpdate:e(),queryPillFacetFilterConfig:{enable:!0,onFacetClick:t=>(p("onFacetClick")(t),r.jsx("div",{className:"italic text-sm",children:"Insert Filter Content"}))}},render:t=>r.jsxs("div",{className:"space-y-6",children:[r.jsx(d,{...t}),r.jsx(D,{queryBuilderId:v})]})};var C,g,S;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
  render: args => {
    return <div className="space-y-6">
        <QueryBuilder {...args} />
        <TestingTools queryBuilderId={qbId} />
      </div>;
  }
}`,...(S=(g=l.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var Q,F,h;n.parameters={...n.parameters,docs:{...(Q=n.parameters)==null?void 0:Q.docs,source:{originalSource:`{
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
  render: args => {
    return <QueryBuilder {...args} />;
  }
}`,...(h=(F=n.parameters)==null?void 0:F.docs)==null?void 0:h.source}}};var q,P,b;s.parameters={...s.parameters,docs:{...(q=s.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
  render: args => {
    return <div className="space-y-6">
        <QueryBuilder {...args} />
        <TestingTools queryBuilderId={qbQueryPillFilterId} />
      </div>;
  }
}`,...(b=(P=s.parameters)==null?void 0:P.docs)==null?void 0:b.source}}};const Ee=["Default","CustomPill","QueryPillFilter"];export{n as CustomPill,l as Default,s as QueryPillFilter,Ee as __namedExportsOrder,Ne as default};
