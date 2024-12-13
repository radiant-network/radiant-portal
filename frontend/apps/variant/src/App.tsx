// import React from 'react'
import * as React from 'react';

//import { useState } from 'react'
import './App.css'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/base/ui/accordion"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "components/base/ui/table"
import { variantsData } from './variant_data'

export interface AppProps {
  api: string,
}

function App({ api }: AppProps) {
  //const [count, setCount] = useState(0)
  console.log(api);
  return (
    <div className="flex flex-1">
      <aside className="w-1/4 bg-gray-200 p-4">
        <ul>
          <li><a href="#" className="block py-2 hover:bg-gray-300 px-3">Dashboard</a></li>
          <li><a href="#" className="block py-2 hover:bg-gray-300 px-3">Settings</a></li>
          <li><a href="#" className="block py-2 hover:bg-gray-300 px-3">Profile</a></li>
        </ul>
      </aside>

      <main className="flex-1 p-4 bg-white h-full">
        <h1 className="text-2xl font-bold">Welcome to the Content Section</h1>
        <p className="mt-4 text-gray-700">This is where the main content will go.</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Variant</TableHead>
              <TableHead>dna Change</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variantsData.variants.map((data) => (
              <TableRow key={data.node.assembly_version}>
                <TableCell className="font-medium">{data.node.assembly_version}</TableCell>
                <TableCell>{data.node.dna_change}</TableCell>
                <TableCell className="text-right">{data.node.chromosome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Can be pagination</TableCell>
              <TableCell className="text-right">1 / 1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

      </main>
    </div >
  )
}

export default App

