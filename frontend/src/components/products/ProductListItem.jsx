import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'

export default function ProductListItem({ product }) {
    const dispatch = useDispatch()

    return (
        <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">

                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">{product.product_name}</h5>
                        <button
                            // onClick={handleAddToCart}
                            onClick={() => dispatch(addToCart(product))}
                            className="btn btn-outline-primary btn-sm"
                            title="Tambah ke keranjang"
                        >
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}