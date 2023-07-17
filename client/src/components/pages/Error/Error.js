import './Error.css';
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';

const Error = () => {
    return (
        <><Navbar/>
        <div className="error-container">
            <h2 className="Ooops"> Ooops.....</h2>
            <h1 className="error-num">4  0  4</h1>
            <h2 className="page-not-found">PAGE NOT FOUND</h2>
        </div>
        <Footer />
        </>
    )
}

export default Error