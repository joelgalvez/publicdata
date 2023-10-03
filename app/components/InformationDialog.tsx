"use client"

import { React, useState } from 'react';

export default function Filter(props) {

    // const [on, setOn] = useState('on');
    const [open, setOpen] = useState('');

    const handleOpen = (e) => {
        let p = e.target.closest('.parent');
        let d = p.querySelector('dialog');
        d.showModal();
    }

    return (
        <>
            <div className="parent inline">
                <span className="cursor-pointer" onClick={handleOpen}>ⓘ</span >
                <dialog>
                    <form method="dialog">
                        {props.html}
                        <button>OK</button>
                    </form>
                </dialog>
            </div>
        </>
    )
}