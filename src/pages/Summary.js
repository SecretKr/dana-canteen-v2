"use client"
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';

export default function Home() {
  const [id, setId] = useState("")
  const [refs, setRefs] = useState([])
  const [list, setList] = useState([])
  const [selected, setSelected] = useState()
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [dbIp, setDbIp] = useState('127.0.0.1')


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "date"), (querySnapshot) => {
      const l = new Set();
      querySnapshot.forEach((doc) => {
        const dt = doc.id.split("_")
        let str;
        if(Number(dt[2]) <= 15) str = dt[0]+"_"+dt[1]+"_1"
        else str = dt[0]+"_"+dt[1]+"_16"
        l.add(str)
      })
      const lst = Array.from(l)
      setList(lst)
    })
  }, [db])

  const getData = async ({n,i}) => {
    const t = []
    try{
      const sp = selected.split("_")
      const querySnapshot = await getDocs(collection(db, "date", sp[0]+"_"+sp[1]+"_"+String(i), n))
      querySnapshot.forEach((doc) => {
        t.push(doc.data())
      })
    }
    catch {}
    return t
  }

  const getTable = async () => {
    if(selected != undefined){
      const l = []
      const csvL = [["Date"],["Shift-1 10.00-14.00"],["Shift-2 15.00-20.00"],["Shift-3 22.00-1.00"],["Shift-4 3.00-8.00"],["Other"]]
      const sp = selected.split("_")
      for(let i = 1;i < 16;i++){
        const ts0 = await getData({n:"0", i:(i + Number(sp[2]) - 1)})
        const ts1 = await getData({n:"1", i:(i + Number(sp[2]) - 1)})
        const ts2 = await getData({n:"2", i:(i + Number(sp[2]) - 1)})
        const ts3 = await getData({n:"3", i:(i + Number(sp[2]) - 1)})
        const ts4 = await getData({n:"4", i:(i + Number(sp[2]) - 1)})
        l.push({date: String(i + Number(sp[2]) - 1), s0:ts0, s1: ts1, s2: ts2, s3: ts3, s4:ts4, fullDate: sp[0]+"_"+sp[1]+"_"+String(i + Number(sp[2]) - 1)+","})
        csvL[0].push(String(i + Number(sp[2]) - 1))
        csvL[1].push(ts1.length)
        csvL[2].push(ts2.length)
        csvL[3].push(ts3.length)
        csvL[4].push(ts4.length)
        csvL[5].push(ts0.length)
      }
      setData(l)
      setCsvData(csvL)
    }
  }

  useEffect(() => {
    if(selected != undefined){
      console.log(selected)
      getTable()
    }
  }, [db, selected])

  useEffect(() => {
    const today = new Date();
    let str;
    if(today.getDate() <= 16) str = today.getFullYear()+"_"+(today.getMonth()+1)+"_1"
    else str = today.getFullYear()+"_"+(today.getMonth()+1)+"_16"
    setSelected(str)
  }, [])

  const handleChange = (e) => { 
    setSelected(e.target.value)
  }

  const test = async() => {
    const t = []
    const querySnapshot = await getDocs(collection(db, "date", "2024_5_20", "2"))
    querySnapshot.forEach((doc) => {
      t.push(doc.data())
      console.log(doc.data())
    })
  }

  const router = useRouter();
  const goBack = () => {
    router.push("/")
  }

  return (
    <div className="relative min-h-screen px-[5%] gap-24">
      {/* <button onClick={test}>test</button> */}
      <p className="absolute right-2 top-2">DB-IP: {dbIp}</p>
      <button
        className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-16 mr-4 my-20 text-center"
        onClick={goBack}
      >
        Back
      </button>
      <select className="text-gray-600 bg-white p-2 h-10 w-32 rounded-md mr-4 text-center" value={selected} onChange={handleChange}>
        {list.map(item => (
          <option value={item} key={item}>{item}</option>
        ))}
      </select>
      <button
        className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-20 mr-4 text-center"
        onClick={getTable}
      >
        Refresh
      </button>
      <div className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-48 text-center">
      <CsvDownloader
        filename={"summary " + selected}
        extension=".csv"
        datas={csvData}
        text="Download CSV"
      /></div>
      <div className="flex">
        <Table data={data}/>
      </div>
    </div>
  );
}

const Table = ({data}) => {
  const router = useRouter()
  const pushToHistory = ({path}) => {
    router.push("/summary/history?date=" + path)
  }

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
                {item.s1.length}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 2<br></br>15 - 20</td>
          {data.map((item => {
            return(
              <td key={"2"+item.date} onClick={() => pushToHistory({path:item.fullDate+"2"})}>
                {item.s2.length}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 3<br></br>22 - 1</td>
          {data.map((item => {
            return(
              <td key={"3"+item.date} onClick={() => pushToHistory({path:item.fullDate+"3"})}>
                {item.s3.length}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Shift 4<br></br>3 - 8</td>
          {data.map((item => {
            return(
              <td key={"4"+item.date} onClick={() => pushToHistory({path:item.fullDate+"4"})}>
                {item.s4.length}
              </td>
            )
          }))}
        </tr>
        <tr>
          <td className="text-xs">Other</td>
          {data.map((item => {
            return(
              <td key={"0"+item.date} onClick={() => pushToHistory({path:item.fullDate+"0"})}>
                {item.s0.length}
              </td>
            )
          }))}
        </tr>
      </tbody>
    </table>
  )
}