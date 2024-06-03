"use client"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';
import { supabase } from "../supabaseClient"
import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";

export default function Summary() {
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [selectedCoupon, setSelectedCoupon] = useState("food")
  const [tbOtherData, setTbOtherData] = useState([])
  const [tbGxoData, setTbGxoData] = useState([])
  const [tbData, setTbData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [userInfo, setUserInfo] = useState({})

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

  const getTable = async () => {
    //await getUsers()
    //console.log(userInfo)

    if(startDate && endDate && (new Date(endDate) - new Date(startDate) >= 0)){
      let iDate = new Date(startDate)
      //console.log(iDate.toISOString().split("T")[0])

      const { data, error } = await supabase
        .from(selectedCoupon)
        .select("*")
        .gte('date', startDate)
        .lte('date', endDate)
      const sorted = data.sort((a,b) => new Date(a.date) - new Date(b.date))
      //console.log(sorted)

      const table = []
      const table_gxo = []
      const table_other = []
      const csvL = [["Dana Ladkrabang"],["Date"],["Shift-1 10.00-14.00"],["Shift-2 15.00-20.00"],["Shift-3 22.00-1.00"],["Shift-4 3.00-8.00"],["Other"],[","],
                    ["GXO"],["Date"],["Shift-1 10.00-14.00"],["Shift-2 15.00-20.00"],["Shift-3 22.00-1.00"],["Shift-4 3.00-8.00"],["Other"],[","],
                    ["Other"],["Date"],["Shift-1 10.00-14.00"],["Shift-2 15.00-20.00"],["Shift-3 22.00-1.00"],["Shift-4 3.00-8.00"],["Other"]]
      for(let i = 0;i < sorted.length;i++){
        let ts = [0,0,0,0,0]
        let ts_gxo = [0,0,0,0,0]
        let ts_other = [0,0,0,0,0]
        for(let j = 0;j < sorted[i].data.length;j++){
          const hours = new Date(Number(sorted[i].data[j].timestamp)).getHours()
          let type
          if(userInfo[Number(sorted[i].data[j].id)]) type = userInfo[Number(sorted[i].data[j].id)].department
          else type = "None"
          if(type == "Dana Ladkrabang"){
            if(hours >= 10 && hours < 14) ts[1]++;
            else if(hours >= 15 && hours < 20) ts[2]++;
            else if(hours >= 22 || hours < 1) ts[3]++;
            else if(hours >= 3 && hours < 8) ts[4]++;
            else ts[0]++
          }
          else if(type == "GXO") {
            if(hours >= 10 && hours < 14) ts_gxo[1]++;
            else if(hours >= 15 && hours < 20) ts_gxo[2]++;
            else if(hours >= 22 || hours < 1) ts_gxo[3]++;
            else if(hours >= 3 && hours < 8) ts_gxo[4]++;
            else ts_gxo[0]++
          }
          else{
            if(hours >= 10 && hours < 14) ts_other[1]++;
            else if(hours >= 15 && hours < 20) ts_other[2]++;
            else if(hours >= 22 || hours < 1) ts_other[3]++;
            else if(hours >= 3 && hours < 8) ts_other[4]++;
            else ts_other[0]++
          }
        }
        const sp = sorted[i].date.split("-")
        while(sorted[i].date != iDate.toISOString().split("T")[0]){
          const idsp = iDate.toISOString().split("T")[0].split("-")
          table.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
          table_gxo.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
          table_other.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
          csvL[1].push(sp[1]+"-"+sp[2])
          csvL[2].push(0)
          csvL[3].push(0)
          csvL[4].push(0)
          csvL[5].push(0)
          csvL[6].push(0)
          csvL[9].push(sp[1]+"-"+sp[2])
          csvL[10].push(0)
          csvL[11].push(0)
          csvL[12].push(0)
          csvL[13].push(0)
          csvL[14].push(0)
          csvL[17].push(sp[1]+"-"+sp[2])
          csvL[18].push(0)
          csvL[19].push(0)
          csvL[20].push(0)
          csvL[21].push(0)
          csvL[22].push(0)
          iDate.setDate(iDate.getDate() + 1)
        }
        table.push({date: sp[1]+"-"+sp[2], s0:ts[0], s1: ts[1], s2: ts[2], s3: ts[3], s4:ts[4], fullDate: sp[0]+"-"+sp[1]+"-"+sp[2]})
        table_gxo.push({date: sp[1]+"-"+sp[2], s0:ts_gxo[0], s1: ts_gxo[1], s2: ts_gxo[2], s3: ts_gxo[3], s4:ts_gxo[4], fullDate: sp[0]+"-"+sp[1]+"-"+sp[2]})
        table_other.push({date: sp[1]+"-"+sp[2], s0:ts_other[0], s1: ts_other[1], s2: ts_other[2], s3: ts_other[3], s4:ts_other[4], fullDate: sp[0]+"-"+sp[1]+"-"+sp[2]})
        csvL[1].push(sp[1]+"-"+sp[2])
        csvL[2].push(ts[1])
        csvL[3].push(ts[2])
        csvL[4].push(ts[3])
        csvL[5].push(ts[4])
        csvL[6].push(ts[0])
        csvL[9].push(sp[1]+"-"+sp[2])
        csvL[10].push(ts_gxo[1])
        csvL[11].push(ts_gxo[2])
        csvL[12].push(ts_gxo[3])
        csvL[13].push(ts_gxo[4])
        csvL[14].push(ts_gxo[0])
        csvL[17].push(sp[1]+"-"+sp[2])
        csvL[18].push(ts_other[1])
        csvL[19].push(ts_other[2])
        csvL[20].push(ts_other[3])
        csvL[21].push(ts_other[4])
        csvL[22].push(ts_other[0])
        iDate.setDate(iDate.getDate() + 1)
      }
      for(let d = iDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const idsp = d.toISOString().split("T")[0].split("-")
        table.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: d.toISOString().split("T")[0]})
        table_gxo.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
        table_other.push({date: idsp[1]+"-"+idsp[2], s0: 0, s1: 0, s2: 0, s3: 0, s4:0, fullDate: iDate.toISOString().split("T")[0]})
        csvL[1].push(idsp[1]+"-"+idsp[2])
        csvL[2].push(0)
        csvL[3].push(0)
        csvL[4].push(0)
        csvL[5].push(0)
        csvL[6].push(0)
        csvL[9].push(idsp[1]+"-"+idsp[2])
        csvL[10].push(0)
        csvL[11].push(0)
        csvL[12].push(0)
        csvL[13].push(0)
        csvL[14].push(0)
        csvL[17].push(idsp[1]+"-"+idsp[2])
        csvL[18].push(0)
        csvL[19].push(0)
        csvL[20].push(0)
        csvL[21].push(0)
        csvL[22].push(0)
      }
      setTbData(table)
      setTbGxoData(table_gxo)
      setTbOtherData(table_other)
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
    <div className="relative px-[5%] pb-12">
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
      <div className="text-gray-600 bg-white rounded inline-block h-10 w-48 text-center">
        <CsvDownloader
          style={{"height": "2.5rem", "width": "12rem"}}
          filename={"Summary " + selectedCoupon + " " + startDate.toISOString().split("T")[0] + " - " + endDate.toISOString().split("T")[0]}
          extension=".csv"
          datas={csvData}
          text="Download CSV"
        />
      </div>
      <div className="flex mt-5 flex-col">
        <h1 className="font-semibold text-2xl">Dana Ladkrabang</h1>
        <Table data={tbData} selectedCoupon={selectedCoupon} dep="1"/>
      </div>
      <div className="flex mt-5 flex-col">
        <h1 className="font-semibold text-2xl">GXO</h1>
        <Table data={tbGxoData} selectedCoupon={selectedCoupon} dep="2"/>
      </div>
      <div className="flex mt-5 flex-col">
        <h1 className="font-semibold text-2xl">Other</h1>
        <Table data={tbOtherData} selectedCoupon={selectedCoupon} dep="3"/>
      </div>
    </div>
  );
}

