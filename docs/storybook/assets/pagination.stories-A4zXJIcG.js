import{j as n,r as E}from"./iframe-CQgZAOkF.js";import{S as P}from"./api-QmR3WP_i.js";import{P as m,a as l,b as i,c as e,d as S,e as _,f as g,g as f,h as N,i as L}from"./pagination-DHMhuKDu.js";import{C as Pn,A as r}from"./applications-config-CZUSecrj.js";import{B as ln}from"./chunk-UVKPFVEO-HBFeQRBM.js";import"./preload-helper-Dp1pzeXC.js";import"./button-C_AsNXYw.js";import"./index-omJgMaAL.js";import"./action-button-BjNqzH1o.js";import"./dropdown-menu-BTfS0Wrp.js";import"./index-CSD6zSMT.js";import"./index-CfmBBbLM.js";import"./check-Cx9ZfCjz.js";import"./circle-Cp5EZ7RS.js";import"./separator-DQ_lcvcD.js";import"./i18n-zfLOoNJ9.js";import"./select-CwkCyQmV.js";import"./index-BkwIj3EG.js";import"./chevron-down-DFW4C9nK.js";import"./chevron-up-BUb0Rgly.js";import"./ellipsis-jTpkatKR.js";const dn={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:P.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:P.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:P.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:P.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:P.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},Mn={title:"Paginations/Pagination",component:m,decorators:[a=>n.jsx(ln,{children:n.jsx(Pn,{config:dn,children:n.jsx(a,{className:"w-full"})})})],parameters:{layout:"centered"}},p={render:()=>n.jsx(m,{children:n.jsxs(l,{children:[n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(e,{children:"2"})}),n.jsx(i,{children:n.jsx(e,{children:"3"})})]})})},x={render:()=>n.jsx(S,{})},h={render:()=>n.jsx(N,{})},u={render:()=>n.jsx(_,{})},j={render:()=>n.jsx(f,{})},I={render:()=>n.jsx(g,{})},C={render:()=>n.jsx(L,{pageSize:20,onPageSizeChange:()=>{}})},v={render:()=>n.jsxs("div",{className:"space-y-8",children:[n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Basic Pagination"}),n.jsx(m,{children:n.jsxs(l,{children:[n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"2"})}),n.jsx(i,{children:n.jsx(e,{children:"3"})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{children:"5"})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Pagination with Navigation"}),n.jsx(m,{children:n.jsxs(l,{children:[n.jsx(i,{children:n.jsx(S,{})}),n.jsx(i,{children:n.jsx(_,{})}),n.jsx(i,{children:n.jsx(g,{})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(e,{children:"6"})}),n.jsx(i,{children:n.jsx(g,{})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(N,{})})]})})]}),n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-medium mb-2",children:"Complete Pagination Example"}),n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("span",{className:"text-sm text-muted-foreground",children:"Showing 21-40"}),n.jsx("span",{className:"text-sm text-muted-foreground",children:"of 1,234 results"})]}),n.jsx(m,{children:n.jsxs(l,{children:[n.jsx(i,{children:n.jsx(L,{pageSize:20,onPageSizeChange:()=>{}})}),n.jsx(i,{children:n.jsx(S,{})}),n.jsx(i,{children:n.jsx(_,{})}),n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(g,{})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(e,{children:"6"})}),n.jsx(i,{children:n.jsx(g,{})}),n.jsx(i,{children:n.jsx(e,{children:"62"})}),n.jsx(i,{children:n.jsx(f,{})}),n.jsx(i,{children:n.jsx(N,{})})]})})]})]})]})},k={render:()=>{const[a,tn]=E.useState(5),[d,sn]=E.useState(20),t=62,z=1234,on=(a-1)*d+1,rn=Math.min(a*d,z),o=s=>{tn(Math.max(1,Math.min(s,t)))},gn=()=>{const s=[];{s.push(n.jsx(i,{children:n.jsx(e,{isActive:a===1,onClick:()=>o(1),children:"1"})},1)),a>3&&s.push(n.jsx(i,{children:n.jsx(g,{})},"ellipsis1"));const cn=Math.max(2,a-1),mn=Math.min(t-1,a+1);for(let c=cn;c<=mn;c++)s.push(n.jsx(i,{children:n.jsx(e,{isActive:c===a,onClick:()=>o(c),children:c})},c));a<t-2&&s.push(n.jsx(i,{children:n.jsx(g,{})},"ellipsis2")),s.push(n.jsx(i,{children:n.jsx(e,{isActive:t===a,onClick:()=>o(t),children:t})},t))}return s};return n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"text-center",children:[n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Current Page: ",a," | Page Size: ",d," | Total Pages: ",t]}),n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Showing ",on,"-",rn," of ",z," results"]})]}),n.jsx(m,{children:n.jsxs(l,{children:[n.jsx(i,{children:n.jsx(S,{onClick:()=>o(1)})}),n.jsx(i,{children:n.jsx(_,{onClick:()=>o(a-1)})}),gn(),n.jsx(i,{children:n.jsx(f,{onClick:()=>o(a+1)})}),n.jsx(i,{children:n.jsx(N,{onClick:()=>o(t)})})]})}),n.jsx("div",{className:"flex justify-center",children:n.jsx(L,{pageSize:d,onPageSizeChange:sn,pageSizeOptions:[10,20,50,100]})})]})}};var y,b,R;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>3</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
}`,...(R=(b=p.parameters)==null?void 0:b.docs)==null?void 0:R.source}}};var w,A,M;x.parameters={...x.parameters,docs:{...(w=x.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <PaginationFirst />
}`,...(M=(A=x.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var O,F,V;h.parameters={...h.parameters,docs:{...(O=h.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <PaginationLast />
}`,...(V=(F=h.parameters)==null?void 0:F.docs)==null?void 0:V.source}}};var T,B,U;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <PaginationPrevious />
}`,...(U=(B=u.parameters)==null?void 0:B.docs)==null?void 0:U.source}}};var G,W,q;j.parameters={...j.parameters,docs:{...(G=j.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <PaginationNext />
}`,...(q=(W=j.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var D,H,J;I.parameters={...I.parameters,docs:{...(D=I.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <PaginationEllipsis />
}`,...(J=(H=I.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,X;C.parameters={...C.parameters,docs:{...(K=C.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => <PaginationPageSize pageSize={20} onPageSizeChange={() => {}} />
}`,...(X=(Q=C.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,$;v.parameters={...v.parameters,docs:{...(Y=v.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      {/* Basic pagination with numbers */}
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Pagination with navigation buttons */}
      <div>
        <h3 className="text-sm font-medium mb-2">Pagination with Navigation</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Complete Pagination Example</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing 21-40</span>
            <span className="text-sm text-muted-foreground">of 1,234 results</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPageSize pageSize={20} onPageSizeChange={() => {}} />
              </PaginationItem>
              <PaginationItem>
                <PaginationFirst />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>62</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
}`,...($=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var nn,en,an;k.parameters={...k.parameters,docs:{...(nn=k.parameters)==null?void 0:nn.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentPage, setCurrentPage] = React.useState(5);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pageSize, setPageSize] = React.useState(20);
    const totalPages = 62;
    const totalResults = 1234;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalResults);
    const handlePageChange = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }
      } else {
        // Show first page
        pages.push(<PaginationItem key={1}>
            <PaginationLink isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>);

        // Show ellipsis if needed
        if (currentPage > 3) {
          pages.push(<PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          pages.push(<PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show last page
        pages.push(<PaginationItem key={totalPages}>
            <PaginationLink isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>);
      }
      return pages;
    };
    return <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Current Page: {currentPage} | Page Size: {pageSize} | Total Pages: {totalPages}
          </p>
          <p className="text-sm text-muted-foreground">
            Showing {startItem}-{endItem} of {totalResults} results
          </p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst onClick={() => handlePageChange(1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast onClick={() => handlePageChange(totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex justify-center">
          <PaginationPageSize pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={[10, 20, 50, 100]} />
        </div>
      </div>;
  }
}`,...(an=(en=k.parameters)==null?void 0:en.docs)==null?void 0:an.source}}};const On=["ContainerWithNumbers","First","Last","Previous","Next","Ellipsis","PageSize","CompletePagination","InteractivePagination"];export{v as CompletePagination,p as ContainerWithNumbers,I as Ellipsis,x as First,k as InteractivePagination,h as Last,j as Next,C as PageSize,u as Previous,On as __namedExportsOrder,Mn as default};
