"use client"
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';
import { supabase } from "../supabaseClient";

export default function GeneralLogs() {
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
    const ct = [["Time", "Id", "Name", "Department"]]
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
          data_style = "bg-gray-200"
          if(userInfo[Number(sorted[i].id)]){
            data_name = userInfo[Number(sorted[i].id)].name + " " + userInfo[Number(sorted[i].id)].lastname
            data_dep = userInfo[Number(sorted[i].id)].department
          }
          else{
            data_name = "N/A"
            data_dep = "N/A"
          }
          t.push({timestamp: data_timestamp, id: data_id, name: data_name, dep: data_dep, shift: data_shift, style: data_style})
          ct.push([data_timestamp, data_id, data_name, data_dep])
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