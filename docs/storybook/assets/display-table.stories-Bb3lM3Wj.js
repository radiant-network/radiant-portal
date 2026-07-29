import{j as r,r as h}from"./iframe-BwgnBgbs.js";import{S as c}from"./api-CbXfKFEH.js";import{R as S}from"./row-selection-cell-BJWMQCry.js";import{D as a}from"./display-table-BBEimpsB.js";import{R as _}from"./table-row-selection-header-C06q-jyJ.js";import{C as f,A as s}from"./applications-config-82us2Psj.js";import{a as t}from"./story-section-CUmPhl8T.js";import{i as x}from"./table-mock-CHPBe7i6.js";import{B as y}from"./chunk-QUQL4437-BhUmmbyj.js";import{c as N}from"./data-table-BjjZy79s.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-CtmgtvPd.js";import"./index-CHxf_95e.js";import"./check-BmfiAxZ2.js";import"./i18n-q3nsv9wg.js";import"./index-9G14H1gK.js";import"./empty-Jr-y3xnP.js";import"./search-D5aCVLdd.js";import"./empty-cell-De6TZTaX.js";import"./number-format-Cz4nVEIV.js";import"./button-CVRshTFc.js";import"./action-button-DfTzlCGI.js";import"./dropdown-menu-CUFPYByL.js";import"./index-E0yEPtnq.js";import"./index-BbLf2bTU.js";import"./circle-C8kpohc-.js";import"./separator-B4ksv8En.js";import"./grip-vertical-BET5q44K.js";import"./settings-Bg33V425.js";import"./arrow-down-BjZhZEcq.js";import"./skeleton-Bla1fROo.js";import"./card-DIfqeshF.js";import"./pagination-jvvE6-Sd.js";import"./select-DeYhDa5M.js";import"./chevron-down-lCBDOm8X.js";import"./chevron-up-DYtU6bDA.js";import"./ellipsis-DWG2j8no.js";import"./index-XsBXfm3q.js";import"./api-J3_QhqET.js";import"./badge-BRUmHD8A.js";import"./x-CRkQviaL.js";import"./chevron-right-Cdw5UlWd.js";const o=N(),w={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},me={title:"Features/Display Table",component:a,args:{data:x,columns:[o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(y,{children:r.jsx(f,{config:w,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(t,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(t,{title:"Borderless",children:r.jsx(a,{...e})})},l={args:{variant:"border"},render:e=>r.jsx(t,{title:"Border",children:r.jsx(a,{...e})})},p={args:{variant:"border",columns:[o.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[o.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),o.group({header:"group_2",columns:[o.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),o.group({header:"More Info",columns:[o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(t,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(t,{title:"Empty",children:r.jsx(a,{...e})})},d={args:{columns:[{id:"rowSelection",size:48,maxSize:48,header:e=>r.jsx(_,{table:e.table}),cell:e=>r.jsx(S,{row:e.row})},o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},render:e=>{const[u,g]=h.useState({});return r.jsx(t,{title:"With row selection",description:"Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.",children:r.jsx(a,{...e,rowSelection:u,onRowSelectionChange:g})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DisplayTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <StorySection title="Borderless">
      <DisplayTable {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <StorySection title="Border">
      <DisplayTable {...args} />
    </StorySection>
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border',
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
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => <StorySection title="With header groups">
      <DisplayTable {...args} />
    </StorySection>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      id: 'rowSelection',
      size: 48,
      maxSize: 48,
      header: (header: HeaderContext<TableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
      cell: info => <RowSelectionCell row={info.row} />
    }, columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue()
    }), columnHelper.accessor('visits', {
      header: () => <span>Visits</span>
    }), columnHelper.accessor('status', {
      header: 'Status'
    }), columnHelper.accessor('progress', {
      header: 'Profile Progress'
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    return <StorySection title="With row selection" description="Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.">
        <DisplayTable {...args} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
      </StorySection>;
  }
}`,...d.parameters?.docs?.source}}};const de=["Default","Borderless","Border","WithHeaderGroups","Empty","WithRowSelection"];export{l as Border,n as Borderless,i as Default,m as Empty,p as WithHeaderGroups,d as WithRowSelection,de as __namedExportsOrder,me as default};
