import axios from 'axios';

const UpdateProductForm = () => {
    const formData1 = {
        name: "Asus RO"
    }
    const handleSubmit = async (e) => {
        const formData = new FormData();
        formData.append('name', formData1.name);
        e.preventDefault();
        console.log(formData)
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/products/1', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data)
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Your other input fields */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default UpdateProductForm;

