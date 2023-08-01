import React, {useState, useEffect, useReducer, useCallback} from "react";
import "./Calendar.css";

function daysInFeb(year) {
    if (year % 4 !== 0) {
        return 28;
    };
    if (year % 100 !== 0) {
        return 29;
    }; 
    if (year % 400 === 0) {
        return 29;
    };
    return 28;
};

function Calendar(props) {
    let firstDayMonth = new Date(props.currentDateYear + "-" + ((props.currentDateMonth < 10) ? '0' + props.currentDateMonth : props.currentDateMonth) + "-01").getDay();
    let daysInMonth = (props.currentDateMonth === 2) ? daysInFeb(props.currentDateYear ) : ((props.currentDateMonth % 2 === 0) ? 30 : 31);
    let lastDayMonth = new Date(props.currentDateYear + "-" + ((props.currentDateMonth < 10) ? '0' + props.currentDateMonth : props.currentDateMonth) + "-" + daysInMonth).getDay();
    let daysFromPrevMonth = firstDayMonth;
    let daysFromNextMonth = 6 - lastDayMonth;

    function handleYearUpdate(event) {
        props.handleYearUpdate(parseInt(event.target.value));
    };

    function handleMonthUpdate(event) {
        props.handleMonthUpdate(parseInt(event.target.value));
    };
    
    function handleDateUpdate(event) {
        props.handleDateUpdate(JSON.parse(event.target.value));
    };

    let gridStart = Array.from({ length: daysFromPrevMonth }, (value, index) => index).reverse().map((content,index) => {
        let dateNumber = (props.currentDateMonth === 3 ? (daysInFeb(props.currentDateYear) - content) : (props.currentDateMonth === 2) ? (31 - content) : ((daysInMonth === 30) ? (daysInMonth + 1 - content) : (daysInMonth - 1 - content)));
        let month = props.currentDateMonth - 1;
        let dateId = "" + props.currentDateYear + month + dateNumber;
        return (<button 
            key = {index} 
            id = {dateId} 
            className = "calendar-days"
            onClick = {handleDateUpdate}
            type = "button"
            value = {JSON.stringify({currentDateMonth : month, currentDateNumber : dateNumber})}
            >{dateNumber}</button>);
    });

    let gridEnd = Array.from({ length: daysFromNextMonth }, (value, index) => index).map((content,index) => {
        let dateNumber = 1 + index;
        let month = props.currentDateMonth + 1;
        let dateId = "" + props.currentDateYear + month + dateNumber;
        return (<button 
            key = {index} 
            className = "calendar-days"
            id = {dateId}
            type = "button"
            onClick = {handleDateUpdate}
            value = {JSON.stringify({currentDateMonth : month, currentDateNumber : dateNumber})}
            >{1 + index}</button>);
    });

    let gridMain = Array.from({ length: daysInMonth }, (value, index) => index).map((content,index) => {
        let dateNumber = 1 + index;
        let dateId = "" + props.currentDateYear + props.currentDateMonth + dateNumber;
        return (<button 
            key = {index} 
            id = {dateId} 
            type = "button"
            value = {JSON.stringify({currentDateNumber : dateNumber})}
            className = {"calendar-days" + ((dateId === ("" + props.currentDateYear + props.currentDateMonth + props.currentDateNumber)) ? " currentDate" : "")}
            onClick = {handleDateUpdate}
            >{dateNumber}{props.eventDays.includes("" + dateNumber) && <hr className = "has-event" />}</button>);
    });

    return (
        <div className = "calendar">
            <div className = "calender-select-container calendar-select-year">
                <select onChange = {handleYearUpdate} value= {props.currentDateYear}>
                    {Array.from({ length: 100 }, (value, index) => ((new Date().getFullYear() - 50) + index)).map((year,index) => (<option key = {index} value = {year} >{year}</option>))}
                </select>
                <i class="fa-solid fa-chevron-down fa-xs"></i>
            </div>
            <div className = "calender-select-container calendar-select-month">
                <select onChange = {handleMonthUpdate} value = {props.currentDateMonth}>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month,index) => (<option key = {index} value = {index + 1} >{month}</option>))}
                </select>
                <i class="fa-solid fa-chevron-down fa-2xs"></i>
            </div>
            <div className = "calendar-grid">
                {[<p className = "week-days">Sun</p>,<p className = "week-days">Mon</p>,<p className = "week-days">Tue</p>,<p className = "week-days">Wed</p>,<p className = "week-days">Thu</p>,<p className = "week-days">Fri</p>,<p className = "week-days">Sat</p>]}
                {gridStart}
                {gridMain}
                {gridEnd}
            </div>
        </div>
    );
};

export default Calendar;
