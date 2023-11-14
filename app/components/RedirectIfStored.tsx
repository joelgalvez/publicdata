"use client"

import { React, useState, useEffect, useLayoutEffect } from 'react';

import { useRouter } from 'next/navigation'

export default function RedirectIfStored(props) {

    const router = useRouter();

    useLayoutEffect(() => {
        let q = localStorage.getItem('q');
        if (q) {
            router.replace('/q' + q);
        } else {
            router.replace('/q?city-Amsterdam=1&tag-Art=1&tag-New Music Now=1')
        }
    }, [router]);


    return (
        <div className="">

        </div>
    )
}