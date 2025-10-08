import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'


const OutProduct = () => {

    const [outProducts, setOutProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all') //untuk filter hari,mingguan 

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://127.0.0.1:8000/api/out-products')
            console.log('out product data: ', res.data);
            setOutProducts(res.data)
        } catch (error) {
            console.log('Error fetching data', error)
            toast.error('Failed to load out products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // filter berdasarkan date
    const getFilterTransaksi = () => {
        if (filter === 'all') return outProducts

        const now = new Date()
        return outProducts.filter(trx => {
            const trxDate = new Date(trx.date)

            if (filter === 'today') {
                return trxDate.toDateString() === now.toDateString()
            } else if (filter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                return trxDate >= weekAgo
            } else if (filter === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                return trxDate >= monthAgo
            }
            return true
        })
    }

    const filterTransaksi = getFilterTransaksi()

    // menghitung total transaksi 
    const totalTransaksi = filterTransaksi.length
    const totalItems = filterTransaksi.reduce((sum, trx) => {
        return sum + trx.product_detail.filter(detail => detail.status === 1).length
    }, 0)
    const totalQty = filterTransaksi.reduce((sum, trx) => {
        return sum + trx.product_detail
            .filter(detail => detail.status === 1)
            .reduce((itemSum, detail) => itemSum + detail.quantity, 0)
    }, 0)

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading out products...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-content-center mb-4">
                <h2>
                    <i className='bi bi-box-arrow-right me-2 text-success'></i>
                    Out Products History
                </h2>
                <button className='btn btn-outline-success' onClick={fetchData}>
                    <i className='bi bi-arrow-clockwise me-2'>Refresh</i>
                </button>
            </div>

            {/* card statistic transaksi */}
            {outProducts.length > 0 && (
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card bg-primary text-white shadow">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <h6 className='text-uppercase mb-1 '>Total Transaksi</h6>
                                        <h2 mb-0>{totalTransaksi}</h2>
                                    </div>
                                    <div className="">
                                        <i className='bi bi-receipt fs-1'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-primary text-white shadow">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <h6 className='text-uppercase mb-1 '>Total Items</h6>
                                        <h2 mb-0>{totalItems}</h2>
                                    </div>
                                    <div className="">
                                        <i className='bi bi-box-seam fs-1'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-primary text-dark shadow">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <h6 className='text-uppercase mb-1 '>Total Quantity</h6>
                                        <h2 mb-0>{totalQty}</h2>
                                    </div>
                                    <div className="">
                                        <i className='bi bi-arrow-down fs-1'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* filter button */}
            {outProducts.length > 0 && (
                <div className="btn-group" role='group'>
                    <button
                        type='button'
                        className={`btn ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('all')}
                    >
                        <i bi bi-list-ul me-1></i>
                        All
                    </button>

                    <button
                        type='button'
                        className={`btn ${filter === 'today' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('today')}
                    >
                        <i className='bi bi-calendar-day me-1'></i>
                        Today
                    </button>

                    <button
                        type='button'
                        className={`btn ${filter === 'week' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('week')}
                    >
                        <i className='bi bi-calendar-day me-1'></i>
                        Week
                    </button>

                    <button
                        type='button'
                        className={`btn ${filter === 'month' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('month')}
                    >
                        <i className='bi bi-calendar-day me-1'></i>
                        This Month
                    </button>
                </div>
            )}

            {/* List Transaksi */}
            {filterTransaksi.length === 0 ? (
                <div className="alert alert-info d-flex align-content-center" role='alert'>
                    <i className='bi bi-info-circle me-2 fs-4'></i>
                    <div className="">
                        {outProducts.length === 0
                            ? 'belum ada transaksi approve. submit transaksi approve terlebih dahulu'
                            : 'tidak menemukan traksaki'}
                    </div>
                </div>
            ) : (
                filterTransaksi.map((trx) => {
                    const approveItems = trx.product_detail.filter(detail => detail.status === 1)
                    // const totalQty = approveItems.reduce((sum, detail) => sum + detail.quantity, 0)
                    const totalQty = approveItems.reduce((sum, detail) => sum + detail.spv_qty, 0)

                    return (
                        <div key={trx.id} className="card mb-4 shadow-sm">
                            <div className="card-header bg-success text-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <h5 className='mb-0'><i className='bi bi-receipt me-2'></i> Transaksi #{trx.id}</h5>
                                        <small>
                                            <i className='bi bi-calendar me-1'></i>
                                            {new Date(trx.date).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        {trx.user && (
                                            <div className="">
                                                <i className='bi bi-person me-1'></i>
                                                <small>Request by: <strong>{trx.user.name}</strong></small>
                                            </div>
                                        )}
                                        <span className='badge bg-light text-dark mt-1'>
                                            <i className='bi bi-box-seam me-1'></i>
                                            {approveItems.length} items
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className='table table-hover table-bordered'>
                                        <thead className='table-light'>
                                            <tr>
                                                <th width="5%" className='text-center'>#</th>
                                                <th width="45%">
                                                    <i className='bi bi-box me-2'>Product Name & Quantity Out</i>
                                                </th>
                                                <th width="20%">
                                                    <i className='bi bi-person-check me-2'>Approved by (SPV)</i>
                                                </th>
                                                <th width="20%">
                                                    <i className='bi bi-bi-clock me-2'>Approved At (SPV)</i>
                                                </th>
                                                <th width="30%">
                                                    <i className='bi bi-bi-clock me-2'>Spv-qty</i>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approveItems.map((detail, index) => (
                                                <tr key={detail.id}>
                                                    <td className='text-center'>
                                                        <strong>{index + 1}</strong>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="">
                                                                <i className='bi bi-box-seam text-success me-2'></i>
                                                                <strong>{detail.product?.product_name || 'Unknown Product'}</strong>
                                                            </div>
                                                            <span className='badge bg-danger fs-6'>
                                                                <i className='bi bi-arrow-down me-1'></i>
                                                                {detail.spv_qty} pcs
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {detail.spv ? (
                                                            <span>
                                                                <i className='bi bi-person-badge text-primary me-1'></i>
                                                                User ID: <strong>{detail.spv}</strong>
                                                            </span>
                                                        ) : (
                                                            <span className='text-muted'>-</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {detail.approved_at ? (
                                                            <small>
                                                                <i className="bi bi-check-circle text-success me-1"></i>
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
                                                    <td className=''>
                                                        <span className='badge bg-success fs-6'>
                                                            <i className='bi bi-arrow-down-circle me-1'></i>
                                                            {detail.spv_qty} pcs
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan="1"></td>
                                                <td>
                                                    <strong>Total Quantity Out:</strong>
                                                </td>
                                                <td colSpan="3">
                                                    <span className="badge bg-danger fs-6">
                                                        <i className="bi bi-arrow-down-circle me-1"></i>
                                                        {totalQty} pcs
                                                    </span>
                                                </td>
                                            </tr>

                                            {/* <tr>
                                                <td colSpan="1">
                                                    <td>
                                                        <strong>Total stock product</strong>
                                                    </td>
                                                    <td colSpan="2">
                                                        <span className='badge bg-danger fs-6'>
                                                            <i className='bi bi-arrorow-down-circle me-1'></i>
                                                            {}
                                                        </span>
                                                    </td>
                                                </td>
                                            </tr> */}

                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}

        </div>
    )
}

export default OutProduct