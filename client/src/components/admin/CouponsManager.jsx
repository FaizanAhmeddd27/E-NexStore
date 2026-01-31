import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Trash2 } from 'lucide-react';

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', discountPercentage: 10, expirationDate: '', maxUses: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/coupons');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        code: form.code,
        discountPercentage: Number(form.discountPercentage),
        expirationDate: form.expirationDate,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
      };

      const res = await axios.post('/admin/coupons', payload);
      setSuccess('Coupon created');
      setForm({ code: '', discountPercentage: 10, expirationDate: '', maxUses: '' });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/admin/coupons/${id}`);
      setSuccess('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Coupons</h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input name="code" value={form.code} onChange={handleChange} placeholder="Code (e.g., SAVE10)" className="input" required />
        <input name="discountPercentage" value={form.discountPercentage} onChange={handleChange} type="number" min="0" max="100" placeholder="Discount %" className="input" required />
        <input name="expirationDate" value={form.expirationDate} onChange={handleChange} type="date" className="input" required />
        <input name="maxUses" value={form.maxUses} onChange={handleChange} type="number" min="1" placeholder="Max Uses (optional)" className="input" />
        <div className="md:col-span-4">
          <button type="submit" className="btn-primary">Create Coupon</button>
        </div>
      </form>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {coupons.length === 0 ? (
            <p className="text-gray-600">No coupons yet.</p>
          ) : (
            coupons.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{c.code}</div>
                  <div className="text-sm text-gray-500">{c.discountPercentage}% off • Expires {new Date(c.expirationDate).toLocaleDateString()} • Uses: {c.currentUses}/{c.maxUses ?? '∞'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(c._id)} className="btn-danger flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CouponsManager;
