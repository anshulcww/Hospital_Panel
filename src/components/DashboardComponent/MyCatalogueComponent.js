import React, { Component } from 'react';
import SidebarComponent from './SidebarComponent';
import DashboardHeader from './DashboardHeader';
//import "./AvailabilityComponent.css";
import "./MyCatalogueComponent.css";
import { getUserCatalogue } from '../../actions/userActions'
import { updateUserServiceData } from '../../actions/userActions'
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner'
import Modal from 'react-modal';

// import history from '../../history';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class MyCatalogueComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            rowsToDisplay: 20,
            selectedService:{},
            selectedServicePrice : '',
            selectedServiceVariance : '',
            modalIsOpen : false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleService = this.handleService.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleServiceData = this.handleServiceData.bind(this);

    }

    async handleServiceData(){
        let sData = {
            'serviceId' : this.state.selectedServiceId,
            'newPrice' : Number(this.state.selectedServicePrice),
            'newVariance' : Number(this.state.selectedServiceVariance)
        }
        await this.props.updateUserServiceData(sData)
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async handleService(selectedService){
        console.log(selectedService)
        this.setState({
            selectedService : selectedService.service,
            selectedServicePrice : selectedService.price[0],
            selectedServiceVariance : selectedService.variance,
            selectedServiceId : selectedService.serviceId,
            modalIsOpen : true
        })
    }

    async componentDidMount() {
        await this.props.getUserCatalogue()
    }

    handleClick() {
        this.setState({
            rowsToDisplay: this.state.rowsToDisplay + 5
        })
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <DashboardHeader />
                </div>
                <div className='row'>
                    <div className='col-md-3'>
                        <SidebarComponent />
                    </div>
                    <div className='col-md-6 catalogueComponent'>
                        <div className='row justify-content-center'>
                            <p className='catalogue'>Catalogue</p>
                        </div>
                        <div className='listOfService'>
                            <div className='row listOfServiceHeading'>
                                <div className='col-md-6'>
                                    Test Name
                                </div>
                                <div className='col-md-2'>
                                    Price
                            </div>
                                <div className='col-md-2'>
                                    Variance
                            </div>
                                <div className='col-md-2'>
                                    Edit Service
                            </div>
                            </div>
                        </div>
                        {
                            this.props.catalogues.length > 0 ? this.props.catalogues.slice(0, this.state.rowsToDisplay).map((c, i) => (
                                <div key={i}>
                                    <div className='row listOfService' >
                                        <div className='col-md-6'>{c.service}</div>
                                        <div className='col-md-2'>Rs. {c.price[0]}</div>
                                        <div className='col-md-2 catalogueVariance'>{c.variance}%</div>
                                        <div className='col-md-2'><button type='button' onClick={(e) => this.handleService(c)}>Edit</button></div>
                                    </div>
                                    <div className='row listOfService'>
                                        <div className='col-md-8'><hr></hr></div>
                                        <div className='col-md-4'></div>
                                    </div>
                                </div>
                            )) :
                                <div>No Catalogue</div>
                        }
                                  <Modal
                                        isOpen={this.state.modalIsOpen}
                                        onAfterOpen={this.afterOpenModal}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                        ariaHideApp={false}
                                        contentLabel="Example Modal" className='redeemModal'>
                                            <div>
                                                {this.state.selectedService}
                                            </div>
                                            <input type='text' name = 'selectedServicePrice' onChange ={this.handleChange} value={this.state.selectedServicePrice} ></input>
                                            <input type='text' name = 'selectedServiceVariance' onChange ={this.handleChange} value={this.state.selectedServiceVariance} ></input>
                                            <div className="text-center"><button style={{ fontSize: '25px', border: 'none' }} type='button' onClick={this.handleServiceData} className="InsightUpdate"><u>Apply Here</u></button></div>
                                    </Modal>
                        <div className='text-center'>
                            <button onClick={this.handleClick} className="catalogueViewMore">View more</button>
                        </div>
                    </div>
                    <div className='col-md-3'></div>
                </div>
                <br />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    catalogues: state.user.catalogues
})

export default connect(mapStateToProps, { getUserCatalogue, updateUserServiceData })(MyCatalogueComponent);
