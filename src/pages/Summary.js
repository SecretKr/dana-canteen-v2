"use client"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';
import { supabase } from "../supabaseClient"
import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";

export default function Summary() {
  const [id, setId] = useState("")
  const [refs, setRefs] = useState([])
  const [list, setList] = useState([])
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [selectedCoupon, setSelectedCoupon] = useState("food")
  const [tbData, setTbData] = useState([])
  const [csvData, setCsvData] = useState([])

  const getTable = async () => {
    if(startDate && endDate && (new Date(endDate) - new Date(startDate) >= 0)){
      let iDate = new Date(startDate)
      //console.log(iDate.toISOString().split("T")[0])

      const { data, error } = await supabase
        .from(selectedCoupon)
        .select("*")
        .gte('date', startDate)
        .lte('date', endDate)
      const sorted = data.sort((a,b) => new Date(a.date) - new Date(b.date))
      console.log(sorted)

      const l = []
      const csvL = [["Date"],["Shift-1 10.00-14.00"],["Shift-2 15.00-20.00"],["Shift-3 22.00-1.00"],["Shift-4 3.00-8.00"],["Other"]]
      for(let i = 0;i < sorted.length;i++){
        let ts = [0,0,0,0,0]
        for(let j = 0;j < sorted[i].data.length;j++){
          const hours = new Date(Number(sorted[i].data[j].timestamp)).getHours()
          if(hours >= 10 && hours < 14) ts[1]++;
          else if(hours >= 15 && hours < 20) ts[2]++;
          else if(hours >= 22 || hours < 1) ts[3]++;
          else if(hours >= 3 && hours < 8) ts[4]++;
          else ts[0]++
        }
        const sp = sorted[i].date.split("-")
        while(sorted[i].date != iDate.toISOString().split("T")[0]){
          const idsp = iDate.toISOString().split("T")[0].split("-")
          l.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
          iDate.setDate(iDate.getDate() + 1)
        }
        l.push({date: sp[1]+"-"+sp[2], s0:ts[0], s1: ts[1], s2: ts[2], s3: ts[3], s4:ts[4], fullDate: sp[0]+"-"+sp[1]+"-"+sp[2]})
        csvL[0].push(sp[1]+"-"+sp[2])
        csvL[1].push(ts[1])
        csvL[2].push(ts[2])
        csvL[3].push(ts[3])
        csvL[4].push(ts[4])
        csvL[5].push(ts[0])
        iDate.setDate(iDate.getDate() + 1)
      }
      for(let d = iDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const idsp = d.toISOString().split("T")[0].split("-")
        l.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: d.toISOString().split("T")[0]})
      }
      setTbData(l)
      setCsvData(csvL)
    }
  }

  const handleChange = (e) => { 
    setSelectedCoupon(e.target.value)
  }

  const test = async() => {
    const { data, error } = await supabase
      .from('food')
      .select("*")
      .eq('date', '2024-05-29')
    console.log(data)
  }

  return (
    <div className="relative min-h-screen px-[5%] h-10">
      <div className="gap-4 flex flex-row content-start items-center mt-6">
        {/* <button onClick={test}>test</button> */}
        <p className="absolute right-2 top-2">DB-IP: {}</p>
        <Link to="/"><button
          className="text-gray-600 bg-white rounded inline-block p-2 h-14 w-16 text-center"
        >
          Back
        </button></Link>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Start Date" value={startDate} onChange={(date) => setStartDate(date)}/>
          </DemoContainer>
          <DemoContainer components={['DatePicker']}>
            <DatePicker label="End Date" value={endDate} onChange={(date) => setEndDate(date)}/>
          </DemoContainer>
        </LocalizationProvider>
        <select className="text-gray-600 bg-white p-2 h-14 w-20 rounded-md text-center" value={selectedCoupon} onChange={handleChange}>
          <option value="food">Food</option>
          <option value="milk">Milk</option>
          <option value="other">Other</option>
        </select>
        <button
          className="text-gray-600 bg-white rounded inline-block p-2 h-14 w-20 text-center"
          onClick={getTable}
        >
          Search
        </button>
      </div>
      <div className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-48 text-center">
        <CsvDownloader
          filename={"summary " + selectedCoupon}
          extension=".csv"
          datas={csvData}
          text="Download CSV"
        />
      </div>
      <div className="flex mt-4">
        <Table data={tbData}/>
      </div>
    </div>
  );
}

const Table = ({data}) => {
  const pushToHistory = () => {}
  return (
    <table className="w-full table-fixed">
      <tbody>
        <tr>
          <th></th>
          {data.map((item => {
            return(
              <th key={item.date}>
                {item.date}
              </th>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 1<br></br>10 - 14</td>
          {data.map((item => {
            return(
              <td key={"1"+item.date} onClick={() => pushToHistory({path:item.fullDate+"1"})}>
                {item.s1}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 2<br></br>15 - 20</td>
          {data.map((item => {
            return(
              <td key={"2"+item.date} onClick={() => pushToHistory({path:item.fullDate+"2"})}>
                {item.s2}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 3<br></br>22 - 1</td>
          {data.map((item => {
            return(
              <td key={"3"+item.date} onClick={() => pushToHistory({path:item.fullDate+"3"})}>
                {item.s3}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 4<br></br>3 - 8</td>
          {data.map((item => {
            return(
              <td key={"4"+item.date} onClick={() => pushToHistory({path:item.fullDate+"4"})}>
                {item.s4}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Other</td>
          {data.map((item => {
            return(
              <td key={"0"+item.date} onClick={() => pushToHistory({path:item.fullDate+"0"})}>
                {item.s0}
              </td>
            )
          }))}
        </tr>
      </tbody>
    </table>
  )
}