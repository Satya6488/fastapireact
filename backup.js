import React, { useState, useEffect } from 'react'
import api from './api';
const App = () => {
  const [transactions, setTransactions] = useState([])
  const [formData, setFormData] = useState({
    amount: '', category: '', description: '',
    is_income: false,
    date: ''
  });


  
  // to delete the data from the ui
  const handleDelete = async (itemId) => {
    await api.delete(`/transactions/${itemId}`)
      .then(() => {
        setTransactions(prevItems => prevItems.filter(item => item.id !== itemId));
      })
      .catch(error => console.error(error));
  };


  const fetchTransactions = async () => {
    const response = await api.get('/transactions/');
    setTransactions(response.data)
  };



  useEffect(() => {
    fetchTransactions();
  }, []);

  // post handel change
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };



// post handel subbmit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/transactions/', formData);
    fetchTransactions();
    setFormData({
      amount: '', category: '', description: '',
      is_income: false,
      date: ''
    });
  };
// handel Update data
const handelUpdate = ()=>{
  console.log("hello world")
//   history.push('/updateproduct')
}

  return (
    <div>
     
     <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            Finance App
          </a>
        </div>
      </nav>

      <div className='container'>
        <form onSubmit={handleFormSubmit}>
          <div className='mb-3 mt-3'>
            <label htmlFor="amount" className='form-label'>
            <h5>Amount</h5>
            </label>
            <input type="text" className='form-control' id='amount' name='amount' onChange={handleInputChange} value={formData.amount} />
          </div>

          <div className='mt-3'>
            <label htmlFor="category" className=' form-label'>
              <h5>category</h5>
            </label>

            {/* work on this */}
            {/* <input type="text" className='form-control' id='category' name='category' onChange={handleInputChange} value={formData.category} /> */}
            <select type="text" className='w-50 h5 border-2 border-success-subtle rounded-2 ms-2 mt-3 custom-select-lg mb-3' id='category' name='category' onChange={handleInputChange} value={formData.category} >
            <option value="Null">Select category</option>
              <option value="Book">Book</option>
              <option value="Note">Note</option>
              <option value="Pen">Pen</option>
            </select>

          </div>

          <div className='mt-3'>
            <label htmlFor="description" className='form-label'>
              <h5>description</h5>
            </label>
            <input type="text" className='form-control' id='description' name='description' onChange={handleInputChange} value={formData.description} />
          </div>

          <div className='mt-3'>
            <label htmlFor="is_income" className='form-label'>
          <h5>income?</h5>
            </label>
            <input type="checkbox" id='is_income' name='is_income' onChange={handleInputChange} value={formData.is_income} />
          </div>

          <div className='mt-3'>
            <label htmlFor="date" className='form-label'>
              Date?
            </label>
            <input type="text" className='form-control' id='date' name='date' onChange={handleInputChange} value={formData.date} />
          </div>

          <button type='submit' className='btn mt-2 btn-primary'>
            Submit
          </button>

        </form>

        <table id='contacts-header' className='table table-striped mt-3 table-bordered table-hover'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income?</th>
              <th>Date</th>
              <th>Delete Data</th>
              <th>Update Data</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                <td>{transaction.date}</td>

                <td><button className='btn btn-danger ms-lg-5' onClick={() => handleDelete(transaction.id)} >Delete</button></td>
                <td><button onClick={()=> handelUpdate(transaction.id)} className='btn text-text-decoration-none btn-success btn-sm' to={`/update/:${transaction.id}`}>Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>



      </div>
    </div>
  )
}
export default App




