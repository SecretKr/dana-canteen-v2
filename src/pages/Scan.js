import '../globals.css';
import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient"

function Scan() {
  const inputRef = useRef(null);
  const [id, setId] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [selectedCoupon, setSelectedCoupon] = useState("food")

  const submit = async() => {
    if(id != ""){
        console.log(selectedCoupon, id)
        setId("")
        const today = new Date()
        const hours = today.getHours()
        const timestamp = String(today.getTime())
        if(hours < 8) today.setDate(today.getDate() - 1)
        const { data, error } = await supabase.rpc('append_' + selectedCoupon, {
            date: today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate(),
            new_data: {
                timestamp: timestamp,
                id: id
            }
          });
    }
  }

  const handleInputChange = (e) => { 
    const input = e.target.value;
    setId(input)
  }

  const handleButtonPressed = (option) => {
    setSelectedCoupon(option)
    inputRef.current.focus()
  }

  return (
    <div className="relative flex min-h-screen" onClick={() => inputRef.current.focus()}>
      <Link to="/summary"><button className="absolute top-4 left-4 bg-white rounded-md text-gray-600 p-2 w-24 h-10">Summary</button></Link>
      <p className="absolute right-2 top-2">DB: {"http://" + window.location.hostname + ":54321"}</p>
      <div className="w-full content-center items-center justify-between flex-col">
        <div className="w-full content-center text-center">
            <button onClick={() => handleButtonPressed("food")} className={selectedCoupon=="food" ? "select_button bg-blue-300" : "select_button bg-white"}>Food</button>
            <button onClick={() => handleButtonPressed("milk")} className={selectedCoupon=="milk" ? "select_button bg-blue-300" : "select_button bg-white"}>Milk</button>
            <button onClick={() => handleButtonPressed("other")} className={selectedCoupon=="other" ? "select_button bg-blue-300" : "select_button bg-white"}>Other</button>
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
        <div className="text-center mt-4 transition-all duration-500"><p className="">{confirmation != "" && (confirmation+" OK")}</p></div>
      </div>
    </div>
  );
}

export default Scan;
