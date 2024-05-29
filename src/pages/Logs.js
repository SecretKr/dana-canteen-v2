"use client"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';
import { supabase } from "../supabaseClient";

export default function Logs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [thisDate, setDate] = useState("")
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])

  const getData = async () => {
    const t = []
    const ct = [["Time", "Id"]]
    const date = searchParams.get("date")
    setDate(date)
    const type = searchParams.get("type")
    //const shift = searchParams.get("shift")
    if(date){
      const { data, error } = await supabase
        .from(type)
        .select("*")
        .eq('date', date)
      const sorted = data[0].data.sort((a,b) => Number(a.timestamp) - Number(b.timestamp))
      console.log(sorted)
      for(let i = 0;i < sorted.length;i++){
        t.push({timestamp: new Date(Number(sorted[i].timestamp)).toLocaleString('en-us').replace(",",""), id: sorted[i].id})
        ct.push([new Date(Number(sorted[i].timestamp)).toLocaleString('en-us').replace(",",""), sorted[i].id])
      }
      setData(t)
      setCsvData(ct)
    }
  }

  useEffect(() => {
    getData()
  }, [])
  
  // const goBack = () => {
  //   router.push("/summary")
  // }

  return (
    <div className="relative min-h-screen px-[5%] h-10">
      <div className="gap-4 flex flex-row content-start items-center mt-6">
        {/* <button onClick={test}>test</button> */}
        <p className="absolute right-2 top-2">DB-IP: {}<br></br>Date: {thisDate}</p>
        <Link to="/summary"><button
          className="text-gray-600 bg-white rounded inline-block p-2 h-14 w-16 text-center"
        >
          Back
        </button></Link>
        <button
          className="text-gray-600 bg-white rounded inline-block p-2 h-14 w-20 text-center"
          onClick={getData}
        >
          Refresh
        </button>
        <div className="text-gray-600 bg-white rounded inline-block p-2 h-14 w-48 text-center content-center">
        <CsvDownloader
          filename={"Logs " + thisDate}
          extension=".csv"
          datas={csvData}
          text="Download CSV"
        /></div>
      </div>
      <div className="flex mt-4">
        <Table data={data}/>
      </div>
    </div>
  );
}

const Table = ({data}) => {
  return (
    <table className="w-full table-fixed">
      <tbody>
        <tr>
          <th>Time</th>
          <th>Id</th>
        </tr>
        {data.map((item => (
          <tr key={item.timestamp}>
            <td>{item.timestamp}</td>
            <td>{item.id}</td>
          </tr>
        )))}
      </tbody>
    </table>
  )
}