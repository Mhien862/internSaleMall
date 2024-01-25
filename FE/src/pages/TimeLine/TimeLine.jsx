import { useEffect, useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import './TimeLine.scss'
import { getSchedule } from "../../stores/slices/Courses";
import { useSelector, useDispatch } from "react-redux";

export default function TimeLine() {
    const schedule = useSelector(getSchedule)
    const [listLessons, setListLessons] = useState('')

    const statusColor = (status) => {
        if (status.includes("DONE")) {
            return "#4BEE22";
        }
        if (status.includes("CANCELED")) {
            return "#FF0000";
        }
        if (status.includes("NEXT")) {
            return "#D04234";
        }
        return "#968EAB";
    }

    useEffect(() => {
        const data = []
        if (schedule && schedule.length > 0) {
            schedule.forEach((value) => {
                value.lessons.map(item => {
                    data.push({
                        id: item.id,
                        name: item.name ? item.name : "In Update...",
                        date: item.date ? item.date : "In Update...",
                        color: statusColor(item.status.toUpperCase())
                    })
                })

            });

            data.sort((a, b) => {
                return new Date(a.date) - new Date(b.date)
            })

            setListLessons(data)
        }
    }, [schedule])
    return (
        <div className='container-timeline in-row'>
            <span className='start-end'>Start</span>
            <Timeline position="alternate">
                {listLessons && listLessons.length > 0 ?
                    listLessons.map((item, index) => {
                        if (index % 2 === 0) {
                            return (
                                <TimelineItem key={item.id} sx={{ width: `${100 / listLessons.length}%` }}>
                                    <TimelineContent>
                                        <div className='date-course top'>
                                            <span>{item.date}</span>
                                        </div>
                                    </TimelineContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot variant="outlined" className='dot-outlined' sx={{ borderColor: item.color }}>
                                            <TimelineConnector />
                                            <TimelineDot sx={{ bgcolor: item.color }} />
                                            <TimelineConnector />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <div className='content-course'>
                                            <TimelineConnector />
                                            <TimelineDot />
                                            <div className='text'>
                                                <span className='bottom'>
                                                    {item.name}
                                                </span></div>
                                        </div>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        } else {
                            return (
                                <TimelineItem key={item.id} sx={{ width: `${100 / listLessons.length}%` }}>
                                    <TimelineContent>
                                        <div className='content-course'>
                                            <div className='text'>
                                                <span className='top'>
                                                    {item.name}
                                                </span>
                                            </div>
                                            <TimelineDot />
                                            <TimelineConnector />
                                        </div>
                                    </TimelineContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot variant="outlined" className='dot-outlined' sx={{ borderColor: item.color }}>
                                            <TimelineConnector />
                                            <TimelineDot sx={{ bgcolor: item.color }} />
                                            <TimelineConnector />
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <div className='date-course bottom'>
                                            <span>{item.date}</span>
                                        </div>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        }
                    })
                    :
                    <div className='none-lessons'>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineContent>
                                    <div className='date-course'>
                                    </div>
                                </TimelineContent>
                                <TimelineConnector />
                                <TimelineContent>
                                    <div className='content-course'>
                                    </div>
                                </TimelineContent>
                            </TimelineSeparator>
                        </TimelineItem>
                    </div>
                }
            </Timeline>
            <span className='start-end'>End</span>
        </div>
    );
}