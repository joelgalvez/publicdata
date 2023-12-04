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
            router.replace(process.env.NEXT_PUBLIC_DEFAULT_URL);
        }
    }, [router]);


    return (
        <div className="">

        </div>
    )
}