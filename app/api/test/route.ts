export const dynamic = "force-dynamic";

import prisma from '../../../lib/prisma'



export async function GET(request) {


    console.log('test');
    console.log(request.nextUrl.searchParams);



    return new Response('ok');

}