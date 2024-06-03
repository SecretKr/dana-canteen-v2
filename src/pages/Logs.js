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
  const [userInfo, setUserInfo] = useState({})
  const [department, setDepartment] = useState("")

  const getUsers = async () => {
    const users = {}
    const { data, error } = await supabase
        .from("users")
        .select("*")
    data.map((item) => {
      users[item.card] = item
    })
    setUserInfo(users)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const getData = async () => {
    const t = []
    const ct = [["Time", "Id", "Name", "Department", "Shift"]]
    const date = searchParams.get("date")
    setDate(date)
    const type = searchParams.get("type")
    const dep = searchParams.get("dep")
    setDepartment(dep)
    //const shift = searchParams.get("shift")
    if(date && type && dep){
      const { data, error } = await supabase
      .from(type)
      .select("*")
      .eq('date', date)
      if(data.length != 0){
        const sorted = data[0].data.sort((a,b) => Number(a.timestamp) - Number(b.timestamp))
        console.log(sorted)
        for(let i = 0;i < sorted.length;i++){
          let data_timestamp, data_id, data_name, data_dep, data_shift, data_style
          data_timestamp = new Date(Number(sorted[i].timestamp)).toLocaleString('en-us').replace(",","")
          data_id = sorted[i].id
          const hours = new Date(Number(sorted[i].timestamp)).getHours()
          if(hours >= 10 && hours < 14) data_shift = 1
          else if(hours >= 15 && hours < 20) data_shift = 2
          else if(hours >= 22 || hours < 1) data_shift = 3
          else if(hours >= 3 && hours < 8) data_shift = 4
          else data_shift = 0
          if(data_shift == 1) data_style = "bg-blue-200"
          if(data_shift == 2) data_style = "bg-green-200"
          if(data_shift == 3) data_style = "bg-red-200"
          if(data_shift == 4) data_style = "bg-purple-200"
          if(data_shift == 0) data_style = "bg-gray-200"
          if(userInfo[Number(sorted[i].id)]){
            data_name = userInfo[Number(sorted[i].id)].name + " " + userInfo[Number(sorted[i].id)].lastname
            data_dep = userInfo[Number(sorted[i].id)].department
          }
          else{
            data_name = "N/A"
            data_dep = "N/A"
          }
          if(dep == "1" && data_dep == "Dana Ladkrabang"){
            t.push({timestamp: data_timestamp, id: data_id, name: data_name, dep: data_dep, shift: data_shift, style: data_style})
            ct.push([data_timestamp, data_id, data_name, data_dep, data_shift == "0" ? "-" : data_shift])
          }
          if(dep == "2" && data_dep == "GXO"){
            t.push({timestamp: data_timestamp, id: data_id, name: data_name, dep: data_dep, shift: data_shift, style: data_style})
            ct.push([data_timestamp, data_id, data_name, data_dep, data_shift == "0" ? "-" : data_shift])
          }
          if(dep == "3" && data_dep != "Dana Ladkrabang" && data_dep != "GXO"){
            t.push({timestamp: data_timestamp, id: data_id, name: data_name, dep: data_dep, shift: data_shift, style: data_style})
            ct.push([data_timestamp, data_id, data_name, data_dep, data_shift == "0" ? "-" : data_shift])
          }
        }
        setData(t)
        setCsvData(ct)
      }
    }
  }

  useEffect(() => {
    getData()
  }, [userInfo])

  return (
    <div className="relative min-h-screen px-[5%] h-10">
      <div className="gap-4 flex flex-row content-start items-center mt-6">
        {/* <button onClick={test}>test</button> */}
        <p className="absolute right-2 top-0">Date: {thisDate}<br></br>Type: {searchParams.get("type")}</p>
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
        <div className="text-gray-600 bg-white rounded inline-block h-14 w-48 text-center content-center">
        <CsvDownloader
          style={{"height": "3.5rem", "width": "12rem"}}
          filename={"Logs " + thisDate}
          extension=".csv"
          datas={csvData}
          text="Download CSV"
        /></div>
        <div className="text-gray-600 bg-white rounded h-14 p-2 text-center content-center grid grid-cols-2 gap-x-2">
          <p>Shift-1 (10.00-14.00) <span className="inline-block bg-blue-200 rounded h-4 w-4 translate-y-0.5"/></p>
          <p>Shift-2 (15.00-20.00) <span className="inline-block bg-green-200 rounded h-4 w-4 translate-y-0.5"/></p>
          <p>Shift-3 (22.00-01.00) <span className="inline-block bg-red-200 rounded h-4 w-4 translate-y-0.5"/></p>
          <p>Shift-4 (03.00-08.00) <span className="inline-block bg-purple-200 rounded h-4 w-4 translate-y-0.5"/></p>
        </div>
      </div>
      <div className="flex mt-5 flex-col">
        <h1 className="font-semibold text-2xl">{department == "1" && "Dana Ladkrabang"}{department == "2" && "GXO"}{department == "3" && "Other"}</h1>
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
          <th>Name</th>
          <th>Department</th>
        </tr>
        {data.map((item => (
          <tr key={item.timestamp} className={item.style}>
            <td>{item.timestamp}</td>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.dep}</td>
          </tr>
        )))}
      </tbody>
    </table>
  )
}