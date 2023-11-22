import { useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';
import { formatDataTime } from '../utils/FormatDate';
import { useStateContext } from '../contexts/ContextProvider';
import IconTrash from '../assets/icons/IconTrash';
import IconEdit from '../assets/icons/IconEdit';

const Dashboard = () => {
    const [products, _setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = (() => {
        setLoading(true);
        axiosClient.get('/products')
            .then(({ data }) => {
                setLoading(false);
                _setProducts(data.products.data);
            })
            .catch(() => {
                setLoading(false)
            })
    })

    const onDelete = ((product) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }

        axiosClient.delete(`/products/${product.id}`)
            .then(() => {
                setNotification("Product was successfully deleted")
                getProducts();
            })
    })

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'

            }}>
                <h1>Dashboard</h1>
                <Link to="/products/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <div className="card animated fadeInDown">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Processor</th>
                                <th>Ram</th>
                                <th>Storage</th>
                                <th>Create Date</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {loading && <tbody>
                            <tr>
                                <td colSpan="10" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                        }
                        {!loading && <tbody>
                            {products.length > 0 && products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td style={{ color: 'red' }}>{product.price} $</td>
                                    <td>{product.processor}</td>
                                    <td>{product.ram}</td>
                                    <td>{product.storage}</td>
                                    <td>{formatDataTime(product.created_at)}</td>
                                    <td>
                                        <ul 
                                            style={{
                                                listStyleType: 'none'
                                            }}
                                        >
                                            {product.images.length > 0 && (
                                                <li key={product.images[0].id}>
                                                    <img
                                                        src={`http://localhost:8000/storage/${product.images[0].image_path}`}
                                                        alt={`Product ${product.id} Image`}
                                                        style={{ width: '100px', height: 'auto', margin: '5px' }}
                                                    />
                                                </li>
                                            )}
                                        </ul>
                                    </td>
                                    <td>
                                        <div   
                                            style={{
                                                display: 'flex',
                                            }}
                                        >
                                        <Link 
                                            className="btn-edit" 
                                            to={'/products/' + product.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            Edit&nbsp;
                                            <IconEdit 
                                                iconSize="20px" 
                                                iconColor="#ffffff"
                                            />
                                        </Link>
                                        &nbsp;&nbsp;
                                        <button 
                                            onClick={ev => onDelete(product)} 
                                            className="btn-delete"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Delete&nbsp;
                                            <IconTrash
                                                iconSize="20px" 
                                                iconColor="#ffffff"
                                            />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length <= 0 && <tr>
                                    <td colSpan="10" className="text-center">No Product</td>    
                                </tr>
                            }

                        </tbody>
                        }
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;