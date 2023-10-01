import React, { useEffect, useRef, useState } from 'react'
import MainLayout from '../Layouts/MainLayout';
import data from './data.json';
import "./POSPage.css";
import {toast} from 'react-toastify';
import { ComponentToPrint } from '../Component/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';



function POSPage(){
  const [product,setProducts]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [cart,setCart]=useState([]);
  const [total,setTotalAmount]=useState(0);
  const [qty,setQty]=useState(0);


  const toastOptions={
    autoClose:400,
    pauseOnHover:true,
  }

  const products=data.products;

  const addProductToCart=(product)=>{
    let findProductInCart=cart.find(i=>{
      return i.id===product.id;
    });

    if(findProductInCart){

      let newCart=[];
      let newItem;

      cart.forEach(cartItem=>{
        if(cartItem.id === product.id){
          newItem={
            ...cartItem,
            quantity:cartItem.quantity+1,
            totalAmount:cartItem.price*(cartItem.quantity+1)
          }
          newCart.push(newItem);
        }else{
          newCart.push(newItem);
        }
      })
        setCart(newCart);
        toast(`Added ${newItem.name} to cart`,toastOptions);
    }else{
      let addingProduct={
        ...product,
        'quantity':1,
        'totalAmount':product.price,
      }
      setCart([...cart,addingProduct]);
      toast(`Added ${product.name} to cart`,toastOptions);

    }
  }

  const removeProduct=(product)=>{
          const newCart=cart.filter(cartItem=>cartItem.id !== product.id);
          setCart(newCart);
  }

  const componentRef=useRef();

  const handleReactToPrint=useReactToPrint({
    content:()=>componentRef.current,
  });

  const handlePrint=()=>{
      handleReactToPrint();
  }

  useEffect(()=>{
    setQty(cart.reduce((sum,curr)=>sum+curr.quantity,0))
  },[cart]);

  useEffect(()=>{
      let newTotalAmount=0;
      cart.forEach(icart=>{
        newTotalAmount=newTotalAmount+parseInt(icart.totalAmount);
      })
      setTotalAmount(newTotalAmount);
  },[cart]);
  
  return (
    <MainLayout>
      <div className='row'>
        <div style={{display:"none"}}>
          <ComponentToPrint cart={cart} total={total} ref={componentRef}/>
        </div>
           <div className='col'>
                <tabel className='table'>
                  <thead className='thed'>
                    <tr className='trd'>
                      <td className='tmd'>Action</td>
                      <td className='tmd'>Products</td>
                      <td className='tmd'>price</td>
                      <td className='tmd_q'>Qty</td>
                      <td className='tmd'>Total</td>
                    </tr>
                  </thead>
                  <tbody className='tby'>
                    {
                      cart.length?cart.map((cartProduct,key)=>
                      <tr className='trd' key={key}>
                          <td className='tmd'>
                            <button className='btn_act' onClick={()=>removeProduct(cartProduct)}>❌</button>
                          </td>
                          <td className='tmd'>{cartProduct.name}</td>
                          <td className='tmd'>{cartProduct.price}</td>
                          <td className='tmd qtyd' >
                            <AddIcon onChange={(cartProduct.quantity)+1} className='ad' />
                            {cartProduct.quantity}
                            <RemoveIcon onChange={(cartProduct.quantity)-1} className='rm'/></td>
                          <td className='tmd'>{cartProduct.totalAmount}</td>
                      </tr>
                      
                      )
                      :<h2>{`THERE ARE NO PRODUCTS.`}</h2>
                    }

                  </tbody>
                  <tfoot className='ft'>
                    <tr>
                      <td>SubTotal</td>
                      <td>{total} EUR</td>
                      <td>{qty} item</td>
                    </tr>
                    <tr>
                      <td>VAT tax</td>
                      <td>{10} %</td>
                      <td>{(total*0.1).toFixed(4)}EUR</td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td>{10} %</td>
                      <td>{(total*0.1).toFixed(4)}EUR</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <h3>{total}EUR</h3>
                      </tr>
                    <tr>
                    <div className='sele'>
                      <button className='btn_c' onClick={()=>setCart([])}>CANCEL SELE</button>
                      
                      {
                        total !== 0?
                          <button className='btn_s' onClick={handlePrint}>PROCESS SELE</button>
                        :<button className='btn_s'>PROCESS SELE</button>
                      }
                      </div>
                    </tr>
                  </tfoot>
                </tabel>

        </div>
        <div className='col'>
          {isLoading ? "Loading": <div className='row_sub'>
            
          {products.map((product,key)=>
            <div  key={key} className='col_sub'>
              <div className='border' onClick={()=>addProductToCart(product)}>
                <p>{product.name}</p>
                <img src={product.image} className='pro_img' alt={product.name}/>
                <p className='prc'>{product.price} EUR</p>
              </div>
              
          </div>
           )}
            </div>}
          
        </div>
       
      </div>
    </MainLayout>
  )
}

export default POSPage;
