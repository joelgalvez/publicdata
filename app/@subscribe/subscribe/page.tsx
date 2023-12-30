"use client"

export default function Page({ params }) {

    const s = window.location;
    console.log(s);

    return (
        <>
            <div className="fixed top-0 p-2  left-0 w-full h-screen bg-black/50">
                <div className="w-full min-h-[80vh] p-2 panel">
                    Copy this url into iCal
                    <div className="my-2">
                        <input type="text" className="text-black w-full p-2 rounded-lg font-mono" value={s} />

                    </div>
                </div>

            </div>
        </>
    )
}