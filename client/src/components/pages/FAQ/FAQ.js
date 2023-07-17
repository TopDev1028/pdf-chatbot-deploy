import './FAQ.css'
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';


const FAQ = () => {
    return (
        <><Navbar/>
        <div className='faq-container'>
            <div className='faq-title'>
                <h1>You have got questions?</h1>
                <br />
                <br />
                <p>We Have Got Answers!</p>
                <br />
                <br />
                <br />
                <br /> 
            </div>
            <div className='col-md-12 faq-card'>
                <div className='col-md-6' style={{ paddingRight: "5%" }}>
                    <>
                        <h4>Is there a free trial available?</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. Posuere orci mauris bibendum magna sed et. Vulputate.</p>
                    </>
                    <>
                        <h4>Is there a free trial available?</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. Posuere orci mauris bibendum magna sed et. Vulputate.</p>
                    </>
                    <>
                        <h4>Is there a free trial available?</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. Posuere orci mauris bibendum magna sed et. Vulputate.</p>
                    </>
                    <>
                        <h4>Is there a free trial available?</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. Posuere orci mauris bibendum magna sed et. Vulputate.</p>
                    </>
                    <>
                        <h4>Is there a free trial available?</h4>
                        <p>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. Posuere orci mauris bibendum magna sed et. Vulputate.</p>
                    </>
                </div>
                <div className='col-md-6'>
                    <img src = "student.png" alt="Image not Uploaded" className='img-stu'></img>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="square">
                <h4 className = "faq-question">Still have questions</h4>
                <div className='get-in-touch'>
                    <p className='faq-answer'>Lorem ipsum dolor sit amet consectetur. Fames duis nam nunc cras commodo. Id lacus elementum pharetra sed. </p>
                    <button className='get-in-touch-btn'>Get In Touch</button>
                </div>
            </div>
        </div>
        <Footer/>
        </>

    )
}

export default FAQ;