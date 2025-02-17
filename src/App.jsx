import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [barcode,setBarcode] = useState('')
  const [supplier,setSupplier] = useState('')
  const [description,setDescription] = useState('')
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');


  //handle barcode input
  const handleInputChange = (event) =>{
       setBarcode(event.target.value)
  }

  //fetch product data
  const fetchProductData = async (event)=>{
    if(event.key === "Enter"){
      event.preventDefault()
      try {
        const response = await axios.get(`http://localhost:4000/find/${barcode}`)
        console.log(response)
        const product = response.data
        if (product) {
          setDescription(product.product_description);
          setSupplier(product.supplier);
          setError('');
        } else {
          setError('product not found')
        }
        
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Error fetching product data'); 
      }
    }
  }

  //handle submitting of the products
  const handleSubmit = async(event)=>{
      event.preventDefault()
      try {
        const response = await axios.post(`http://localhost:4000/expiries`,{
          quantity,
          product_id: barcode, // Assuming barcode is used as product_id
          expiry_date: expiryDate,
        })
        console.log(response.data);
        setQuantity('');
        setExpiryDate('');
        setError('');
      } catch (error) {
        console.error('Error posting expiry data:', error);
        setError('Error posting expiry data');
      }
  }
  return (
    <>
      <div className="flex flex-col justify-around items-center container w-xl h-96 border-2 border-sky-500">
        <form onSubmit={handleSubmit}>
        <div className="w-auto h-72 flex flex-col justify-around items-center">
          <div>
            <input
             type="text" 
             placeholder="barcode"
             className="input"
             value={barcode}
             onChange={handleInputChange}
             onKeyDown={fetchProductData}
             />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <input
            type="text" 
            placeholder="description" 
            className="input"
            value={description}
            readOnly
            />
          </div>
          <div>
            <input 
            type="text" 
            placeholder="supplier" 
            className="input" 
            value={supplier}
            readOnly
            />
          </div>
          <div>
            <input type="number" 
            placeholder="quantity" 
            className="input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="expiry date"
              className="input w-48"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center">
            <button className="btn btn-success" type="submit">Submit expiry</button>
          </div>
        </div>
        </form>
      </div>
    </>
  );
}

export default App;
