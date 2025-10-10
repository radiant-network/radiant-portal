import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as ee}from"./api-CLxggLZG.js";import{F as Z}from"./case-exploration-table-filters-BGNKr-ZR.js";import{h as re,i as ae,D as s}from"./data-table-BCvMQdu_.js";import{C as se}from"./applications-config-q4OA8PiL.js";import{d as n}from"./table-mock-DUtY5NyB.js";import{B as ne}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./index-CGj_12n1.js";import"./api-CTNwT5mI.js";import"./index-DxlLpgFR.js";import"./data-table-filters-XggnFgbX.js";import"./filter-button-CW_fxkub.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./command-DNEJ4r_l.js";import"./index-CcSolvYM.js";import"./index-CcLUv2_A.js";import"./index-CIckazZy.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-BOEjv1S3.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./dialog-C2eE55TB.js";import"./popover-CX89_Z95.js";import"./index-ButkbYdn.js";import"./tooltip-eZCTYbea.js";import"./i18n-BWHuWJtH.js";import"./iframe-D0u8YpuK.js";import"./i18next-DOi7g2fS.js";import"./button-YjhY-NsT.js";import"./action-button-BiAXKMq7.js";import"./dropdown-menu-CFPCuvYI.js";import"./button.variants-Du9eY_ux.js";import"./spinner-BMSZ66Eg.js";import"./search-DqA1hdnz.js";import"./skeleton-Shk8p_SP.js";import"./test-tube-diagonal-U7YTje3f.js";import"./user-CZ8KFWeE.js";import"./list-filter-DyVHreeM.js";import"./priority-indicator-DVDXYllk.js";import"./indicator-GIQKVNBl.js";import"./shape-circle-icon-BxJCNapB.js";import"./refresh-ccw-Bwg-o3xn.js";import"./pen-BVjgPDnY.js";import"./settings-DYVxWNf4.js";import"./number-format-D03oK8BY.js";import"./pagination-CvOZC3h4.js";import"./select-CvMCtLHe.js";import"./chevron-down-BLzVWgYU.js";import"./chevron-up-BzG59QGX.js";import"./ellipsis-BM4jpslE.js";import"./empty-BYYXI_d-.js";import"./chart-scatter-5c2GQdAf.js";import"./card-BdbO89L0.js";import"./circle-alert-DsWOU-5F.js";import"./chevron-right-CKDh57Sc.js";const a=ae(),te={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},xr={title:"Tables/Data Table",component:s,args:{id:"storybook",columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})],data:n,defaultServerSorting:[{field:"pf_wgs",order:ee.Asc}],defaultColumnSettings:re([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{pageIndex:0,pageSize:10},onPaginationChange:()=>{},onServerSortingChange:e=>{},total:10},decorators:[e=>r.jsx(ne,{children:r.jsx(se,{config:te,children:r.jsx(e,{})})})]},t={args:{loadingStates:{list:!0,total:!0}},render:e=>r.jsx(s,{...e})},o={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>r.jsx(s,{...e})},l={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>r.jsx(s,{...e})},i={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},c={args:{loadingStates:{list:!1,total:!1},data:n,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:()=>r.jsx(Z,{loading:!1,setSearchCriteria:()=>{}})},render:e=>r.jsx(s,{...e})},d={args:{enableFullscreen:!0},render:e=>r.jsxs("div",{children:[r.jsx("span",{children:r.jsx("i",{children:'Use "Open in new canvas" button at the top right of the screen a better preview'})}),r.jsx(s,{...e})]})},p={args:{data:n.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},u={args:{data:n.slice(0,1),total:1,TableFilters:()=>r.jsx(Z,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>r.jsx(s,{...e})},m={args:{paginationHidden:!0},render:e=>r.jsx(s,{...e})},g={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>r.jsx(r.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),a.accessor("visits",{id:"visits",header:()=>r.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),a.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),a.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>r.jsxs(r.Fragment,{children:[r.jsxs("span",{children:["You can group by ",r.jsx("b",{children:"status"})]}),r.jsx(s,{...e})]})},h={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[a.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),a.group({header:"group_2",columns:[a.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),a.group({header:"More Info",columns:[a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(s,{...e})},f={args:{columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"}),footer:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>r.jsx("span",{children:"Age"})}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor("status",{header:"Status",footer:()=>r.jsx("span",{children:"Status"})}),a.accessor("progress",{header:"Profile Progress",footer:()=>r.jsx("span",{children:"Profile Progress"})})]},render:e=>r.jsx(s,{...e})};var b,x,F;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTable {...args} />
}`,...(F=(x=t.parameters)==null?void 0:x.docs)==null?void 0:F.source}}};var j,N,S;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTable {...args} />
}`,...(S=(N=o.parameters)==null?void 0:N.docs)==null?void 0:S.source}}};var V,v,T;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTable {...args} />
}`,...(T=(v=l.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};var C,H,P;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(P=(H=i.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var D,_,L;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />
  },
  render: args => <DataTable {...args} />
}`,...(L=(_=c.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var O,G,w;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <div>
      <span>
        <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
      </span>
      <DataTable {...args} />
    </div>
}`,...(w=(G=d.parameters)==null?void 0:G.docs)==null?void 0:w.source}}};var y,A,R;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(R=(A=p.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var $,E,M;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTable {...args} />
}`,...(M=(E=u.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var B,I,k;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    paginationHidden: true
  },
  render: args => <DataTable {...args} />
}`,...(k=(I=m.parameters)==null?void 0:I.docs)==null?void 0:k.source}}};var q,U,Y;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [columnHelper.accessor('firstName', {
      id: 'firstName',
      cell: info => info.getValue(),
      header: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      id: 'age',
      header: () => 'Age',
      cell: info => info.renderValue(),
      aggregatedCell: ({
        getValue
      }) => <>{\`[\${getValue()[0]}-\${getValue()[1]}]\`}</>,
      aggregationFn: 'extent',
      enableGrouping: true
    }), columnHelper.accessor('visits', {
      id: 'visits',
      header: () => <span>Visits</span>,
      aggregationFn: 'sum'
    }), columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      getGroupingValue: row => \`Group By \${row.status}\`,
      enableGrouping: true
    }), columnHelper.accessor('progress', {
      id: 'progress',
      header: 'Profile Progress',
      cell: ({
        getValue
      }) => \`\${Math.round(getValue<number>() * 100) / 100}%\`,
      aggregationFn: 'mean',
      aggregatedCell: ({
        getValue
      }) => \`~\${Math.round(getValue<number>() * 100) / 100}%\`
    })] as TableColumnDef<MockData, any>[]
  },
  render: args => <>
      <span>
        You can group by <b>status</b>
      </span>
      <DataTable {...args} />
    </>
}`,...(Y=(U=g.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var z,J,K;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [columnHelper.group({
      id: 'group_1',
      header: () => <span>Group 1</span>,
      columns: [columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id
      }), columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id
      })]
    }), columnHelper.group({
      header: 'group_2',
      columns: [columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id
      }), columnHelper.group({
        header: 'More Info',
        columns: [columnHelper.accessor('visits', {
          header: () => <span>Visits</span>
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        })]
      })]
    })] as TableColumnDef<MockData, any>[]
  },
  render: args => <DataTable {...args} />
}`,...(K=(J=h.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,W,X;f.parameters={...f.parameters,docs:{...(Q=f.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    columns: [columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First Name</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      footer: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue(),
      footer: () => <span>Age</span>
    }), columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor('status', {
      header: 'Status',
      footer: () => <span>Status</span>
    }), columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: () => <span>Profile Progress</span>
    })]
  },
  render: args => <DataTable {...args} />
}`,...(X=(W=f.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};const Fr=["Loading","Empty","Error","Default","DefaultTableFilters","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","GroupBy","HeaderGroups","Footer"];export{u as DataTableFiltersAndLessThan10Results,i as Default,c as DefaultTableFilters,o as Empty,l as Error,f as Footer,d as Fullscreen,g as GroupBy,h as HeaderGroups,p as LessThan10Results,t as Loading,m as PaginationHidden,Fr as __namedExportsOrder,xr as default};
