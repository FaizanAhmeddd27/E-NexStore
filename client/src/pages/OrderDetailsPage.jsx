import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails } from '../redux/thunks/orderThunks';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, currentLoading: loading, currentError: error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  if (loading) return <div className="container mx-auto px-4 py-20">Loading...</div>;

  if (error) return <div className="container mx-auto px-4 py-20 text-red-600">{error}</div>;

  if (!order) return (
    <div className="container mx-auto px-4 py-20">
      <p className="text-gray-600">Order not found</p>
      <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="mt-2"><strong>Status:</strong> {order.paymentStatus}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">${order.totalAmount?.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Items</h3>
          <div className="space-y-3">
            {order.products.map((item) => (
              <div key={item._id || item.product._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.product?.name || item.product}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p>${(item.price || 0).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Link to="/orders" className="btn-secondary">Back to Orders</Link>
          <div>
            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
