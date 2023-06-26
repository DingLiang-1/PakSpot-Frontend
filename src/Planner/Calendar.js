import React, {useState, useEffect, useReducer, useCallback} from "react";
import "./Calendar.css";

function Calendar(props) {
    
    function handleYearUpdate(event) {
        props.handleYearUpdate(event.target.value);
    
    };

    function handleMonthUpdate(event) {
        props.handleMonthUpdate(event.target.value);
    };
    
    function handleDateUpdate(event) {
        props.handleDateUpdate(JSON.parse(event.target.value));
    };

    let firstDayMonth = new Date(props.currentDateYear + "-" + ((props.currentDateMonth < 10) ? '0' + props.currentDateMonth : props.currentDateMonth) + "-01").getDay();
    let daysInMonth = (props.currentDateMonth === 2) ? 28 : ((props.currentDateMonth % 2 === 0) ? 30 : 31);
    let lastDayMonth = new Date(props.currentDateYear + "-" + ((props.currentDateMonth < 10) ? '0' + props.currentDateMonth : props.currentDateMonth) + "-" + daysInMonth).getDay();
    let daysFromPrevMonth = firstDayMonth;
    let daysFromNextMonth = 6 - lastDayMonth;

    let gridStart = Array.from({ length: daysFromPrevMonth }, (value, index) => index).reverse().map((content,index) => {
        let dateNumber = ((daysInMonth === 30) ? daysInMonth + 1 - content : daysInMonth - 1 - content);
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
        <select id = "calendar-year" onChange = {handleYearUpdate} defaultValue= {props.currentDateYear}>
            {Array.from({ length: 100 }, (value, index) => ((new Date().getFullYear() - 50) + index)).map((year) => (<option value = {year} >{year}</option>))}
        </select>
        {/*<input id = "calendar-year" onChange = {handleYearUpdate} value = {props.currentDateYear} placeholder = "YYYY"/> */}
        <select id = "calendar-month" onChange = {handleMonthUpdate} defaultValue = {props.currentDateMonth}>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month,index) => <option value = {index + 1} >{month}</option>)}
        </select>
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
