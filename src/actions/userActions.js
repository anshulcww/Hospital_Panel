import { NEW_USER, GET_BOOKING, GET_INSIGHTS, GET_NOTIFICATIONS, GET_TIMESLOT, UNREAD_LENGTH, UNREAD_NOTIFICATION,
   GET_SOL_INSIGHTS, BUSINESS_EARN, BUSINESS_LOST, SOLUTION_USERS,
   GET_CATALOGUE
  } from './types';
import history from '../history';
import axios from 'axios';
// import { connect } from 'react-redux';

let baseUrl = "https://devapi.plunes.com/v4"
// let baseUrl = "https://plunes.co/v4"
// let baseUrl = "http://localhost:5000"
// let baseUrl = "http://3.6.212.85/v4"

export const updateUserServiceData = (data) => async dispatch => {
  let token = localStorage.getItem('token');
  return await axios.patch(baseUrl, '/analytics/updatePriceVariance', data, { 'headers': { 'Authorization': token } })
                    .then((res) => {
                      if(res.status === 200){
                        console.log(res.data)
                      }
                    })
}

export const getUserCatalogue = () => async dispatch => {
  let token = localStorage.getItem('token');
  return await axios.get(baseUrl + '/analytics/getServices', { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201) {
        //dispatch(getSolutionInsights())
        console.log(res.data, 'data')
        if(res.data.data && res.data.data.length > 0){
          dispatch({
            type : GET_CATALOGUE,
            payload : res.data.data
          })
        }
      }
    })
}


export const updateRealPrice = (uData) => async dispatch => {
  let obj = {
    "solutionId": uData.realUpdateData.solutionId,
    "serviceId": uData.realUpdateData.serviceId,
    "updatedPrice": Math.round(Number(uData.realUpdatePrice))
  }
  //console.log(typeof obj.updatedPrice, obj.updatedPrice)

  //console.log(uData, 'data')
  let token = localStorage.getItem('token');
  return await axios.put(baseUrl + '/solution', obj, { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201) {
        dispatch(getSolutionInsights())
        //console.log(res.data, 'data')
      }
    })
}


export const getMonthWiseUsers = (days) => async dispatch => {
    let token = localStorage.getItem('token');
    //console.log(token, 'monthWise')
    return await axios.get(baseUrl + '/analytics/solutionUsers', { 'headers': { 'Authorization': token } })
              .then((res) => {
                //console.log(res.data, 'data')
                //[0, 54, 62, null,null, null, null, null, null, null, null, null]
                let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let monthWiseCount = res.data.data;
                //console.log(monthWiseCount)
                if(monthWiseCount.length > 0){
                //let currentMonth = monthWiseCount[monthWiseCount.length - 1].month
                //console.log(curr)
                var d = new Date();
                var currentMonth = d.getMonth();
                var nextMonth = currentMonth+1;
                for(var i =0; i < monthWiseCount.length; i++){
                  let month = monthWiseCount[i].month;
                  let count  = monthWiseCount[i].count;
                  result[month] = count;
                  //console.log(result, 'result')
                }
                for (var j = nextMonth ;  j < result.length ; j++){
                    result[j] = null
                }
                dispatch({
                  type: SOLUTION_USERS,
                  payload : result
                })
                console.log(result, 'result')
              }
              })

            }


