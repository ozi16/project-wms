
import React from 'react'

const ProductApprove = ({ transaksiDetails }) => {

    return (
        <div className="p-6">
            <h2  >Approve Table</h2>
            <table className='table table-bordered '>
                <thead>
                    <tr className=''>
                        <th>ID</th>
                        <th>Product ID</th>
                        <th>Trx ID</th>
                        <th>SPV</th>
                        <th>Quantity</th>
                        <th>Approved At</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transaksiDetails.map((detail) => {
                        <tr key={detail.id}>
                            <td className='border '>{detail.id}</td>
                            <td className='border '>{detail.product_id}</td>
                            <td className='border '>{detail.trx_id}</td>
                            <td className='border '>{detail.spv ?? "-"}</td>
                            <td className='border '>{detail.status === 1 ? "Approved" : "pending"}</td>
                            <td className='border'>{detail.quantity}</td>
                            <td className='border'>{detail.approved_at ?? "-"}</td>
                            <td className='border'>
                                {detail.status !== 1 ? (
                                    <button
                                        onClick={() => handleApprove(detail.id)}
                                        className='btn '
                                    >Approve</button>
                                ) : (
                                    <span>Approved</span>
                                )}
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ProductApprove