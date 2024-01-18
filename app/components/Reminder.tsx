"use client"

import Link from 'next/link'
import EventDate from './EventDate'
import moment from 'moment';
import { React, useState, useEffect, useLayoutEffect } from 'react';



export default function Reminder(props) {

    const [view, setView] = useState(true);

    return (
        <div>
            {view &&
                <div className=" w-[12rem] absolute right-4 shadow-xl">
                    <div className="flex justify-end">
                        <div className="h-2 w-4 mr-8">
                            <svg height="100%" width="100%" viewBox="0 0 20 10" style={{ fill: 'white' }}>
                                <polygon points="0,10 10,0 20,10 0,10" />
                            </svg>
                        </div>

                    </div>
                    <div className="p-4  bg-white text-black text-sm leading-tight rounded-lg relative">
                        <div className="float-right ml-4 mb-4 cursor-pointer" onClick={() => setView(false)}>⨉</div>
                        Get updates in your own calendar
                    </div>
                </div>

            }
        </div>

    )
}

