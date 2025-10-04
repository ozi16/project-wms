import Cart from '../cart/Cart'
import ProductListItem from './ProductListItem'


export default function ProductList({ products }) {
    return (
        <>

            <div className='row'>
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            {
                                products.map(product => <ProductListItem key={product.id}
                                    product={product} />)
                            }
                        </div>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <Cart />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