export const getAllBookings = (days) => async dispatch => {
  //let token = localStorage.getItem('token');
  let userId = localStorage.getItem('userId')
  //console.log(days, 'user id')
  return await axios.get(baseUrl + '/booking/all/' + days)
    .then((res) => {
      //console.log(res.data, 'data')
      if (res.status === 201 && res.data.success) {
        //console.log(res.data.booking.length)
        let bookings = res.data.booking.filter((b) => b.bookingStatus === 'Confirmed')
        //console.log(bookings)
        let userBookings = bookings.filter((b) => b.professionalId === userId);
        let otherBookings = bookings.filter((b) => b.professionalId !== userId);
        let businessEarn = 0;
        let businessLost = 0;
        userBookings.forEach((ub) => {
          //console.log(typeof ub.service.newPrice[0])
          businessEarn += ub.service.newPrice[0]
        })
        dispatch({
          type: BUSINESS_EARN,
          payload: businessEarn
        })
        otherBookings.forEach((ub) => {
          //console.log(typeof ub.service.newPrice[0])
          businessLost += ub.service.newPrice[0]
        })
        dispatch({
          type: BUSINESS_LOST,
          payload: businessLost
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

export const getSolutionInsights = () => async dispatch => {
  let token = localStorage.getItem('token');
  //let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY3OGQ5ZGUzNjY4YTI4MWVjZWUyYmQiLCJpYXQiOjE1ODUxMjE3Mzh9.NzWdxrlVF3Q5DMp_4_4yYP7D0HblbMG9M1G_18e0ILE"
  //console.log(token)
  return await axios.get(baseUrl+ '/analytics/solutionSearch', { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201) {
        dispatch({
          type: GET_SOL_INSIGHTS,
          payload: res.data.data
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

export const sendUpdateData = (uData) => async dispatch => {
  let obj = {
    "specialityId": uData.updateData.specialityId,
    "serviceId": uData.updateData.serviceId,
    "newPrice": Number(uData.updatePrice)
  }
  //console.log(typeof obj.newPrice, obj.newPrice)
  let token = localStorage.getItem('token');
  return await axios.patch(baseUrl + '/admin_panel/updatePrice', obj, { 'headers': { 'Authorization': token } })
    .then((res) => {
      //console.log(res.data)
      if (res.data.status === 1) {
        //console.log(res.data, 'data')
        dispatch(getInsights())
      }
    })
}

export const initiatePayment = (pData) => async dispatch => {
  //let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY3OGQ5ZGUzNjY4YTI4MWVjZWUyYmQiLCJpYXQiOjE1ODA4MjM5ODZ9.r01FAXk1mEdnsi0aMsmTfHxRTNtthl9oIv0D9_4_0-o'
  // console.log(pData)
  let body = {
    'bookingStatus': 'Requested',
    'bookingId': pData._id
  }
  let token = localStorage.getItem('token');
  return new Promise(async function (resolve, reject) {
    await axios.patch(baseUrl + '/admin_panel/paymentStatus', body, { headers: { "Authorization": `Bearer ${token}` } })
      .then((res) => {
        //console.log('data', res.status)
        if (res.status === 200) {
          resolve(true)
        } else {
          reject(false)
        }
      })
      .catch((e) => {
        reject(false)
      })
  })
}

export const getNotifications = () => async dispatch => {
  //  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY3OGQ5ZGUzNjY4YTI4MWVjZWUyYmQiLCJpYXQiOjE1ODA4MjM5ODZ9.r01FAXk1mEdnsi0aMsmTfHxRTNtthl9oIv0D9_4_0-o'
  let token = localStorage.getItem('token');
  return await axios.get(baseUrl + '/notification/0', { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201 && res.data.success) {
        let notifications = res.data.notifications
        let unreadNotifications = notifications.filter((f) =>
          f.read === false
        )
        dispatch({
          type: GET_NOTIFICATIONS,
          payload: res.data.notifications
        })
        console.log(unreadNotifications.length, 'unread notifications')
        if (unreadNotifications.length === 0) {
          dispatch({
            type: UNREAD_LENGTH,
            payload: null
          })
        } else {
          dispatch({
            type: UNREAD_LENGTH,
            payload: unreadNotifications.length
          })
        }
        dispatch({
          type: UNREAD_NOTIFICATION,
          payload: unreadNotifications
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}


export const sendCounterZero = (unreadData) => async dispatch => {
  //let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGY3OGQ5ZGUzNjY4YTI4MWVjZWUyYmQiLCJpYXQiOjE1ODA4MjM5ODZ9.r01FAXk1mEdnsi0aMsmTfHxRTNtthl9oIv0D9_4_0-o'
  let token = localStorage.getItem('token');
  return await axios.put(baseUrl + '/notification/', unreadData, { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201) {
        dispatch({
          type: UNREAD_LENGTH,
          payload: null
        })
      }
    })
    .catch((e) => {
      console.log(e)

    })
}

export const getTimeslot = () => async dispatch => {
  // console.log('asdfasf')
  let token = localStorage.getItem('token');
  let userId = localStorage.getItem('userId')
  return await axios.get(baseUrl + '/user/' + userId + '/timeSlots', { 'headers': { 'Authorization': token } })
    .then((res) => {
      // console.log(res, 'data');
      if (res.status === 201 && res.data.success) {
        // console.log(res.data.field, 'data');
        let field = res.data.field;
        let array = []
        field.forEach((f) => {
          let obj = {
            slots: f.slots,
            day: f.day[0].toUpperCase(),
            closed: f.closed.toString()
          }
          array.push(obj)
        })
        dispatch({
          type: GET_TIMESLOT,
          payload: array
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

export const getUserDetails = () => async dispatch => {
  // console.log('asdfasf')
  let token = localStorage.getItem('token')
  return await axios.get(baseUrl + '/user/whoami', { 'headers': { 'Authorization': token } })
    .then((res) => {
      // console.log(res, 'data');
      if (res.status === 201) {
        //console.log(res);
        dispatch({
          type: NEW_USER,
          payload: res.data
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

  export const createUser = userData => dispatch => {
    fetch(baseUrl + '/user/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(res => {
        //console.log(res, 'dsa')
        if (res.success === true) {
          dispatch({
            type: NEW_USER,
            payload: res.user
          })
          localStorage.setItem('token', res.token)
          localStorage.setItem('userId', res.user._id)
          history.push('/dashboard');
        }
        if (!res.success) {
          alert('User is already registered')
          return res.message
        }
      })
      .catch((e) => {
        console.log(e);
      })

  };

export const createLogin = loginData => async dispatch => {
  console.log(loginData, "login data")
  return await axios.post(baseUrl + '/user/login', loginData)
    .then(res => {
      console.log(res.data.success , 'data')
      if (res.data.success === true) {
        dispatch({
          type: NEW_USER,
          payload: res.data.user
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.user._id)
        history.push('/dashboard');
      }
    }
    )
    .catch((e) => {

    })

};
export const getBooking = () => async  dispatch => {
  let token = localStorage.getItem('token');
  return await axios.get(baseUrl + '/booking', { 'headers': { 'Authorization': token } })
    .then(res => {
      if (res.status === 201 && res.data.success) {
        let bookings = res.data.bookings;
        let userId = localStorage.getItem('userId')
        let businessBooking = []
        bookings.filter((b) => userId === b.professionalId)
        bookings.forEach((b) => {
          let pos = b.solutionServiceId.split("|")[2]
          let paidAmount = (Number(b.service.newPrice[pos]) - Number(b.creditsUsed)) * Number(b.paymentPercent) / 100;
          let totalAmount = Number(b.service.newPrice[pos]);
          let restAmount = (Number(b.service.newPrice[pos]) - Number(b.creditsUsed)) - paidAmount
          let bookDet = {
            '_id': b._id,
            'userName': b.userName,
            'bookingStatus': b.bookingStatus,
            'appointmentTime': b.appointmentTime,
            'serviceName': b.serviceName,
            'paidAmount': paidAmount,
            'totalAmount': totalAmount,
            'restAmount': restAmount,
            'creditsUsed': b.creditsUsed,
            'bookingId': b.referenceId,
            'redeemStatus': b.redeemStatus || null
          }
          // console.log(b._id);
          businessBooking.push(bookDet)
        })
        dispatch({
          type: GET_BOOKING,
          payload: businessBooking
        })
      }
    })


};
export const bankDetails = bankData => dispatch => {
  let token = localStorage.getItem('token');
  var body = {
    "bankDetails": bankData
  };
  fetch(baseUrl + '/user', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        dispatch(getUserDetails())
      }
    })
    .catch((e) => {

    })
};

export const getInsights = () => async dispatch => {
  let token = localStorage.getItem('token');
  return await axios.get(baseUrl + '/analytics/insight', { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201) {
        console.log(res.data, 'Insights')
        //console.log(res.data.data, 'data');
        dispatch({
          type: GET_INSIGHTS,
          payload: res.data.data
        })
      }
    })
    .catch((e) => {
      console.log(e)
    })
};

export const expertDetails = expertData => dispatch => {
  let token = localStorage.getItem('token');
  let array = []
  array.push(expertData)
  let body = {
    "doctors": array
  }
  fetch(baseUrl + '/user', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => {
      //console.log(res.success, 'dog');
      if (res.success === true) {
        dispatch(getUserDetails())
      }
    }
    )
    .catch((e) => {

    })

};


export const logout = () => dispatch => {
  let token = localStorage.getItem('token');
  console.log(token, 'token')
  axios.post(baseUrl + '/user/logout', "", { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } })
    .then((response) => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      history.push('/')
      window.onpopstate = (url) => {
        console.log(url)
        let token = localStorage.getItem('token');
        if (!token) {
          history.push('/')
        }
      }
    })
    .catch(error => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      history.push('/')
      window.onpopstate = (url) => {
        console.log(url)
        let token = localStorage.getItem('token');
        if (!token) {
          history.push('/')
        }
      }
      console.log(error, 'error')
    })
}
