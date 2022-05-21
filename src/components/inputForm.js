import React, { useState } from "react";
import "./form.css";
import { CSVLink } from "react-csv";
import { getHeader, convertJSONToTable } from "../services/flat";
import JSONTable from "./table";

export default function InputForm() {
  const [tableData, setTableData] = useState([]);
  const [jsonData, setJSONData] = useState();
  const [getReady, setGetReady] = useState([]);
  const [resetval, setVal] = useState();

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      onJSONDataChange(null, e.target.result);
    };
  };

  const convertedData = (tableData) => {
    const returnData = tableData.map((x) => {
      const finalData = x.map((data) => (data ? data : "Null"));
      return finalData;
    });
    setGetReady(returnData);
  };

  const csvReport = {
    data: getReady,
    filename: "ConvertedCSv.csv",
  };
  function onJSONDataChange(e, fileJSON) {
    const value = e ? e.target.value : fileJSON;
    if (fileJSON) {
      document.getElementsByName("jsonData")[0].value = fileJSON;
    }
    setJSONData(value);
  }

  async function viewTable() {
    try {
      const parsed = JSON.parse(jsonData);
      const headers = await getHeader(parsed);
      convertJSONToTable(headers, parsed, (result) => {
        setTableData(result);
      });
    } catch (e) {
      alert("Error! Invalid JSON");
    }
  }

  // const val = JSON.stringify(jsonData, 2, 2);
  return (
    <div className="JSONFormWrapper">
      <h1 className="head">CONVERT JSON TO TABLE FORM</h1>
      <form value={resetval} className="form">
        <label className="label">INPUT PLACE FOR JSON DATA:</label>

        <textarea
          name="jsonData"
          type="text"
          className="text"
          onChange={onJSONDataChange}
        ></textarea>

        <div style={{ marginTop: "4px", marginLeft: "10px" }}>
          <label className="label2">SELECT A JSON FILE:</label>
          <input
            type="file"
            onChange={handleChange}
            style={{ color: "black", marginLeft: "8px" }}
          ></input>
        </div>
        <button className="button" type="button" onClick={viewTable}>
          Convert Json to Table
        </button>
        <button
          onClick={(e) => convertedData(tableData)}
          className="button"
          style={{ marginLeft: "9px" }}
        >
          <CSVLink
            style={{
              marginLeft: "33px",
              textDecoration: "none",
              marginLeft: "0px",
              color: "white",
            }}
            {...csvReport}
          >
            Export to CSV
          </CSVLink>
        </button>
        <button
          className="button"
          style={{ marginLeft: "9px" }}
          onClick={() => setVal(() => "")}
        >
          Reset
        </button>
      </form>
      <div className="tabledata">
        <JSONTable data={tableData} />
      </div>
    </div>
  );
}
