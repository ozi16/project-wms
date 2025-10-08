import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductApprove from './products/ProductApprove'
import { toast } from 'react-toastify'

const Approve = () => {
    // const [transaksiDetails, setTransaksiDetails] = useState([])
    const [transactions, setTransactions] = useState([])
    const [approvingAll, setApprovingAll] = useState({})
    const [spvQuantities, setSpvQuantities] = useState({})

    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/approve')
            console.log(res.data)
            // setTransaksiDetails(res.data)
            setTransactions(res.data)

            // initial spv quentity
            $initialQty = {}
            res.data.forEach(trx => {
                trx.product_detail.forEach(detail => {
                    $initialQty[detail.id] = detail.spv_qty || detail.quantity
                })
            })
            setSpvQuantities($initialQty)
        } catch {
            console.log(console.error())
            toast.error('failed to load transaksi')

        }
    }

    const handleSpvQtyChange = (detailId, value) => {
        setSpvQuantities(prev => ({
            ...prev,
            [detailId]: parseInt(value) || 0
        }))
    }

    const userId = 1


    // const handleApprove = async (id) => {
    //     try {
    //         await axios.post(`http://localhost:8000/api/approve/${id}`, {
    //             user_id: userId,
    //         })

    //         fetchData();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleApprove = async (id, maxQty) => {
        const spvQty = spvQuantities[id]

        // Validasi: spv_qty tidak boleh 0 atau kosong
        // if (!spvQty || spvQty <= 0) {
        //     toast.error('SPV Quantity harus lebih dari 0')
        //     return
        // }

        // validasi spv tidak boleh lebih besar dari quantity yang diminta
        // if (spvQty > maxQty) {
        //     toast.error(`SPV Quantity tidak boleh llebih dari ${maxQty}`)
        //     return
        // }

        try {
            const res = await axios.post(`http://localhost:8000/api/approve/${id}`, {
                user_id: userId,
                spv_qty: spvQty
            })

            if (res.data.success) {
                toast.success('Product approved success')
                fetchData()
            }
        } catch (error) {
            console.log('error approve product: ', error);
            toast.error(error.res?.data?.message || 'Failed to approve item')
        }
    }

    const handleSubmitTransaksi = async (trxId) => {
        if (!window.confirm('yakin? stock akan dikurangi')) {
            return
        }

        try {
            setLoading(true)
            const response = await axios.post('http://127.0.0.1:8000/api/approve/submit', {
                trx_id: trxId
            })

            if (response.data.success) {
                toast.success('Transaction submitted successfully! Stock has been updated.')
                fetchData()
            }
        } catch (error) {
            console.log('Error submitting transaction:', error)
            toast.error(error.response?.data?.message || 'Failed to submit transaction')
        } finally {
            setLoading(false)
        }
    }

    // Approve all items in transaction
    const handleApproveAll = async (trxId) => {
        setApprovingAll(prev => ({ ...prev, [trxId]: true }))

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/approve/approve-all/${trxId}`, {
                user_id: userId,
            })

            if (response.data.success) {
                toast.success(`All items approved! (${response.data.approved_count} items)`)
                fetchData()
            }
        } catch (error) {
            console.log('Error approving all items:', error)
            toast.error(error.response?.data?.message || 'Failed to approve all items')
        } finally {
            setApprovingAll(prev => ({ ...prev, [trxId]: false }))
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading transactions...</p>
                </div>
            </div>
        )
    }
    // return (
    //     // <ProductApprove transaksiDetails={transaksiDetails} />
    //     <div className="p-6">
    //         <h2  >Approve Table</h2>
    //         <table className='table table-bordered '>
    //             <thead>
    //                 <tr className=''>
    //                     {/* <th>NO</th> */}
    //                     <th>Product Name</th>
    //                     {/* <th>Trx ID</th> */}
    //                     <th>Quantity</th>
    //                     <th>SPV</th>
    //                     <th>Status</th>
    //                     <th>Approved At</th>
    //                     {/* <th>Action</th> */}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {transaksiDetails.map((detail) => (
    //                     <tr key={detail.id}>
    //                         {/* <td className='border '>{detail.id}</td> */}
    //                         <td className='border '>{detail.product?.product_name}</td>
    //                         {/* <td className='border '>{detail.trx_id}</td> */}
    //                         <td className='border'>{detail.quantity}</td>
    //                         <td className='border'>
    //                             {detail.status !== 1 ? (
    //                                 <button
    //                                     onClick={() => handleApprove(detail.id)}
    //                                     className='btn btn-primary'
    //                                 >Approve</button>
    //                             ) : (
    //                                 <span>Approved</span>
    //                             )}
    //                         </td>
    //                         <td className='border '>{detail.status === 1 ? "Approved" : "pending"}</td>
    //                         <td className='border'>{detail.approved_at ?? "-"}</td>
    //                         {/* <td className='border'>
    //                             {detail.status !== 1 ? (
    //                                 <button
    //                                     onClick={() => handleApprove(detail.id)}
    //                                     className='btn btn-primary'
    //                                 >Approve</button>
    //                             ) : (
    //                                 <span>Approved</span>
    //                             )}
    //                         </td> */}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //         <div className=" float-end">

    //             <button className='btn btn-primary mb-5 mt-3' >Submit Transaksi</button>
    //         </div>

    //     </div>
    // )
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-check-circle me-2"></i>
                    Approve Transactions
                </h2>
                <button
                    className="btn btn-outline-primary"
                    onClick={fetchData}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>
            </div>

            {transactions.length === 0 ? (
                <div className="alert alert-info d-flex align-items-center" role="alert">
                    <i className="bi bi-info-circle me-2"></i>
                    <div>
                        No pending transactions to approve
                    </div>
                </div>
            ) : (
                transactions.map((trx) => {
                    const allApproved = trx.product_detail.every(detail => detail.status === 1)
                    const hasApproved = trx.product_detail.some(detail => detail.status === 1)
                    const pendingCount = trx.product_detail.filter(detail => detail.status === 0).length
                    const hasPending = pendingCount > 0

                    return (
                        <div key={trx.id} className="card mb-4 shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">
                                            <i className="bi bi-receipt me-2"></i>
                                            Transaction #{trx.id}
                                        </h5>
                                        <small>
                                            <i className="bi bi-calendar me-1"></i>
                                            {new Date(trx.date).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                        {trx.user && (
                                            <small className="ms-3">
                                                <i className="bi bi-person me-1"></i>
                                                {trx.user.name}
                                            </small>
                                        )}
                                    </div>
                                    <div>
                                        {trx.notif_spv === 1 ? (
                                            <span className="badge bg-success fs-6">
                                                <i className="bi bi-check-circle me-1"></i>
                                                Submitted
                                            </span>
                                        ) : allApproved ? (
                                            <span className="badge bg-warning text-dark fs-6">
                                                <i className="bi bi-clock me-1"></i>
                                                Ready to Submit
                                            </span>
                                        ) : (
                                            <span className="badge bg-light text-dark fs-6">
                                                <i className="bi bi-hourglass-split me-1"></i>
                                                {pendingCount} Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {/* button approve semua */}
                                {hasPending && trx.notif_spv !== 1 && (
                                    <div className="mb-3">
                                        <button
                                            className='btn btn-success'
                                            onClick={() => handleApproveAll(trx.id)}
                                            disabled={approvingAll[trx.id]}
                                        >
                                            {approvingAll[trx.id] ? (
                                                <>
                                                    <span className='spinner-border spinner-border-sm me-2'></span>
                                                    Approving
                                                </>
                                            ) : (
                                                <>
                                                    <i className='bi bi-check-all me-2'></i>
                                                    Approve all ({pendingCount} items)
                                                </>
                                            )}

                                        </button>
                                    </div>
                                )}
                                <div className="table-responsive">
                                    <table className='table table-hover table-bordered'>
                                        <thead className="table-light">
                                            <tr>
                                                <th width="40%">
                                                    <i className="bi bi-box me-2"></i>
                                                    Product Name & Quantity
                                                </th>
                                                <th width="15%" className="text-center">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    Status
                                                </th>
                                                <th width="15%">
                                                    <i className="bi bi-person-check me-2"></i>
                                                    SPV Qty
                                                </th>
                                                <th width="20%">
                                                    <i className="bi bi-clock-history me-2"></i>
                                                    Approved At
                                                </th>

                                                {/* <th width="10%" className="text-center">
                                                    <i className="bi bi-gear me-2"></i>
                                                    Action
                                                </th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trx.product_detail.map((detail) => (
                                                <tr key={detail.id} className={detail.status === 1 ? 'table-success' : ''}>
                                                    <td>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{detail.product?.product_name || 'Unknown Product'}</strong>
                                                            </div>
                                                            <span className="badge bg-secondary fs-6 ms-2">
                                                                {detail.quantity} pcs
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        {detail.status === 1 ? (
                                                            <span className="badge bg-success">
                                                                <i className="bi bi-check-circle me-1"></i>
                                                                Approved
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">
                                                                <i className="bi bi-hourglass-split me-1"></i>
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className='d-flex align-items-center gap-2'>
                                                        {/* {detail.spv ? (
                                                            <span className="badge bg-info">
                                                                User #{detail.spv}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )} */}

                                                        <input
                                                            type="number"
                                                            // value={detail.quantity}
                                                            style={{ width: "40px", textAlign: "center" }}
                                                            value={spvQuantities[detail.id] || detail.quantity}
                                                            onChange={(e) => handleSpvQtyChange(detail.id, e.target.value)}
                                                            min="1"
                                                            max={detail.quantity}
                                                            disabled={trx.notif_spv === 1}
                                                        />

                                                        {detail.status !== 1 ? (
                                                            <button
                                                                onClick={() => handleApprove(detail.id, detail.quantity)}
                                                                className='btn btn-sm btn-primary'
                                                                disabled={trx.notif_spv === 1}
                                                            >
                                                                <i className="bi bi-check-lg me-1"></i>
                                                                Approve
                                                            </button>
                                                        ) : (
                                                            <span className="text-success">
                                                                <i className="bi bi-check-circle-fill fs-5"></i>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {detail.approved_at ? (
                                                            <small>
                                                                {new Date(detail.approved_at).toLocaleString('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </small>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>

                                                    {/* <td className="text-center">
                                                        {detail.status !== 1 ? (
                                                            <button
                                                                onClick={() => handleApprove(detail.id)}
                                                                className='btn btn-sm btn-primary'
                                                                disabled={trx.notif_spv === 1}
                                                            >
                                                                <i className="bi bi-check-lg me-1"></i>
                                                                Approve
                                                            </button>
                                                        ) : (
                                                            <span className="text-success">
                                                                <i className="bi bi-check-circle-fill fs-5"></i>
                                                            </span>
                                                        )}
                                                    </td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <div>
                                        {!allApproved && hasApproved && trx.notif_spv !== 1 && (
                                            <div className="alert alert-warning mb-0 py-2" role="alert">
                                                <i className="bi bi-exclamation-triangle me-2"></i>
                                                <small>Please approve all items before submitting the transaction</small>
                                            </div>
                                        )}
                                        {!hasApproved && trx.notif_spv !== 1 && (
                                            <div className="alert alert-info mb-0 py-2" role="alert">
                                                <i className="bi bi-info-circle me-2"></i>
                                                <small>Start by approving items in this transaction</small>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {allApproved && trx.notif_spv !== 1 && (
                                            <button
                                                className='btn btn-success btn-lg'
                                                onClick={() => handleSubmitTransaksi(trx.id)}
                                            >
                                                <i className="bi bi-send me-2"></i>
                                                Submit Transaksi
                                            </button>
                                        )}
                                        {trx.notif_spv === 1 && (
                                            <div className="alert alert-success mb-0 py-2" role="alert">
                                                <i className="bi bi-check-circle me-2"></i>
                                                <strong>Transaction submitted & stock updated</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default Approve