import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderHistory } from '../redux/thunks/orderThunks';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, count } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  if (loading) return <div className="container mx-auto px-4 py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {count === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Order #{order._id}</h3>
                  <p className="text-sm text-gray-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.totalAmount?.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.paymentStatus}</p>
                </div>
              </div>
              <div className="mt-3">
                <Link to={`/orders/${order._id}`} className="text-primary-500 font-medium">View details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
