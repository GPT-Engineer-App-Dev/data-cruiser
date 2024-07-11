import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parse, unparse } from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parse(text, { header: true });
        setHeaders(parsedData.meta.fields);
        setCsvData(parsedData.data);
      };
      reader.readAsText(file);
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][column] = value;
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownload = () => {
    const csv = unparse(csvData, { headers });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName || "edited.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Management Tool</h1>
      <p className="mb-4">Upload, view, edit, and download CSV files.</p>

      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleFileUpload} className="ml-2">Upload</Button>
      </div>

      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Button onClick={handleAddRow} className="mr-2">Add Row</Button>
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;