const Table = ({data, selectedCoupon, dep}) => {
  const navigate = useNavigate()
  const pushToHistory = ({date, shift}) => {
    navigate("/logs?date=" + date + "&type=" + selectedCoupon + "&dep=" + dep)
  }

  return (
    <table className="w-full">
      <tbody>
        <tr className="summary-tr">
          <th></th>
          {data.map((item => {
            return(
              <th key={item.date}>
                {item.date}
              </th>
            )
          }))}
        </tr>
        <tr className="summary-tr">
          <td className="text-xs summary-td">Shift 1<br></br>10 - 14</td>
          {data.map((item => {
            return(
              <td key={"1"+item.date} onClick={() => pushToHistory({date:item.fullDate, shift: "1"})}>
                {item.s1}
              </td>
            )
          }))}
        </tr>
        <tr className="summary-tr">
          <td className="text-xs summary-td">Shift 2<br></br>15 - 20</td>
          {data.map((item => {
            return(
              <td key={"2"+item.date} onClick={() => pushToHistory({date:item.fullDate, shift: "2"})}>
                {item.s2}
              </td>
            )
          }))}
        </tr>
        <tr className="summary-tr">
          <td className="text-xs summary-td">Shift 3<br></br>22 - 1</td>
          {data.map((item => {
            return(
              <td key={"3"+item.date} onClick={() => pushToHistory({date:item.fullDate, shift: "3"})}>
                {item.s3}
              </td>
            )
          }))}
        </tr>
        <tr className="summary-tr">
          <td className="text-xs summary-td">Shift 4<br></br>3 - 8</td>
          {data.map((item => {
            return(
              <td key={"4"+item.date} onClick={() => pushToHistory({date:item.fullDate, shift: "4"})}>
                {item.s4}
              </td>
            )
          }))}
        </tr>
        <tr className="summary-tr">
          <td className="text-xs summary-td">Other</td>
          {data.map((item => {
            return(
              <td key={"0"+item.date} onClick={() => pushToHistory({date:item.fullDate, shift: "0"})}>
                {item.s0}
              </td>
            )
          }))}
        </tr>
      </tbody>
    </table>
  )
}