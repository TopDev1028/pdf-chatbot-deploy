// import React, {Component} from 'reacat'
import './About.css'
import Navbar from '../../layout/Navbar';
import Footer from '../../layout/Footer';

const About = () => {
    return (
        <><Navbar/>
        <div className='main'>
            <div className='head'>
                <h1 className="title">
                Enhance your learning
                </h1>
                <h1 className='title'>
                    experience with ChatPDF
                </h1>
            </div>
            <div className='col-md-12 body'>
                <p className='head-text'>
                Comprehend textbooks, handouts, and presentations effortlessly. Don't spend hours flipping through 
                <br/>research papers and academic articles.<br/>
    Support your academic growth and succeed in your studies effectively and responsibly.
                </p>
                <br/>
                <br/>
                <br/>
                <div className='img'>
                   <img src="about.png" alt = "Image Cup" className='cup-img' />
                </div>
            </div>
            <div className='col-md-12 text-container'>
                <div className='row'>
                    <div className='col-md-4 mini_title'>
                        <h4>Enhance your learning<br />
                        experience with ChatPDF</h4>
                    </div>
                    <div className='col-md-8'>
                        <p className='mini_text'>Lorem ipsum dolor sit amet consectetur. Turpis sed commodo consectetur neque sed morbi. Tempor volutpat ac dui posuere elementum cras vitae est ultrices. Pellentesque ipsum placerat vel mattis nisi lorem. Velit nibh etiam ultricies diam eu. Lectus eu diam dignissim sodales at massa. Lacinia purus vel egestas elementum elit lacus. Eget donec nunc nibh quam in metus. Etiam turpis mauris etiam quis vitae. Arcu massa ut diam mi diam.
Eget arcu dignissim neque porttitor vitae. Pellentesque consectetur dolor pretium tortor proin nunc quis pellentesque. Maecenas aliquet pellentesque risus tempor at. Fusce eu sit commodo lobortis velit viverra vitae nunc ut. Amet congue justo odio ultricies nisl. Est sollicitudin volutpat nunc pharetra nisl proin. Sagittis arcu pellentesque condimentum amet mauris.
Ac in vitae accumsan sollicitudin auctor morbi sollicitudin dolor. Gravida netus mauris malesuada fames lacinia sit sed viverra massa. Risus sem magna commodo nec urna. Ornare proin viverra a justo. Ac nunc etiam dignissim platea morbi morbi curabitur facilisi. Id eu risus ligula ipsum urna semper facilisi.</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-4 mini_title'>
                        <h4>Enhance your learning<br />
                        experience with ChatPDF</h4>
                    </div>
                    <div className='col-md-8'>
                        <p className='mini_text'>Lorem ipsum dolor sit amet consectetur. Turpis sed commodo consectetur neque sed morbi. Tempor volutpat ac dui posuere elementum cras vitae est ultrices. Pellentesque ipsum placerat vel mattis nisi lorem. Velit nibh etiam ultricies diam eu. Lectus eu diam dignissim sodales at massa. Lacinia purus vel egestas elementum elit lacus. Eget donec nunc nibh quam in metus. Etiam turpis mauris etiam quis vitae. Arcu massa ut diam mi diam.
Eget arcu dignissim neque porttitor vitae. Pellentesque consectetur dolor pretium tortor proin nunc quis pellentesque. Maecenas aliquet pellentesque risus tempor at. Fusce eu sit commodo lobortis velit viverra vitae nunc ut. Amet congue justo odio ultricies nisl. Est sollicitudin volutpat nunc pharetra nisl proin. Sagittis arcu pellentesque condimentum amet mauris.
Ac in vitae accumsan sollicitudin auctor morbi sollicitudin dolor. Gravida netus mauris malesuada fames lacinia sit sed viverra massa. Risus sem magna commodo nec urna. Ornare proin viverra a justo. Ac nunc etiam dignissim platea morbi morbi curabitur facilisi. Id eu risus ligula ipsum urna semper facilisi.</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default About;