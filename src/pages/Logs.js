"use client"
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CsvDownloader from 'react-csv-downloader';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const router = useRouter()
  const [date, setDate] = useState("")
  const [data, setData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [dbIp, setDbIp] = useState('127.0.0.1')

  const getData = async () => {
    const t = []
    const ct = [["Time", "Id"]]
    try{
      const d = searchParams.get("date");
      console.log(d)
      const sp = d.split(",")
      const querySnapshot = await getDocs(collection(db, "date", sp[0], sp[1]))
      querySnapshot.forEach((doc) => {
        t.push(doc.data())
        ct.push([new Date(Number(doc.data().timestamp)).toLocaleString('en-us').replace(",",""), doc.data().id])
      })
      setDate(d)
    }
    catch {}
    console.log(t)
    setCsvData(ct)
    setData(t)
  }

  useEffect(() => {
    getData()
  }, [])
  
  const goBack = () => {
    router.push("/summary")
  }

  return (
    <div className="relative min-h-screen px-[5%] gap-24">
      {/* <button onClick={test}>test</button> */}
      <p className="absolute right-2 top-2">DB-IP: {dbIp}<br></br>Date: {date}</p>
      <button
        className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-16 mr-4 my-20 text-center"
        onClick={goBack}
      >
        Back
      </button>
      <button
        className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-20 mr-4 text-center"
        onClick={getData}
      >
        Refresh
      </button>
      <div className="text-gray-600 bg-white rounded inline-block p-2 h-10 w-48 text-center">
      <CsvDownloader
        filename={date}
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
  return (
    <table className="w-full table-fixed">
      <tbody>
        <tr>
          <th>Time</th>
          <th>Id</th>
        </tr>
        {data.map((item => (
          <tr key={item.timestamp}>
            <td>{new Date(Number(item.timestamp)).toLocaleString('en-us').replace(",","")}</td>
            <td>{item.id}</td>
          </tr>
        )))}
      </tbody>
    </table>
  )
}