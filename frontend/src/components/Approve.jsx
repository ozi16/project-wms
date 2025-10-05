import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductApprove from './products/ProductApprove'

const Approve = () => {
    const [transaksiDetails, setTransaksiDetails] = useState([])

    const fetchData = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/approve')
            console.log(res.data)
            setTransaksiDetails(res.data)
        } catch {
            console.log(console.error())

        }
    }

    const userId = 1


    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/approve/${id}`, {
                user_id: userId,
            })
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        // <ProductApprove transaksiDetails={transaksiDetails} />
        <div className="p-6">
            <h2  >Approve Table</h2>
            <table className='table table-bordered '>
                <thead>
                    <tr className=''>
                        {/* <th>NO</th> */}
                        <th>Product Name</th>
                        {/* <th>Trx ID</th> */}
                        <th>Quantity</th>
                        <th>SPV</th>
                        <th>Status</th>
                        <th>Approved At</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {transaksiDetails.map((detail) => (
                        <tr key={detail.id}>
                            {/* <td className='border '>{detail.id}</td> */}
                            <td className='border '>{detail.product?.product_name}</td>
                            {/* <td className='border '>{detail.trx_id}</td> */}
                            <td className='border'>{detail.quantity}</td>
                            <td className='border'>
                                {detail.status !== 1 ? (
                                    <button
                                        onClick={() => handleApprove(detail.id)}
                                        className='btn btn-primary'
                                    >Approve</button>
                                ) : (
                                    <span>Approved</span>
                                )}
                            </td>
                            <td className='border '>{detail.status === 1 ? "Approved" : "pending"}</td>
                            <td className='border'>{detail.approved_at ?? "-"}</td>
                            {/* <td className='border'>
                                {detail.status !== 1 ? (
                                    <button
                                        onClick={() => handleApprove(detail.id)}
                                        className='btn btn-primary'
                                    >Approve</button>
                                ) : (
                                    <span>Approved</span>
                                )}
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className=" float-end">

                <button className='btn btn-primary mb-5 mt-3' >Submit Transaksi</button>
            </div>

        </div>
    )
}

export default Approve