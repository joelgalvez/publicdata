"use client"

import { Router } from "next/router";
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import Image from 'next/image'


export default function Page({ params }) {

    const s = window.location;
    let string = s.toString();
    string = string.replace('/q?', '/api/subscribe?');

    let cnt = string.split('&').length;
    let ok = true;
    if (cnt < 2) {
        ok = false;
    }
    const router = useRouter()

    function back() {
        router.back();
    }

    const handleFocus = (event) => event.target.select();

    return (
        <>
            <div className="fixed top-0 p-2  left-0 w-full h-screen bg-black/50">
                <div className="w-full h-screen overflow-y-auto p-2 panel">
                    <div className="mb-2 cursor-pointer text-right text-3xl" onClick={back}>✕</div>
                    {ok &&
                        <div className="">
                            <div className="mb-2">
                                1. Filter your interests (on the previous screen)
                            </div>
                            <div className="mb-2">
                                2. Copy the following link
                            </div>
                            <div className="my-2 mb-8">
                                <input type="text" onClick={handleFocus} className="text-black w-full p-2 rounded-lg font-mono" value={string} />
                            </div>
                            <div className="mb-2">3. In iCal, File &gt; New Calendar Subscription.</div>
                            <div className="max-w-[70rem] mb-8">
                                <Image src="/ical.png" alt="" width={460} height={143} />
                            </div>
                            {/* <div className="mb-2">3. Paste the url</div>
                            <div className="max-w-[70rem] mb-8">
                                <Image src="/paste.png" alt="" width={547} height={135} />
                            </div> */}
                            <div className="mb-2">4. Paste the URL above, give it a name, and change the &quot;auto refresh&quot; to &quot;every day&quot;</div>
                            <div className="max-w-[70rem] mb-8">
                                <Image src="/sub.png" alt="" width={547} height={135} />
                            </div>

                            <div className="mb-16">5. Voila, you should now see your selection of public events! Instructions for other apps will follow.</div>

                        </div>
                    }
                    {!ok &&
                        <div className="">Seems like you are missing some parameters, try and <Link className="underline" href="/">go back</Link> and select some tags and cities</div>
                    }
                </div>

            </div>
        </>
    )
}