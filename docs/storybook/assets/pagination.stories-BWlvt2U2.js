import{j as n,r as v}from"./iframe-BZB1EZgz.js";import{S as m}from"./api-D36EIwoJ.js";import{a as P,b as d,c as i,g as e,d as u,h as S,e as I,f as C,i as c,P as k}from"./pagination-CNT0KR1W.js";import{C as A,A as g}from"./applications-config-Dhcm9CTZ.js";import{S as _,a}from"./story-section-BDrkXYOE.js";import{B as M}from"./chunk-QUQL4437-J1g7m8io.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./select-C39wRMRX.js";import"./index-G1LsBEqa.js";import"./chevron-down-Ck5_M-zO.js";import"./chevron-up-Clj0RsFp.js";import"./ellipsis-Bl-OUMF0.js";const b={variant_entity:{app_id:g.variant_entity},germline_snv_occurrence:{app_id:g.germline_snv_occurrence,aggregations:[],saved_filter_type:m.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:g.germline_cnv_occurrence,aggregations:[],saved_filter_type:m.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:g.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:m.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:g.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:m.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:g.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:m.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:g.admin},portal:{name:"",navigation:{}}},sn={title:"Components/Paginations/Pagination",component:P,decorators:[t=>n.jsx(M,{children:n.jsx(A,{config:b,children:n.jsx(t,{className:"w-full"})})})]},h={render:()=>n.jsxs(_,{children:[n.jsx(a,{title:"Container with numbers",children:n.jsx(P,{className:"mx-0 w-fit",children:n.jsxs(d,{children:[n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(e,{children:"2"})}),n.jsx(i,{children:n.jsx(e,{children:"3"})})]})})}),n.jsx(a,{title:"First",children:n.jsx(u,{})}),n.jsx(a,{title:"Last",children:n.jsx(S,{})}),n.jsx(a,{title:"Previous",children:n.jsx(I,{})}),n.jsx(a,{title:"Next",children:n.jsx(C,{})}),n.jsx(a,{title:"Ellipsis",children:n.jsx(c,{})}),n.jsx(a,{title:"Page size",children:n.jsx(k,{pageSize:20,onPageSizeChange:()=>{},className:"w-fit"})})]})},p={render:()=>n.jsxs(_,{children:[n.jsx(a,{title:"Basic pagination",children:n.jsx(P,{className:"mx-0 w-fit",children:n.jsxs(d,{children:[n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"2"})}),n.jsx(i,{children:n.jsx(e,{children:"3"})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{children:"5"})})]})})}),n.jsx(a,{title:"With navigation",children:n.jsx(P,{className:"mx-0 w-fit",children:n.jsxs(d,{children:[n.jsx(i,{children:n.jsx(u,{})}),n.jsx(i,{children:n.jsx(I,{})}),n.jsx(i,{children:n.jsx(c,{})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(e,{children:"6"})}),n.jsx(i,{children:n.jsx(c,{})}),n.jsx(i,{children:n.jsx(C,{})}),n.jsx(i,{children:n.jsx(S,{})})]})})}),n.jsx(a,{title:"Complete example",children:n.jsxs("div",{className:"flex items-center justify-between",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx("span",{className:"text-sm text-muted-foreground",children:"Showing 21-40"}),n.jsx("span",{className:"text-sm text-muted-foreground",children:"of 1,234 results"})]}),n.jsx(P,{className:"mx-0 w-fit",children:n.jsxs(d,{children:[n.jsx(i,{children:n.jsx(k,{pageSize:20,onPageSizeChange:()=>{}})}),n.jsx(i,{children:n.jsx(u,{})}),n.jsx(i,{children:n.jsx(I,{})}),n.jsx(i,{children:n.jsx(e,{children:"1"})}),n.jsx(i,{children:n.jsx(c,{})}),n.jsx(i,{children:n.jsx(e,{children:"4"})}),n.jsx(i,{children:n.jsx(e,{isActive:!0,children:"5"})}),n.jsx(i,{children:n.jsx(e,{children:"6"})}),n.jsx(i,{children:n.jsx(c,{})}),n.jsx(i,{children:n.jsx(e,{children:"62"})}),n.jsx(i,{children:n.jsx(C,{})}),n.jsx(i,{children:n.jsx(S,{})})]})})]})})]})},j={render:()=>{const[t,N]=v.useState(5),[x,L]=v.useState(20),s=62,f=1234,y=(t-1)*x+1,w=Math.min(t*x,f),r=o=>{N(Math.max(1,Math.min(o,s)))},z=()=>{const o=[];{o.push(n.jsx(i,{children:n.jsx(e,{isActive:t===1,onClick:()=>r(1),children:"1"})},1)),t>3&&o.push(n.jsx(i,{children:n.jsx(c,{})},"ellipsis1"));const E=Math.max(2,t-1),R=Math.min(s-1,t+1);for(let l=E;l<=R;l++)o.push(n.jsx(i,{children:n.jsx(e,{isActive:l===t,onClick:()=>r(l),children:l})},l));t<s-2&&o.push(n.jsx(i,{children:n.jsx(c,{})},"ellipsis2")),o.push(n.jsx(i,{children:n.jsx(e,{isActive:s===t,onClick:()=>r(s),children:s})},s))}return o};return n.jsx(a,{title:"Interactive",children:n.jsxs("div",{className:"space-y-4",children:[n.jsxs("div",{className:"text-center",children:[n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Current Page: ",t," | Page Size: ",x," | Total Pages: ",s]}),n.jsxs("p",{className:"text-sm text-muted-foreground",children:["Showing ",y,"-",w," of ",f," results"]})]}),n.jsx(P,{className:"mx-0 w-fit",children:n.jsxs(d,{children:[n.jsx(i,{children:n.jsx(u,{onClick:()=>r(1)})}),n.jsx(i,{children:n.jsx(I,{onClick:()=>r(t-1)})}),z(),n.jsx(i,{children:n.jsx(C,{onClick:()=>r(t+1)})}),n.jsx(i,{children:n.jsx(S,{onClick:()=>r(s)})})]})}),n.jsx("div",{className:"flex justify-center",children:n.jsx(k,{pageSize:x,onPageSizeChange:L,pageSizeOptions:[10,20,50,100]})})]})})}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Container with numbers">
        <Pagination className="mx-0 w-fit">
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
      </StorySection>

      <StorySection title="First">
        <PaginationFirst />
      </StorySection>

      <StorySection title="Last">
        <PaginationLast />
      </StorySection>

      <StorySection title="Previous">
        <PaginationPrevious />
      </StorySection>

      <StorySection title="Next">
        <PaginationNext />
      </StorySection>

      <StorySection title="Ellipsis">
        <PaginationEllipsis />
      </StorySection>

      <StorySection title="Page size">
        <PaginationPageSize pageSize={20} onPageSizeChange={() => {}} className="w-fit" />
      </StorySection>
    </StoryShowcase>
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Basic pagination">
        <Pagination className="mx-0 w-fit">
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
      </StorySection>

      <StorySection title="With navigation">
        <Pagination className="mx-0 w-fit">
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
      </StorySection>

      <StorySection title="Complete example">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing 21-40</span>
            <span className="text-sm text-muted-foreground">of 1,234 results</span>
          </div>

          <Pagination className="mx-0 w-fit">
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
      </StorySection>
    </StoryShowcase>
}`,...p.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
    return <StorySection title="Interactive">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Current Page: {currentPage} | Page Size: {pageSize} | Total Pages: {totalPages}
            </p>
            <p className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {totalResults} results
            </p>
          </div>

          <Pagination className="mx-0 w-fit">
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
        </div>
      </StorySection>;
  }
}`,...j.parameters?.docs?.source}}};const on=["BuildingBlocks","CompletePagination","InteractivePagination"];export{h as BuildingBlocks,p as CompletePagination,j as InteractivePagination,on as __namedExportsOrder,sn as default};
