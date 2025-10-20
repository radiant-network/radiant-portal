import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as re}from"./api-CLxggLZG.js";import{F as ee}from"./case-exploration-table-filters-CWFxNrIu.js";import{h as ae,i as se,D as s}from"./data-table-Bimu-xxd.js";import{C as ne,A as t}from"./applications-config-DwuB3Ut-.js";import{d as n}from"./table-mock-DUtY5NyB.js";import{B as te}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./index-CGj_12n1.js";import"./api-CmVjSeVt.js";import"./index-DxlLpgFR.js";import"./data-table-filters-BCXEhEZ7.js";import"./filter-button-BIe-jkDm.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./command-DNEJ4r_l.js";import"./index-CcSolvYM.js";import"./index-CcLUv2_A.js";import"./index-CIckazZy.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-BOEjv1S3.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./dialog-C2eE55TB.js";import"./popover-CX89_Z95.js";import"./index-ButkbYdn.js";import"./tooltip-CU4v6KP8.js";import"./index-BGxt8iJ2.js";import"./i18n-Bgxc7_py.js";import"./iframe-Cji9YcRM.js";import"./i18next-DOi7g2fS.js";import"./button-CSvHYG3S.js";import"./action-button-CiOB9jQw.js";import"./dropdown-menu-CgwMUYBh.js";import"./index-Dmw9mmVb.js";import"./button.variants-Du9eY_ux.js";import"./spinner-BMSZ66Eg.js";import"./search-DqA1hdnz.js";import"./skeleton-Shk8p_SP.js";import"./test-tube-diagonal-U7YTje3f.js";import"./user-CZ8KFWeE.js";import"./priority-indicator-BBPRGuaF.js";import"./indicator-GIQKVNBl.js";import"./shape-circle-icon-BxJCNapB.js";import"./refresh-ccw-Bwg-o3xn.js";import"./pen-BVjgPDnY.js";import"./settings-DYVxWNf4.js";import"./number-format-D03oK8BY.js";import"./pagination-skOSApHJ.js";import"./select-DHqrYng3.js";import"./chevron-down-BLzVWgYU.js";import"./chevron-up-BzG59QGX.js";import"./ellipsis-BM4jpslE.js";import"./empty-BYYXI_d-.js";import"./chart-scatter-5c2GQdAf.js";import"./card-BdbO89L0.js";import"./circle-alert-DsWOU-5F.js";import"./chevron-right-CKDh57Sc.js";const a=se(),oe={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},jr={title:"Tables/Data Table",component:s,args:{id:"storybook",columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})],data:n,defaultServerSorting:[{field:"pf_wgs",order:re.Asc}],defaultColumnSettings:ae([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{pageIndex:0,pageSize:10},onPaginationChange:()=>{},onServerSortingChange:e=>{},total:10},decorators:[e=>r.jsx(te,{children:r.jsx(ne,{config:oe,children:r.jsx(e,{})})})]},o={args:{loadingStates:{list:!0,total:!0}},render:e=>r.jsx(s,{...e})},l={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>r.jsx(s,{...e})},i={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>r.jsx(s,{...e})},c={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},d={args:{loadingStates:{list:!1,total:!1},data:n,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:()=>r.jsx(ee,{loading:!1,setSearchCriteria:()=>{}})},render:e=>r.jsx(s,{...e})},p={args:{enableFullscreen:!0},render:e=>r.jsxs("div",{children:[r.jsx("span",{children:r.jsx("i",{children:'Use "Open in new canvas" button at the top right of the screen a better preview'})}),r.jsx(s,{...e})]})},u={args:{data:n.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{...e})},m={args:{data:n.slice(0,1),total:1,TableFilters:()=>r.jsx(ee,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>r.jsx(s,{...e})},g={args:{paginationHidden:!0},render:e=>r.jsx(s,{...e})},h={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>r.jsx(r.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),a.accessor("visits",{id:"visits",header:()=>r.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),a.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),a.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>r.jsxs(r.Fragment,{children:[r.jsxs("span",{children:["You can group by ",r.jsx("b",{children:"status"})]}),r.jsx(s,{...e})]})},f={args:{data:n.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[a.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),a.group({header:"group_2",columns:[a.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),a.group({header:"More Info",columns:[a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),a.accessor("status",{header:"Status"}),a.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(s,{...e})},b={args:{columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"}),footer:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>r.jsx("span",{children:"Age"})}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor("status",{header:"Status",footer:()=>r.jsx("span",{children:"Status"})}),a.accessor("progress",{header:"Profile Progress",footer:()=>r.jsx("span",{children:"Profile Progress"})})]},render:e=>r.jsx(s,{...e})};var x,F,j;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTable {...args} />
}`,...(j=(F=o.parameters)==null?void 0:F.docs)==null?void 0:j.source}}};var N,S,V;l.parameters={...l.parameters,docs:{...(N=l.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTable {...args} />
}`,...(V=(S=l.parameters)==null?void 0:S.docs)==null?void 0:V.source}}};var v,T,C;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTable {...args} />
}`,...(C=(T=i.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var H,P,D;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...(D=(P=c.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};var _,L,O;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(O=(L=d.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var A,G,w;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <div>
      <span>
        <i>Use &quot;Open in new canvas&quot; button at the top right of the screen a better preview</i>
      </span>
      <DataTable {...args} />
    </div>
}`,...(w=(G=p.parameters)==null?void 0:G.docs)==null?void 0:w.source}}};var y,R,$;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTable {...args} />
}`,...($=(R=u.parameters)==null?void 0:R.docs)==null?void 0:$.source}}};var E,I,M;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTable {...args} />
}`,...(M=(I=m.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var B,k,q;g.parameters={...g.parameters,docs:{...(B=g.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    paginationHidden: true
  },
  render: args => <DataTable {...args} />
}`,...(q=(k=g.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var U,Y,z;h.parameters={...h.parameters,docs:{...(U=h.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(z=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:z.source}}};var J,K,Q;f.parameters={...f.parameters,docs:{...(J=f.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Q=(K=f.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var W,X,Z;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(Z=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};const Nr=["Loading","Empty","Error","Default","DefaultTableFilters","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","GroupBy","HeaderGroups","Footer"];export{m as DataTableFiltersAndLessThan10Results,c as Default,d as DefaultTableFilters,l as Empty,i as Error,b as Footer,p as Fullscreen,h as GroupBy,f as HeaderGroups,u as LessThan10Results,o as Loading,g as PaginationHidden,Nr as __namedExportsOrder,jr as default};
