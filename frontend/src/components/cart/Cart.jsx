import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decrementQ, incrementQ, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice'
import { toast } from 'react-toastify'
import axios from 'axios'


export default function Cart() {
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try {
            const payload = {
                cartItems: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    spv: null,
                    status: 0
                }))
            }

            const post = await axios.post('http://127.0.0.1:8000/api/transaksi', payload)

            toast.success("cart berhasil di submit")
            return post.data

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='row my-4'>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Quantity</th>

                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>

                                            <td>
                                                {item.product_name}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    style={{ width: "70px", textAlign: "center" }}
                                                    onChange={(e) => dispatch(updateQuantity({
                                                        ...item,
                                                        quantity: Number(e.target.value)
                                                    }))
                                                    }
                                                />

                                                <div className="d-inline ms-2">
                                                    {item.quantity < 10 && (
                                                        <>
                                                            <i
                                                                onClick={() => dispatch(decrementQ(item))}
                                                                style={{ cursor: 'pointer' }}
                                                                className="bi bi-caret-down"></i>

                                                            <i
                                                                onClick={() => dispatch(incrementQ(item))}
                                                                style={{ cursor: 'pointer' }}
                                                                className="bi bi-caret-up"></i>
                                                        </>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <i
                                                    onClick={() => dispatch(removeFromCart(item))}
                                                    style={{ cursor: 'pointer' }}
                                                    className="bi bi-cart-x text-danger"></i>
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                        <button className='btn btn-primary' onClick={handleSubmit}>Submit Transaksi</button>
                    </div>
                </div>
            </div>
        </div>
    )
}