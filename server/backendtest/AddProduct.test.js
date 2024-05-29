import { render, screen, fireEvent } from '@testing-library/react';
import AddProduct from '../../client/src/pages/products/AddProduct';
import axios from 'axios'; 

jest.mock('axios'); 

describe('AddProduct', () => {
  test('submits the form with valid data', async () => {
    const mockNavigate = jest.fn(); 

    render(<AddProduct navigate={mockNavigate} />);

    const productNameInput = screen.getByLabelText(/Product Name:/i);
    const stockInput = screen.getByLabelText(/Stock Available:/i);
    const priceInput = screen.getByLabelText(/Price:/i);
    const submitButton = screen.getByText(/CREATE/i);

    fireEvent.change(productNameInput, { target: { value: 'New Product' } });
    fireEvent.change(stockInput, { target: { value: '10' } });
    fireEvent.change(priceInput, { target: { value: '19.99' } });

    await fireEvent.submit(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/user/products'); 

    axios.post.mockResolvedValueOnce({ data: { message: 'Product added successfully!' } });

    expect(axios.post).toHaveBeenCalledWith(`${config.API}/add`, {
      product_name: 'New Product',
      stock: 10, 
      price: 19.99, 
    });
  });

  test('shows error message on failed submission', async () => {
    const mockNavigate = jest.fn(); 

    render(<AddProduct navigate={mockNavigate} />);

    fireEvent.change(screen.getByLabelText(/Product Name:/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Stock Available:/i), { target: { value: '-5' } });
    fireEvent.change(screen.getByLabelText(/Price:/i), { target: { value: 'abc' } });

    await fireEvent.submit(screen.getByText(/CREATE/i));


    expect(mockNavigate).not.toHaveBeenCalled();

    axios.post.mockRejectedValueOnce(new Error('Internal server error'));

    expect(await screen.findByText(/An error occurred/i)).toBeInTheDocument();
  });
});
