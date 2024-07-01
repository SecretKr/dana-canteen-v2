import '../globals.css';
import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient"

function GeneralRecord() {
  const inputRef = useRef(null);
  const [id, setId] = useState("")
  const [confirmation, setConfirmation] = useState("")

  const submit = async() => {
    if(id != ""){
        setId("")
        const today = new Date()
        const timestamp = String(today.getTime())
        const { data, error } = await supabase.rpc('append_general', {
            date: today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate(),
            new_data: {
                timestamp: timestamp,
                id: id
            }
          });
          if(error){
            console.log(error.details)
          }
          else{
            setConfirmation(id)
          }
    }
  }

  const handleInputChange = (e) => { 
    const input = e.target.value;
    setId(input)
  }

  return (
    <div className="relative flex min-h-screen" onClick={() => inputRef.current.focus()}>
      <Link to="/summary"><button className="absolute top-4 left-4 bg-white rounded-md text-gray-600 p-2 w-24 h-10">Summary</button></Link>
      <Link to="/"><button className="absolute top-4 left-32 bg-white rounded-md text-gray-600 p-2 w-24 h-10">Food</button></Link>
      <p className="absolute right-2 top-2">DB: {"http://" + window.location.hostname + ":54321"}</p>
      <div className="w-full content-center items-center justify-between flex-col">
        <div className="w-full content-center text-center">
            <h className="font-bold text-4xl text-gray-600">General Record</h>
        </div>
        <div className="text-center mt-10">
          <input className="p-2 w-96 mr-4 rounded-md outline-none"
            ref={inputRef}
            type="text"
            value={id}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                submit()
            }}
            placeholder='ID'
          />
          <button className="bg-white rounded-md text-gray-600 p-2 w-20" onClick={submit}>Submit</button>
        </div>
        <div className="text-center mt-4 transition-all duration-500"><p className="h-8">{confirmation != "" && (confirmation+" OK")}</p></div>
      </div>
    </div>
  );
}

export default GeneralRecord;
